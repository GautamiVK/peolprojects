jQuery.sap.require("com.peol.util.Formatters");
jQuery.sap.require("com.peol.utils.SessionManager");
sap.ui.controller("com.peol.view.Approve_Master", {
	onInit : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);

			}, this)
		});
		this.oModel = sap.ui.getCore().getModel("leaveApprovalModel");
		this.getView().setModel(this.oModel);
		this.list = this.getView().byId("list");
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	},

	resourceBundle : {
		getText : function(key,array) {
			return sap.ui.getCore().getModel("i18n").getResourceBundle().getText(key,array);
		}
	},

	_handleRouterMatched : function(evt) {
		if(evt.getParameter("name")=="Approve_Master"){
			com.peol.utils.SessionManager.checkManager();
			var itemTemplate = new sap.m.ObjectListItem({
				type : "Active",
				title : "{RequesterName}",
				number : "{AbsenceDays}",
				numberUnit : this.resourceBundle.getText("LR_DAYS"),
				attributes : [ /*new sap.m.ObjectAttribute({
					text : "{LeaveTypeDesc}"
				}),*/ new sap.m.ObjectAttribute({
					text : {
						path : 'StartDate',
						formatter : com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyyLong
					}
				}), new sap.m.ObjectAttribute({
					text : {
						path : 'EndtDate',
						formatter : com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyyLong
					}
				}) ],
				firstStatus : new sap.m.ObjectStatus({
					text : {
						path:'ChangeDate',
						formatter: com.peol.util.Formatter.getDifferenceBetweenToday
					}

				}),
				secondStatus : new sap.m.ObjectStatus({
					state : "Error",
					text : ""
				}),
				press : this.handleListSelect
			});
			var that = this;
			this.oModel.read("/LeaveRequestCollection?$filter=RequesterNumber eq '" + EMPLOYEE_ID + "' and SessionID eq '" + SESSION_ID + "'", null, [], true, function(o, r) {
				that.list.setModel(new sap.ui.model.json.JSONModel({ApproveCollection:o.results}));
				that.list.bindAggregation("items", {
					path : "/ApproveCollection",
					template : itemTemplate
				});
			}, null); 
			
			/*new*/
		  var from = evt.getParameter("arguments").from ;
			if(from === "tile" ){ 
				if(!jQuery.device.is.phone){
			      sap.ui.core.UIComponent.getRouterFor(this).navTo("empty", null, false);
				}
			}
		}
	},
	handleListSelect : function(evt) {
		var context = evt.getSource().getBindingContext();
		_APPROVE_CONTEXT = context;
		context = {
			contextPath : encodeURIComponent(context)
		};
		var router = sap.ui.core.UIComponent.getRouterFor(_that);
		router.navTo("Approve_Detail", context, false);
	},

	changeView : function(evt) {
		/* var context = evt.getSource().getBindingContext(); */
		this.nav.to("Create");
	},

	handleSearch : function(evt) {
		var key = evt.getParameter("newValue");
		var finalfilter=[];
		finalfilter.push(new sap.ui.model.Filter("AbsenceTypeName",sap.ui.model.FilterOperator.Contains,key));
		finalfilter.push(new sap.ui.model.Filter("RequesterName",sap.ui.model.FilterOperator.Contains,key));
		finalfilter.push(new sap.ui.model.Filter("RequestID",sap.ui.model.FilterOperator.Contains,key));
		var filter=new sap.ui.model.Filter(finalfilter,false);
		this.byId("list").getBinding("items").filter(filter, "Application");
	},
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	},
	goBack : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(_that);
		router.navTo("Tile", null, true);
	}
});