jQuery.sap.declare("com.peol.Component");
sap.ui.core.UIComponent.extend("com.peol.Component", {
	metadata : {
		routing : {
			config : {
				viewType : "XML",
				viewPath : "view",
				targetControl : "navContainer",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "Home",
				view : "Home"
			}, {
				pattern : "tiles",
				name : "Tile",
				view : "Tile"
			}, {
				pattern : "calendar",
				name : "initial",
				view : "initial"
			},
			{
				pattern : "change/{RequestID}",
				name : "change",
				view : "initial"
			}, {
				targetControl : "navContainer",
				name : "MasterDetailContainer",
				view : "MasterDetailContainer",
				subroutes : [ {
					targetControl : "MasterDetailPage",
					targetAggregation : "masterPages",
					pattern : "HistoryMaster/{from}",
					name : "History_Master",
					view : "History_Master"
				}, {
					targetControl : "MasterDetailPage",
					targetAggregation : "detailPages",
					pattern : "HistoryDetail/{contextPath}",
					name : "History_Detail",
					view : "History_Detail"
				}, {
					targetControl : "MasterDetailPage",
					targetAggregation : "masterPages",
					pattern : "ApproveMaster/{from}",
					name : "Approve_Master",
					view : "Approve_Master"
				}, {
					targetControl : "MasterDetailPage",
					targetAggregation : "detailPages",
					pattern : "ApproveDetail/{contextPath}",
					name : "Approve_Detail",
					view : "Approve_Detail"
				}, {
					targetControl : "MasterDetailPage",
					targetAggregation : "detailPages",
					pattern : "TeamCalender/{RequestID}",
					name : "TeamCalendar",
					view : "TeamCalendar"
				}, {
					targetControl : "MasterDetailPage",
					targetAggregation : "detailPages",
					pattern : "empty",
					name : "empty",
					view : "empty"
				},{
					targetControl : "MasterDetailPage",
					targetAggregation : "masterPages",
					pattern : "Resumption_Master/{from}",
					name : "Resumption_Master",
					view : "Resumption_Master"
				}, {
					targetControl : "MasterDetailPage",
					targetAggregation : "detailPages",
					pattern : "Resumption_Detail/{contextPath}",
					name : "Resumption_Detail",
					view : "Resumption_Detail"
				} ]
			}, /*
			 * { targetControl : "navContainer", pattern : "ThirdPage/{id}",
			 * name : "Third", view : "Third", subroutes : [ { targetControl :
			 * "third", targetAggregation : "masterPages", pattern :
			 * "Master", name : "Master", view : "Master", subroutes : [ {
			 * targetAggregation : "detailPages", pattern : "Detail", name :
			 * "Detail", view : "Detail" } ] } ]
			 */
			]
		}
	},
	init : function() {
		jQuery.sap.require("sap.ui.core.routing.History");
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		jQuery.sap.require("com.peol.utils.SessionManager");
	
		/*var username="FIORIRFC";
		var password="Alghanim$1";*/
		
		var username="nikhil";
		var password="Peol123$";
		
		//proxy/http/aikwssv-fiori.alghanim.com:8000
		
		var logInurl = "proxy/http/aikwssv-fiori.alghanim.com:8000/sap/opu/odata/sap/ZLEAVELOGIN_SRV/";
		var logInoModel = new sap.ui.model.odata.ODataModel(logInurl, true, username, password);
		sap.ui.getCore().setModel(logInoModel, "logInModel");

		var logOuturl = "proxy/http/aikwssv-fiori.alghanim.com:8000/sap/opu/odata/sap/ZLEAVELOGOUT_SRV/";
		var logOutoModel = new sap.ui.model.odata.ODataModel(logOuturl, true, username, password);
		sap.ui.getCore().setModel(logOutoModel, "logOutModel");

		var leaveReqUrl = "proxy/http/aikwssv-fiori.alghanim.com:8000/sap/opu/odata/sap/ZLEAVE_REQUEST_SRV/";
		var leaveReqModel = new sap.ui.model.odata.ODataModel(leaveReqUrl, true, username, password);
		sap.ui.getCore().setModel(leaveReqModel, "leaveReqModel");

		var leaveApprovalUrl = "proxy/http/aikwssv-fiori.alghanim.com:8000/sap/opu/odata/sap/ZLEAVE_APPROVAL_SRV/";
		var leaveApprovalModel = new sap.ui.model.odata.ODataModel(leaveApprovalUrl, true, username, password);
		sap.ui.getCore().setModel(leaveApprovalModel, "leaveApprovalModel");
		
		var leaveResumptionUrl="proxy/http/aikwssv-fiori.alghanim.com:8000/sap/opu/odata/sap/ZLEAVE_APPROVAL_RESUM_SRV/";
		var leaveResumptionModel = new sap.ui.model.odata.ODataModel(leaveResumptionUrl, true, username, password);
		sap.ui.getCore().setModel(leaveResumptionModel, "leaveResumptionModel");

		var ResumptionUrl="proxy/http/aikwssv-fiori.alghanim.com:8000/sap/opu/odata/sap/ZLEAVE_RESUM_CREATE_SRV/";
		var ResumptionModel = new sap.ui.model.odata.ODataModel(ResumptionUrl, true, username, password);
		sap.ui.getCore().setModel(ResumptionModel, "ResumptionModel");
		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/i18n.properties"
		});
		sap.ui.getCore().setModel(i18nModel, "i18n");
		sap.ui.core.UIComponent.prototype.init.apply(this);
		com.peol.utils.SessionManager.init().invalidateSession();
		var router = this.getRouter();
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
		router.initialize();
	},
	destroy : function() {
		if (this.routeHandler) {
			this.routeHandler.destroy();
			sap.ui.core.UIComponent.destroy.apply(this);
		}
	},
	createContent : function() {
		this.view = sap.ui.view({
			id : "app",
			viewName : "view.App",
			type : sap.ui.core.mvc.ViewType.JS
		});
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/i18n.properties"
		});
		this.view.setModel(i18nModel, "i18n");
		var deviceModel = new sap.ui.model.json.JSONModel({
			isPhone : jQuery.device.is.phone,
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.view.setModel(deviceModel, "device");
		return this.view;
	}
});