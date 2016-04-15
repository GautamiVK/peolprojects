jQuery.sap.require("com.peol.utils.Conversions");
jQuery.sap.require("com.peol.util.Const");
jQuery.sap.require("com.peol.util.Formatter");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.ca.ui.dialog.factory");
sap.ui.controller("com.peol.view.Resumption_Detail", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf myleeavereq.Approve_Detail
	 */
	resourceBundle : {
		getText : function(key, array) {
			return _that.getView().getModel("i18n").getResourceBundle().getText(key, array);
		}
	},
	onInit : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});
		this.oDataModel = sap.ui.getCore().getModel("leaveResumptionModel");
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	},
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	},
	_handleApprove : function() {
		"use strict";
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()), bApprove = true, fnClose = function(oResult) {
			this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
		}, sUserName = this.oView.getBindingContext().getProperty("RequesterName"), sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"), sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"), sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"), sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"), sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"), sRequested = com.peol.utils.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag), sApproveText = "";

		if (sLeaveRequestType === "3") {
			sApproveText = this.resourceBundle.getText("dialog.res.quest.app", [ sUserName ]);
		} else {
			sApproveText = this.resourceBundle.getText("dialog.res.quest.app", [ sUserName ]);
		}

		sap.ca.ui.dialog.confirmation.open({
			question : sApproveText,
			showNote : true,
			additionalInformation : [ {
				label : this.resourceBundle.getText("view.AddInfo.LeaveType"),
				text : sLeaveType
			}, {
				label : this.resourceBundle.getText("view.AddInfo.Requested"),
				text : sRequested
			} ],
			title : this.resourceBundle.getText("XTIT_APPROVAL"),
			confirmButtonLabel : this.resourceBundle.getText("XBUT_APPROVE")
		}, jQuery.proxy(fnClose, this));
	},

	/**
	 * @private [_handleReject handler for reject action]
	 */
	_handleReject : function() {
		"use strict";
		var oDataObj = this.oView.getModel().getProperty(this.oView.getBindingContext().getPath()), bApprove = false, fnClose = function(oResult) {
			this._handleApproveRejectExecute(oResult, bApprove, oDataObj);
		}, sUserName = this.oView.getBindingContext().getProperty("RequesterName"), sLeaveType = this.oView.getBindingContext().getProperty("LeaveTypeDesc"), sAbsenceDays = this.oView.getBindingContext().getProperty("AbsenceDays"), sAbsenceHours = this.oView.getBindingContext().getProperty("AbsenceHours"), sAllDayFlag = this.oView.getBindingContext().getProperty("AllDayFlag"), sLeaveRequestType = this.oView.getBindingContext().getProperty("LeaveRequestType"), sRequested = com.peol.utils.Conversions.formatterAbsenceDurationAndUnit(sAbsenceDays, sAbsenceHours, sAllDayFlag), sRejectText = "";

		if (sLeaveRequestType === "3") {
			sRejectText = this.resourceBundle.getText("dialog.resumption.question.reject", [ sUserName ]);
		} else {
			sRejectText = this.resourceBundle.getText("dialog.resumption.question.reject", [ sUserName ]);
		}

		// open the confirmation dialog
		sap.ca.ui.dialog.confirmation.open({
			question : sRejectText,
			showNote : true,
			additionalInformation : [ {
				label : this.resourceBundle.getText("view.AddInfo.LeaveType"),
				text : sLeaveType
			}, {
				label : this.resourceBundle.getText("view.AddInfo.Requested"),
				text : sRequested
			} ],
			title : this.resourceBundle.getText("XTIT_REJECT"),
			confirmButtonLabel : this.resourceBundle.getText("XBUT_REJECT")
		}, jQuery.proxy(fnClose, this));
	},

	/**
	 * @private [_handleApproveRejectExecute handler for executing the
	 *          approval/reject to backend]
	 */
	_handleApproveRejectExecute : function(oResult, bApprove, oDataObj) {
		"use strict";
		if (oResult.isConfirmed) {

			var oEntry = {}, sDecision, sURL;

			if (oResult.sNote) {
				oEntry.Comment = oResult.sNote;
			} else {
				oEntry.Comment = "";
			}

			oEntry.RequestId = oDataObj.RequestId;
			oEntry.RequesterNumber = oDataObj.RequesterNumber;
			//oEntry.Version = oDataObj.Version;

			if (bApprove) {
				sDecision = "PREPARE_APPROVE";
				this.sTextKey = "dialog.resumption.success.approve";
			} else {
				sDecision = "PREPARE_REJECT";
				this.sTextKey = "dialog.resumption.success.reject";
			}

			oEntry.Decision = sDecision;
			oEntry.SAP__Origin = oDataObj.SAP__Origin;

			sURL = "ApplyLeaveRequestDecision?RequestId='" + oDataObj.RequestId + "'&Version=" + oDataObj.RequesterNumber + "&Comment='" + oResult.sNote + "'&Decision='" + sDecision + "'&RequesterNumber = '"+oDataObj.RequesterNumber+"'&SessionID = '"+SESSION_ID+"'";

			this.oDataModel.setRefreshAfterChange(false);
			this.oDataModel.create(sURL, oEntry, null, jQuery.proxy(this._handleApproveRejectSuccess, this), jQuery.proxy(this._handleApproveRejectFailure, this));
		}
	},

	_handleApproveRejectSuccess : function() {
		"use strict";
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.oView), oComponent = sap.ui.component(sComponentId);

		//oComponent.oEventBus.publish("com.peol", "leaveRequestApproveReject");

		this.oDataModel.setRefreshAfterChange(true);
		this.oDataModel.refresh(true);

		sap.m.MessageToast.show(this.resourceBundle.getText(this.sTextKey));
		//this.router.navTo("Resumption_Master", null, false);
		//new : to load on mobile
		this.router.navTo("Resumption_Master", {from : "tile" } , false);
		if (!jQuery.device.is.phone){
			this.router.navTo("empty", null, false);
		}
	},

	_handleApproveRejectFailure : function(oError) {
		"use strict";
		this.oDataModel.setRefreshAfterChange(true);
		if (this.oDataModel.hasPendingChanges()) {
			this.oDataModel.refresh(true);
		}
		com.peol.utils.Conversions.formatErrorDialog(oError);
	},

	_handleTeamCalendar : function() {

		sap.ui.core.UIComponent.getRouterFor(this).navTo("TeamCalendar", null, false);
	},
	_handleRouterMatched : function(evt) {
		if (evt.getParameter("name") == "Resumption_Detail") {
			com.peol.utils.SessionManager.checkManager();
			var arguments = decodeURIComponent(evt.getParameter("arguments").contextPath);
			// var context = new
			// sap.ui.model.Context(sap.ui.getCore().getModel("leaveReqModel"),arguments);
			var context = _RESUMPTION_CONTEXT;
			var page = this.getView();
			page.setModel(context.oModel);
			page.setBindingContext(context);
		}
	},
	_handleTabSelect : function(evt) {
		"use strict";
		var key, context, sDetailTabContextPath, fnSuccess;

		key = evt.getParameter("key");
		context = this.getView().getBindingContext();

		if (key === "contentNotes") {
			sDetailTabContextPath = "/LeaveRequestDetailsCollection(RequestId='" + context.getProperty("RequestId") + "',CalculateOverlaps=1)";
			fnSuccess = function(oData) {
				this.oModel2 = new sap.ui.model.json.JSONModel(oData);
				this.getView().setModel(this.oModel2, "notes");
			};
			this.oDataModel.read(sDetailTabContextPath, undefined, [ "$expand=Notes" ], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(this.onRequestFailed, this));
		}
	},
	logout:function(){
		com.peol.utils.SessionManager.DeleteSession();
	}
,

	/**new**/
	navButtonPress :function(oEvent){
		var router= sap.ui.core.UIComponent.getRouterFor(_that);
		router.navTo("Resumption_Master",{from:"detail"},true);
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's
	 * View is re-rendered (NOT before the first rendering! onInit() is used for
	 * that one!).
	 * 
	 * @memberOf myleeavereq.Approve_Detail
	 */
//	onBeforeRendering: function() {
//	},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document).
	 * Post-rendering manipulations of the HTML could be done here. This hook is the
	 * same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf myleeavereq.Approve_Detail
	 */
//	onAfterRendering: function() {
//	},
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and
	 * finalize activities.
	 * 
	 * @memberOf myleeavereq.Approve_Detail
	 */
//	onExit: function() {
//	}
});