jQuery.sap.require("com.peol.utils.CalendarServices");
jQuery.sap.require("com.peol.utils.Conversions");
jQuery.sap.require("sap.ca.ui.dialog.factory");

sap.ui.controller("com.peol.view.TeamCalendar", {

	extHookChangeFooterButtons : null,

	resourceBundle : {
		getText : function(key, array) {
			return _that.getView().getModel("i18n").getResourceBundle().getText(key, array);
		}
	},

	onInit : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
		this.oView = this.getView();

		this.oModel = sap.ui.getCore().getModel("leaveApprovalModel");
		_that = this;
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	},

	/**
	 * @private [_onShow handler for calendar display]
	 * @param {[type]}
	 *            RequestID
	 * @return {[type]}
	 */
	_onShow : function(RequestID) {

		var oCalendar2, sPath, eventTemplate;
		oCalendar2 = this.byId("OverlapCalendar2");

		if (oCalendar2) {
			// bind aggregation
			sPath = "/" + RequestID + "/events";
			eventTemplate = new sap.me.OverlapCalendarEvent({
				row : "{Order}",
				type : "{LegendType}",
				typeName : "{AbsenceType}",
				name : "{EmployeeName}"
			});

			eventTemplate.bindProperty("halfDay", {
				parts : [ {
					path : "AllDayFlag"
				} ],
				formatter : function(bAllDayFlag) {
					var bReturn = false;
					if (!bAllDayFlag) {
						bReturn = true;
					}
					return bReturn;
				}
			});

			// start date
			eventTemplate.bindProperty("startDay", {
				parts : [ {
					path : "StartDate"
				} ],
				formatter : com.peol.utils.Conversions.convertLocalDateToUTC
			});

			// end date
			eventTemplate.bindProperty("endDay", {
				parts : [ {
					path : "EndDate"
				} ],
				formatter : com.peol.utils.Conversions.convertLocalDateToUTC
			});

			oCalendar2.bindAggregation("calendarEvents", sPath, eventTemplate);
			oCalendar2.setStartDate(com.peol.utils.CalendarServices.getCalStartDate());
		}
	},

	/**
	 * @private [_onEndOfData End of Data handler]
	 * @param {[type]}
	 *            oEvt
	 * @return {[type]}
	 */
	_onEndOfData : function(oEvt) {
		"use strict";
		// commented - loading is handled in onChangeDate
	},

	/**
	 * @private [_onChangeDate change of date handler]
	 * @param {[type]}
	 *            oEvt
	 * @return {[type]}
	 */
	_onChangeDate : function(oEvt) {
		"use strict";
		var oDataStatus, bParamBefore;
		oDataStatus = com.peol.utils.CalendarServices.checkLoadRequired(oEvt.getParameter("firstDate"), oEvt.getParameter("endDate"));
		if (oDataStatus.bLoadReq) {
			bParamBefore = oDataStatus.bLoadBefore;
			jQuery.sap.delayedCall(5, undefined, function() {
				if (com.peol.utils.CalendarServices.getLeadRequestID()) {
					com.peol.utils.CalendarServices.readCalData(null, null, bParamBefore, null);
				}
			});
		}
	},

	/**
	 * @public [getHeaderFooterOptions Define header & footer options]
	 */
	getHeaderFooterOptions : function() {
		"use strict";
		var objHdrFtr = {
			sI18NDetailTitle : "view.Detail.title",
			onBack : jQuery.proxy(function() {
				var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy
																						// call
																						// to
																						// identify
																						// deep
																						// link
																						// situation
				if (sDir && sDir !== "Unknown") {
					window.history.go(-1);
				} else {
					this.oRouter.navTo("detail", {
						from : "calendar",
						contextPath : this.detailContextPath
					}, true);
				}
			}, this)
		};
		/**
		 * @ControllerHook Modify the footer buttons This hook method can be
		 *                 used to add and change buttons for the detail view
		 *                 footer It is called when the decision options for the
		 *                 detail item are fetched successfully
		 * @callback com.peol.view.S4~extHookChangeFooterButtons
		 * @param {object}
		 *            Header Footer Object
		 * @return {object} Header Footer Object
		 */

		if (this.extHookChangeFooterButtons) {
			objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
		}
		;
		return objHdrFtr;
	},
	_handleRouterMatched : function(evt) {
		if (evt.getParameter("name")== "TeamCalendar") {
			var RequestID=evt.getParameters().arguments.RequestID;
			this.oModel.read("/LeaveRequestDetailsCollection(RequestId='"+RequestID+"',CalculateOverlaps=1)", null, [], true, function(oData, oResponse) {

				var sReqStartDate, sRequestId, oStartDate, contextPath;
				// this.detailContextPath = "";

				sRequestId = oData.RequestId;

				// contextPath = "/LeaveRequestDetailsCollection(RequestId='" +
				// sRequestId + "',CalculateOverlaps=1)";
				// this.detailContextPath = "LeaveRequestCollection(RequestId='"
				// + sRequestId + "')";
				// this.oView.bindElement(contextPath);

				sReqStartDate = new Date();
				sReqStartDate.setTime(oData.StartDate);
				oStartDate = com.peol.utils.CalendarServices.setDateType(sReqStartDate);
				com.peol.utils.CalendarServices.setCalStartDate(oStartDate);

				if (!com.peol.utils.CalendarServices.getAppModel()) {
					com.peol.utils.CalendarServices.setAppModel(sap.ui.getCore().getModel("leaveApprovalModel"));
				}

				// clear calendar data - since every
				// refresh/approve/reject could outdate the data
				com.peol.utils.CalendarServices.clearCalData();

				jQuery.sap.delayedCall(5, undefined, jQuery.proxy(function() {
					com.peol.utils.CalendarServices.readCalData(sRequestId, sReqStartDate, null);
					// call controller to set context
					_that._onShow(sRequestId);

				}, this));

				var oCalendar2 = _that.byId("OverlapCalendar2"), oLegend = _that.byId("CalenderLegend");
				if (oCalendar2) {
					oCalendar2.setModel(com.peol.utils.CalendarServices.getCalModel());
				}

				if (jQuery.device.is.phone) {
					// default: 2 weeks
					oCalendar2.setWeeksPerRow(1);
				}

				if (oLegend) {
					oLegend.setLegendForNormal(_that.resourceBundle.getText("view.Calendar.LegendWorkingDay"));
					oLegend.setLegendForType00(_that.resourceBundle.getText("view.Calendar.LegendDayOff"));
					oLegend.setLegendForType01(_that.resourceBundle.getText("view.Calendar.LegendApproved"));
					oLegend.setLegendForType04(_that.resourceBundle.getText("view.Calendar.LegendPending"));
					oLegend.setLegendForType06(_that.resourceBundle.getText("view.Calendar.LegendHoliday"));
					oLegend.setLegendForType07(_that.resourceBundle.getText("view.Calendar.LegendDeletionRequested"));
					oLegend.setLegendForToday(_that.resourceBundle.getText("view.Calendar.LegendToday"));
				}

			}, function(oData, oResponse) {

			});
		}
	}
	
	,
	
	navButtonPress :function(oEvent){
		/*var router= sap.ui.core.UIComponent.getRouterFor(_that);
		router.navTo("Tile",null,true);*/
		window.history.back()
	}, 
});