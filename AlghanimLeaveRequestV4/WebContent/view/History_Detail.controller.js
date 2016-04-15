jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("com.peol.utils.Conversions");
sap.ui.controller("com.peol.view.History_Detail", {

	resourceBundle : {
		getText : function(key, array) {
			return _that.getView().getModel("i18n").getResourceBundle().getText(key, array);
		}
	},

	onInit : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
		/*
		 * this.getView().addEventDelegate({ onBeforeShow :
		 * jQuery.proxy(function(evt) { this.onBeforeShow(evt); }, this) });
		 */
		com.peol.util.Formatters.init(this.resourceBundle);
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	},
	pressPDF : function(evt) {
		var btn = evt.getSource().mProperties.text;
		var pernr = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).EmployeeID;
		var aRelatedRequests = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).aRelatedRequests;
		if(aRelatedRequests == undefined){
			var RequestId = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).RequestID;
			var VersionNo = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).ChangeStateID;
		} else {
			var RequestId = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).aRelatedRequests[0].RequestID;
			var VersionNo = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).aRelatedRequests[0].ChangeStateID;
		}		
		var VersionNo = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).ChangeStateID;
		var oBtnCancel = new sap.m.Button({
			icon : "sap-icon://sys-cancel",
			press : function() {
				oDialog.close();
			}
		});
		var oDialog = new sap.m.Dialog({
			title : "PDF",
			type : "Standard",
			contentWidth : "800px",
			contentHeight : "700px",
			beginButton : oBtnCancel
		});

		if(btn==this.resourceBundle.getText("XBUT_PRINT_LEAVE"))
		{	

			oDialog.addContent(new sap.ui.core.HTML({
				preferDOM : false,
				content : "<iframe id='adobeTag' src='/sap/opu/odata/sap/ZLEAVE_REQUEST_SRV/SmartformDisplayCollection(Pernr=%27" + pernr + "%27,Requestid=%27" + RequestId + "%27,VersionNo=%27" + VersionNo + "%27,Resubmit=0)/$value' width='750' height='1100'></iframe>"
			}));
			oDialog.open();
		}
		else{

			oDialog.addContent(new sap.ui.core.HTML({
				preferDOM : true,
				content : "<iframe id='adobeTag' src='/sap/opu/odata/sap/ZLEAVE_REQUEST_SRV/SmartformDisplayCollection(Pernr=%27" + pernr + "%27,Requestid=%27" + RequestId + "%27,VersionNo=%27" + VersionNo + "%27,Resubmit=1)/$value' width='750' height='1100'></iframe>"
			}));
			oDialog.open();
		}

	},

	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	},
	_handleRouterMatched : function(evt) {
		if (evt.getParameter("name") == "History_Detail") {
			var _this = this;
			var arguments = decodeURIComponent(evt.getParameter("arguments").contextPath);
			// var context = new
			// sap.ui.model.Context(sap.ui.getCore().getModel("leaveReqModel"),arguments);
			var context = _HISTORY_CONTEXT;
			var page = this.getView();
			page.setModel(context.oModel);
			page.setBindingContext(context);
			
			

			var lblOrigDate = _this.byId("LRS6B_LBL_ORIGINAL_DATE");
			/*var hdrStartDate = _this.byId("LRS6B_HEADER_START_DATE");
			var hdrEndDate = _this.byId("LRS6B_HEADER_END_DATE");*/
			var lblChngedDate = _this.byId("LRS6B_LBL_CHANGED_DATE");
//			var hdrNewStartDate = _this.byId("LRS6B_NEW_HEADER_START_DATE");
//			var hdrNewEndDate = _this.byId("LRS6B_NEW_HEADER_END_DATE");

			var curntLeaveRequest = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath);
//			lblOrigDate.setVisible(com.peol.util.Formatters.SET_RELATED_VISIBILITY(curntLeaveRequest.aRelatedRequests));
//			lblChngedDate.setVisible(com.peol.util.Formatters.SET_RELATED_VISIBILITY(curntLeaveRequest.aRelatedRequests));
//			hdrNewStartDate.setVisible(com.peol.util.Formatters.SET_RELATED_START_DATE_VISIBILITY(curntLeaveRequest.aRelatedRequests));
//			hdrNewStartDate.setText(com.peol.util.Formatters.FORMAT_RELATED_START_DATE_LONG(curntLeaveRequest.aRelatedRequests));
//			hdrNewEndDate.setVisible(com.peol.util.Formatters.SET_RELATED_END_DATE_VISIBILITY(curntLeaveRequest.aRelatedRequests));
//			hdrNewEndDate.setText(com.peol.util.Formatters.FORMAT_RELATED_END_DATE_LONG(_this.resourceBundle.getText("LR_HYPHEN"), curntLeaveRequest.aRelatedRequests));


		}
	},
	changeLeaveRequest : function(evt) {
		var reqId = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).RequestID;
		if (reqId == "")
			reqId = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).LeaveKey;
		this.router.navTo("change", {
			RequestID : reqId
		}, false);
	},

	withdrawLeaveRequest : function(evt) {

		var _ = this

		var oModel = sap.ui.getCore().getModel("leaveReqModel");


		var additionalinfo = [ {
			label : this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).AbsenceTypeName,
			text : com.peol.util.Formatter.dateFormate(this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).StartDate) + " "+_.resourceBundle.getText("LR_TO")+" " + com.peol.util.Formatter.dateFormate(this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).EndDate1) 
		}, ];
		if (this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).LeaveTypeDesc1 != "") {
			var adData = {
					label : this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).LeaveTypeDesc1,
					text : com.peol.util.Formatter.dateFormate(this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).StartDate1) + " "+_.resourceBundle.getText("LR_TO")+" " + com.peol.util.Formatter.dateFormate(this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()).EndDate) 
			};
			additionalinfo.push(adData);
		}

		var popupmodel = {
				question : _.resourceBundle.getText("dialog.question.withdraw"),
				additionalInformation : additionalinfo,
				showNote : false,
				title : _.resourceBundle.getText("LR_TITLE_WITHDRAW"),
				confirmButtonLabel : _.resourceBundle.getText("LR_OK")
		};

		sap.ca.ui.dialog.factory.confirm(popupmodel, function(r) {
			if (r.isConfirmed == true) {
				var employeeid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).EmployeeID;
				var aRelatedRequests = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).aRelatedRequests;
				if(aRelatedRequests == undefined){
					var requestid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).RequestID;
					var changestateid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).ChangeStateID;
				} else {
					var requestid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).aRelatedRequests[0].RequestID;
					var changestateid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).aRelatedRequests[0].ChangeStateID;
				}
				var leavekey = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).LeaveKey;

				/*
				var changestateid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).ChangeStateID;
				var requestid = _HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath).RequestID;var oEntry = {};
				oEntry.EmployeeID = employeeid;
				oEntry.ChangeStateID = changestateid;
					oEntry.RequestID = requestid;
						oEntry.LeaveKey = leavekey;
				oModel.remove("/LeaveRequestCollection",oEntry, null, function(){
					alert("Delete successful");
				},function(){
					alert("Delete failed");});*/

				var callfailed = function(o, r) {
					var response = JSON.parse(o.response.body);
					var error = response.error.message.value;
					var dialog = new sap.m.Dialog({
						title : "Warning",
						type : "Message",
						content : [ new sap.m.Text({
							text : error
						}) ],
						beginButton : new sap.m.Button({
							text : "Close",
							press : function() {
								dialog.close();
							}
						})
					});
					dialog.open();
				};
				var callsuccess = function() {
					sap.m.MessageToast.show(_.resourceBundle.getText("withdraw_toast"));
					oModel.setRefreshAfterChange(true);
					oModel.refresh(true);
					/*_.router.navTo("History_Master", null, false);
					_.router.navTo("empty", null, false); */
					//new :
					_.router.navTo("History_Master",{from : "history"},false);
					if (!jQuery.device.is.phone){
						_.router.navTo("empty", null , false);
					}

				};
				oModel.setRefreshAfterChange(false);
				var sPath = "LeaveRequestCollection(EmployeeID='" + employeeid + "',RequestID='" + requestid + "',ChangeStateID='" + changestateid + "',LeaveKey='" + leavekey + "')";
				oModel.remove(sPath, null, callsuccess, callfailed);

			}

		});

	},
	navButtonPress :function(oEvent){
		var router= sap.ui.core.UIComponent.getRouterFor(_that);
		//router.navTo("History_Master",null,true);
		/*new*/
		router.navTo("History_Master",{from:"detail"},true);
	},
	logout : function() {
		com.peol.utils.SessionManager.DeleteSession();
	}
});