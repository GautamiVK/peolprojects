jQuery.sap.require("com.peol.util.Formatters");
jQuery.sap.require("com.peol.util.Formatter");
jQuery.sap.require("com.peol.util.UIHelper");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("com.peol.util.DataManager");
jQuery.sap.require("com.peol.util.CalendarTools");
jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.ca.ui.dialog.Dialog");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.declare("com.peol.view.initial");
jQuery.sap.require("com.peol.utils.SessionManager");
sap.ui.controller("com.peol.view.initial", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf calendar.initial
	 */
	extHookChangeFooterButtons : null,
	extHookRouteMatchedHome : null,
	extHookRouteMatchedChange : null,
	extHookClearData : null,
	extHookInitCalendar : null,
	extHookTapOnDate : null,
	extHookSetHighlightedDays : null,
	extHookDeviceDependantLayout : null,
	extHookSubmit : null,
	extHookOnSubmitLRCfail : null,
	extHookOnSubmitLRCsuccess : null,
	extHookCallDialog : null,
	onInit : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
		this._initCntrls();
		_= this;
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});
		_that=this;
		// Get the employee pernr
		this.pernr = sap.ui.getCore().getModel("pernr");
		this.oDataModel=sap.ui.getCore().getModel("leaveReqModel");
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	},
	_handleRouterMatched:function(evt){
		if(evt.getParameter("name")=="initial"){
			com.peol.util.Formatters.init(this.resourceBundle);
			com.peol.util.DataManager.init(this.oDataModel, this.resourceBundle);
			com.peol.util.UIHelper.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = false;
			this._clearData();
			com.peol.util.CalendarTools.clearCache();
			var c = $.when(com.peol.util.DataManager.getConfiguration(), com.peol.util.DataManager.getAbsenceTypeCollection());
			c.done(function(g, l) {
				_.aLeaveTypes = l;
				var o = {};
				o.AbsenceTypeCollection = _.aLeaveTypes;
				_.slctLvType.setModel(new sap.ui.model.json.JSONModel(o));
				_.slctLvType.bindItems({
					path : "/AbsenceTypeCollection",
					template : new sap.ui.core.Item({
						key : "{AbsenceTypeCode}",
						text : "{AbsenceTypeName}"
					})
				});
				if (_.aLeaveTypes.length > 0) {
					_._setUpLeaveTypeData(g.DefaultAbsenceTypeCode)
				}
			});
			c.fail(function(g) {
				com.peol.util.UIHelper.errorDialog(g)
			});
			_._setHighlightedDays(_.cale.getCurrentDate());
			if (_.cale && _.cale.getSelectedDates().length === 0) {
				_.setBtnEnabled("LRS4_BTN_SEND", false)
			} else {
				_.setBtnEnabled("LRS4_BTN_SEND", true)
			}
		}
		else if (evt.getParameter("name") === "change") {

			_.fromChangeBtn=true;
			com.peol.util.DataManager.init(
					this.oDataModel, this.resourceBundle);
			com.peol.util.UIHelper
			.setControllerInstance(this);
			this.oChangeModeData = {};
			this.changeMode = true;
			this._clearData();
			var a = evt.getParameters().arguments.RequestID;
			var b = null;
			var d = com.peol.util.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			if (d) {
				for ( var i = 0; i < d.length; i++) {
					if (d[i].RequestID == a) {
						b = d[i]
					}
				}
				if (b == null) {
					for ( var i = 0; i < d.length; i++) {
						if (d[i].LeaveKey == a) {
							b = d[i]
						}
					}
				}
			}
			;
			if (!b) {
				jQuery.sap.log.warning(
						"curntLeaveRequest is null",
						"_handleRouteMatched",
				"com.peol.view.S1");
				this.changeMode=false;
				this.router.navTo("initial",null, true);
			} else {
				if(b.aRelatedRequests){
					b = b.aRelatedRequests[0]; 
				}
				var s = com.peol.util.Formatters
				.getDate(b.StartDate);
				var f = com.peol.util.Formatters
				.getDate(b.EndDate);
				s = new Date(s.getUTCFullYear(), s
						.getUTCMonth(), s.getUTCDate(), 0, 0, 0);
				f = new Date(f.getUTCFullYear(), f
						.getUTCMonth(), f.getUTCDate(), 0, 0, 0);
				_.oChangeModeData.requestId = b.RequestID;
				_.oChangeModeData.leaveTypeCode = b.AbsenceTypeCode;
				_.oChangeModeData.startDate = s.toString();
				_.oChangeModeData.endDate = f.toString();
				_.oChangeModeData.requestID = b.RequestID;
				//_.oChangeModeData.noteTxt = b.Notes;
				_.oChangeModeData.startTime = b.StartTime;
				_.oChangeModeData.endTime = b.EndTime;
				_.oChangeModeData.employeeID = b.EmployeeID;
				_.oChangeModeData.changeStateID = b.ChangeStateID;
				_.oChangeModeData.leaveKey = b.LeaveKey;
				//_.oChangeModeData.PetrolCard=b.PetrolCard;
				_.oChangeModeData.CashHandling=b.CashHandling;
				//_.oChangeModeData.Others=b.Others;
				//_.oChangeModeData.ToolBox=b.ToolBox;
				_.oChangeModeData.Contact1=b.Contact1;
				_.oChangeModeData.Contact2=b.Contact2;
				_.oChangeModeData.ResSubmit=b.ResSubmit;
				_.oChangeModeData.evtType = _._getCaleEvtTypeForStatus(b.StatusCode);
				_._setUpLeaveTypeData(_.oChangeModeData.leaveTypeCode);
				_._copyChangeModeData();
				this.getView().byId("LRS4_BTN_CANCEL").setText(this.resourceBundle.getText("LR_CANCEL"));;
				/*_.setBtnVisible("LRS4_BTN_SEND", true);
				_.setBtnVisible("LRS4_BTN_CANCEL", true);*/
				if (_.cale
						&& _.cale.getSelectedDates().length === 0) {
					_.setBtnEnabled("LRS4_BTN_SEND", false)
				} else {
					_.setBtnEnabled("LRS4_BTN_SEND", true)
				}
			}
			if (this.extHookRouteMatchedChange) {
				this.extHookRouteMatchedChange()
			}
		}
	},
	setBtnEnabled:function(id,status){
		_.getView().byId(id).setEnabled(status);
	},
	setBtnVisible: function(id,status){
		_.getView().byId(id).setVisible(status);
	},
	resourceBundle : {
		getText : function(key,array) {
			return sap.ui.getCore().getModel("i18n").getResourceBundle().getText(key,array);
		}
	},
	_initCntrls : function() {

		this.changeMode = false; // true: S4 is called by history view for
		// existing lr
		this.oChangeModeData = {}; // container for LR data coming from history
		// view in change mode
		this.selRange = {}; // Object holding the selected dates of the calendar
		// control
		this.selRange.start = null; // earliest selected date or singel selected
		// date
		this.selRange.end = null; // latest selected date or null for single
		// days
		this.aLeaveTypes = new Array(); // array of absence types for current
		// user
		this.leaveType = {}; // currently selected absence type

		this.iPendingRequestCount = 0;

		// ----variables used during onSend:
		this.bSubmitOK = null; // true when the submit simulation was
		// successful
		this.bApproverOK = null; // true when the approving manager could be
		// determined
		this.oSubmitResult = {};
		this.sApprover = ""; // Approving manager - used in confirmation
		// popup
		this.bSimulation = true; // used in oData call for submit of lr -
		// true: just check user entry false: do
		// posting
		this._isLocalReset = false;

		// ------- convenience variables for screen elements
		this.oBusy = null;
		this.formContainer = this.byId("LRS4_FRM_CNT_BALANCES");
		this.timeInputElem = this.byId("LRS4_FELEM_TIMEINPUT");
		this.balanceElem = this.byId("LRS4_FELEM_BALANCES");
		this.noteElem = this.byId("LRS4_FELEM_NOTE");
		this.timeFrom = this.byId("LRS4_DAT_STARTTIME");
		this.timeTo = this.byId("LRS4_DAT_ENDTIME");
		this.legend = this.byId("LRS4_LEGEND");
		this.remainingVacation = this.byId("LRS4_TXT_REMAINING_DAYS");
		this.bookedVacation = this.byId("LRS4_TXT_BOOKED_DAYS");
		this.note = this.byId("LRS4_TXA_NOTE");
		this.cale = this.byId("LRS4_DAT_CALENDAR");
		this.slctLvType = this.byId("SLCT_LEAVETYPE");
		this.startDateDisplay=this.byId("startDateDisplay");
		this.endDateDisplay=this.byId("endDateDisplay");
//		this.petrol=this.byId("petrol");
//		this.tool_box=this.byId("tool_box");
//		this.cash=this.byId("cash");
//		this.others=this.byId("others");
		this.contactNumber=this.byId("LRS4_TXA_CONTACT_NO");
		this.alternateContactNumber=this.byId("LRS4_TXA_ALT_CONTACT_NO");
		this.calSelResetData = [];

		// TODO:
		this._initCalendar(); // set up layout + fill calendar with events
		this._deviceDependantLayout();

		// Here the time pattern used for display in the timeInput control is
		// determined
		if (this.timeFrom && this.timeTo) {
			this._setInputTimePattern();
		}
		;
	},
	_initCalendar : function() {
		// Here the initial setup for the calendar and the calendar legend is
		// done
		// this setting is refined depending on the used device and device
		// orientation
		// in deviceDependantLayout() and leaveTypeDependantSettings()
		if (this.cale) {
			this.cale.setSwipeToNavigate(true);
			// handler for paging in calendar
			this.cale.attachChangeCurrentDate(this._onChangeCurrentDate, this);
			// handler for date selection
			this.cale.attachTapOnDate(this._onTapOnDate, this);
			// disable swipe range selection -> we do the range selection using
			// 'tap'
			this.cale.setEnableMultiselection(false);
			// setup display for moth
			this.cale.setWeeksPerRow(1);
		}
		;

		// create legend
		if (this.legend) {
			this.legend.setLegendForNormal(this.resourceBundle.getText("LR_WORKINGDAY"));
			this.legend.setLegendForType00(this.resourceBundle.getText("LR_NONWORKING"));
			this.legend.setLegendForType01(this.resourceBundle.getText("LR_APPROVELEAVE"));
			this.legend.setLegendForType04(this.resourceBundle.getText("LR_APPROVEPENDING"));
			this.legend.setLegendForType06(this.resourceBundle.getText("LR_PUBLICHOLIDAY"));
			this.legend.setLegendForType07(this.resourceBundle.getText("LR_REJECTEDLEAVE"));
			this.legend.setLegendForToday(this.resourceBundle.getText("LR_DTYPE_TODAY"));
			this.legend.setLegendForSelected(this.resourceBundle.getText("LR_DTYPE_SELECTED"));
		}
		;

		/**
		 * @ControllerHook Extend behavior of initializing calendar This hook
		 *                 method can be used to add UI or business logic It is
		 *                 called when the initCalendar method executes
		 * @callback com.peol.view.S1~extHookInitCalendar
		 */
		if (this.extHookInitCalendar) {
			this.extHookInitCalendar();
		}
		;

	},
	_deviceDependantLayout : function() {
		// This method defines the screen layout depending on the used device.
		// The only mechanism used here to rearrange the screen elements is the
		// line-break
		// function of the sap.ui.commons.form.Form control.
		// The initial screen layout as defined in the html view is used for
		// phones

		// ******************** valid for all devices - start
		// ********************
		if (this.byId("LRS4_FLX_TOP")) {
			this.byId("LRS4_FLX_TOP").addStyleClass("s4leaveTypeSelectorFlx");
		}
		;
		if (this.byId("LRS4_TXT_BOOKEDDAYS")) {
			this.byId("LRS4_TXT_BOOKEDDAYS").addStyleClass("s4BalancesFlxLeft");
		}
		;
		if (this.byId("LRS4_TXT_REMAININGDAY")) {
			this.byId("LRS4_TXT_REMAININGDAY").addStyleClass("s4BalancesFlxRight");
		}
		;
		if (this.byId("LRS4_FLX_ENDTIME")) {
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlx");
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlxEnd");
		}
		;
		if (this.byId("LRS4_FLX_STARTTIME")) {
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlxStart");
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlx");
		}
		;
		// ******************** valid for all devices - end ********************

		if (jQuery.device.is.phone) {
			// ******************** PHONE start ********************
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(false);
			}
			;
			if (this.cale) {
				this.cale.setMonthsToDisplay(1);
				this.cale.setMonthsPerRow(1);
			}
			;


			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
			}
			;

			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(true);
				this.formContainer.getLayoutData().setWeight(3);
			}
			;

			// ******************** PHONE end ********************
		} else {
			// ******************** TABLET / PC start *******************
			// scrolling is only needed for phone - disabled on other devices
			if (this.byId("S4")) {
				this.byId("S4").setEnableScrolling(false);
			}
			;
			// Calendar - default full day? - Cale takes up complete 1st row
			if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
				this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
			}
			;
			if (this.cale) {
				this.cale.setMonthsToDisplay(2);
				this.cale.setMonthsPerRow(2);
			}
			;

			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(false);
				this.formContainer.getLayoutData().setWeight(3);
			}
			;
			// Balances
			if (this.balanceElem) {
				this.balanceElem.getLayoutData().setLinebreak(false);
			}
			;

			// Time Input
			// - default full day? - Time Input should not be shown
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
				this.timeInputElem.setVisible(false);
			}
			;

			// Note
			if (this.noteElem) {
				this.noteElem.getLayoutData().setLinebreak(true);
			}
			;

			// Legend
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(true);
			}
			;
			if (this.byId("LRS4_FRM_CNT_LEGEND")) {
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9);
			}
			;
			// ******************** TABLET / PC end ********************
		}

		/**
		 * @ControllerHook Extend behavior of device Dependant Layout This hook
		 *                 method can be used to add UI or business logic It is
		 *                 called when the deviceDependantLayout method executes
		 * @callback com.peol.view.S1~extHookDeviceDependantLayout
		 */
		if (this.extHookDeviceDependantLayout) {
			this.extHookDeviceDependantLayout();
		}
		;

	},
	salaryAdvancedRadioClick : function(oEvent){
		
		
		this.salaryAdvancedBoolean=oEvent.getSource().getText()== _.resourceBundle.getText("LR_YES") ? true:false;
		
		
	},
	pressedHistory : function() {
		/*
		 * nav.to("History_Master",null,true); nav.to("empty1");
		 * sap.ui.getCore().getModel("app").setMode(sap.m.SplitAppMode.ShowHideMode);
		 */
		var router= sap.ui.core.UIComponent.getRouterFor(_that);
		//router.navTo("History_Master",null,false);
		router.navTo("History_Master",{from : "history"},false);
		//router.navTo("empty", null, false);
		if (!jQuery.device.is.phone){
			router.navTo("empty", null , false);
		}

	},
	registerForOrientationChange : function(a) {
		if (jQuery.device.is.tablet) {
			this.parentApp = a;
			a.attachOrientationChange(jQuery.proxy(this._onOrientationChanged, this));
		}
	},
	_onOrientationChanged : function(e) {
		//this._leaveTypeDependantSettings(this.leaveType)
	},
	_onTapOnDate : function(e) {
		var _;
		if (this.cale) {
			_ = this.cale.getSelectedDates();
		};
		if (this.leaveType.AllowedDurationMultipleDayInd === false) {
		} else if (this.leaveType.AllowedDurationMultipleDayInd) {
			if (_.length === 0 || e.mParameters.didSelect === false) {
				if (this.selRange.start !== null && this.selRange.end !== null) {
					this._clearDateSel();
					if (e.getParameters().date !== "") {
						this.selRange.start = e.getParameters().date;
						if (this.cale) {
							this.cale.toggleDatesSelection([ this.selRange.start ], true);
						}
					}
				} else if (this.selRange.start !== null && this.selRange.end === null) {
					this._clearDateSel();
				}
			} else if (this.selRange.start === null) {
				this.selRange.start = e.getParameters().date;
			} else if (this.selRange.end === null) {
				this.selRange.end = e.getParameters().date;
				if (this.cale) {
					this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end, true);
				}
			} else {
				this.selRange.start = e.getParameters().date;
				this.selRange.end = null;
				if (this.cale) {
					this.cale.toggleDatesSelection([ this.selRange.start ], true);
				}
			}
		}
		if (this.leaveType.AllowedDurationMultipleDayInd === true && this.timeFrom && this.timeTo) {
			_ = this.cale.getSelectedDates();
			if (_.length > 1) {
				this.timeFrom.setValue("");
				this.timeTo.setValue("");
				this.timeFrom.setEnabled(false);
				this.timeTo.setEnabled(false);
			} else {
				this.timeFrom.setEnabled(true);
				this.timeTo.setEnabled(true);
			}
		}
		if ((this.cale && this.cale.getSelectedDates().length === 0) ) {
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		}
		;
		if (this.extHookTapOnDate) {
			this.extHookTapOnDate();
		}
		if(this.cale.getSelectedDates().length){
			var startEnd=this._getStartEndDate(this.cale.getSelectedDates());
			this.startDateDisplay.setValue(this.resourceBundle.getText("LABEL_START_DATE")+com.peol.util.Formatter.dateFormate((startEnd.startDate)));
			this.endDateDisplay.setValue(this.resourceBundle.getText("LABEL_END_DATE")+com.peol.util.Formatter.dateFormate((startEnd.endDate)));	
		}
		else{
			this.startDateDisplay.setValue("");
			this.endDateDisplay.setValue("");
		} 
		/* Static Text Field */
		if(this.cale && this.cale.getSelectedDates().length == 0 && !nonlrBoolean ){
			this.byId("staticText").setValue(this.resourceBundle.getText("CALENDARHINT1"));
		}
		else if(this.cale && this.cale.getSelectedDates().length == 1 && !nonlrBoolean){
			this.byId("staticText").setValue(this.resourceBundle.getText("CALENDARHINT2"));
		}
		else if(this.cale && this.cale.getSelectedDates().length > 1 && !nonlrBoolean){
			this.byId("staticText").setValue(this.resourceBundle.getText("CALENDARHINT3"));
		}
	},
	_setHighlightedDays : function(s) {
		var _ = new Date(s);
		if (!this.oBusy) { this.oBusy = new sap.m.BusyDialog(); }
		this.oBusy.open();
		com.peol.util.CalendarTools.getDayLabelsForMonth(_, this._getCalLabelsOK, this._getCalLabelsError);
		if (this.extHookSetHighlightedDays) {
			this.extHookSetHighlightedDays();
		}
	},
	_getCalLabelsOK : function(c) {
		var _ = com.peol.util.UIHelper.getControllerInstance();
		_.oBusy.close();
		var a = "";
		for ( var x in c) {
			if (x === "REJECTED") {
				a = _._getCaleEvtTypeForStatus(x);
				if (a !== "") {
					_.cale.toggleDatesType(c[x], a, true);
					_.calSelResetData.push({
						"calEvt" : c[x],
						"evtType" : a
					});
				}
			}
		}
		for ( var x in c) {
			if (x !== "REJECTED") {
				a = _._getCaleEvtTypeForStatus(x);
				if (a !== "") {
					_.cale.toggleDatesType(c[x], a, true);
					_.calSelResetData.push({
						"calEvt" : c[x],
						"evtType" : a
					});
				}
			}
		}
	},
	_getCaleEvtTypeForStatus : function(s) {
		if (s === "WEEKEND") {
			return sap.me.CalendarEventType.Type00;
		} else if (s === "PHOLIDAY") {
			return sap.me.CalendarEventType.Type06;
		} else if (s === "SENT") {
			return sap.me.CalendarEventType.Type04;
		} else if (s === "POSTED" || s === "APPROVED") {
			return sap.me.CalendarEventType.Type01;
		} else if (s === "REJECTED") {
			return sap.me.CalendarEventType.Type07;
		} else if (s === "WORKDAY") {
			if (!!sap.me.CalendarEventType.Type10)
				return sap.me.CalendarEventType.Type10;
			else
				return "";
		} else {
			return "";
		}
	},
	_getCalLabelsError : function(o) {
		var _=com.peol.util.UIHelper.getControllerInstance();
		_.oBusy.close();
		com.peol.util.UIHelper.errorDialog(com.peol.util.DataManager.parseErrorMessages(o));
	},
	_onChangeCurrentDate : function(e) {
		if (this.cale) {
			this._setHighlightedDays(e.mParameters.currentDate);
		}
	},
	_getStartEndDate : function(s) {
		var _ = [];
		var a = [];
		var r = {};
		for ( var i = 0; i < s.length; i++) {
			_[i] = new Date(s[i]);
		}
		if (_.length === 0) {
			r.startDate = {};
			r.endDate = {};
		} else if (_.length === 1) {
			r.startDate = _[0];
			r.endDate = _[0];
		} else {
			a = _.sort(function(d, b) {
				if (d < b)
					return -1;
				if (d > b)
					return 1;
				return 0;
			});
			r.startDate = a[0];
			r.endDate = a[a.length - 1];
		}
		;
		return r;
	},
	_getLeaveTypesFromModel : function() {
		var _ = new Array();
		for (x in this.oDataModel.oData) {
			if (x.substring(0, 21) === "AbsenceTypeCollection") {
				if (this.oDataModel.oData[x] instanceof Array) {
					for ( var i = 0; i < this.oDataModel.oData[x].length; i++) {
						_.push(this.oDataModel.oData[x][i]);
					}
				} else {
					_.push(this.oDataModel.oData[x]);
				}
			}
		}
		return _;
	},
	_setUpLeaveTypeData : function(a) {
		if (this.slctLvType) {
			this.slctLvType.setSelectedKey(a);
		}
		;
		this.leaveType = this._readWithKey(this.aLeaveTypes, "AbsenceTypeCode", a);
		//this._leaveTypeDependantSettings(this.leaveType);
		this.getBalancesForAbsenceType(a);
		this.selectorInititDone = true;
	},
	_readWithKey : function(l, s, k) {
		for ( var i = 0; i < l.length; i++) {
			if (l[i][s] === k) {
				return l[i];
			}
		}
		return null;
	},
	_getBalancesBusyOn : function() {
		/*this.bookedVacation.setVisible(false);
		this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(true);*/
		this.remainingVacation.setVisible(false);
		this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(true);
	},
	_getBalancesBusyOff : function() {
		/*this.bookedVacation.setVisible(true);
		this.byId("LRS1_BUSY_BOOKEDDAYS").setVisible(false);*/
		this.remainingVacation.setVisible(true);
		this.byId("LRS1_BUSY_REMAININGDAYS").setVisible(false);
	},
	_leaveTypeDependantSettings : function(l) {
		if (l.AllowedDurationPartialDayInd) {
			if (this.timeInputElem) {
				this.timeInputElem.setVisible(true);
			}
		} else {
			if (this.timeInputElem) {
				this.timeInputElem.setVisible(false);
			}
		}
	},
	_orientationDependancies : function(c) {
		if (jQuery.device.is.phone === true) {
			if (this.cale) {
				this.cale.setMonthsToDisplay(1);
				this.cale.setMonthsPerRow(1);
			}
		} else {
			if (c == "portrait") {
				if (this.cale) {
					this.cale.setMonthsToDisplay(1);
					this.cale.setMonthsPerRow(1);
				}
			} else if (c == "landscape") {
				if (this.cale) {
					this.cale.setMonthsToDisplay(2);
					this.cale.setMonthsPerRow(2);
				}
			}
		}
	},
	_deviceDependantLayout : function() {
		if (this.byId("LRS4_FLX_TOP")) {
			this.byId("LRS4_FLX_TOP").addStyleClass("s4leaveTypeSelectorFlx");
		}
		;
		if (this.byId("LRS4_TXT_BOOKEDDAYS")) {
			this.byId("LRS4_TXT_BOOKEDDAYS").addStyleClass("s4BalancesFlxLeft");
		}
		;
		if (this.byId("LRS4_TXT_REMAININGDAY")) {
			this.byId("LRS4_TXT_REMAININGDAY").addStyleClass("s4BalancesFlxRight");
		}
		;
		if (this.byId("LRS4_FLX_ENDTIME")) {
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlx");
			this.byId("LRS4_FLX_ENDTIME").addStyleClass("s4TimeInputFlxEnd");
		}
		;
		if (this.byId("LRS4_FLX_STARTTIME")) {
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlxStart");
			this.byId("LRS4_FLX_STARTTIME").addStyleClass("s4TimeInputFlx");
		}
		;
		if (jQuery.device.is.phone) {
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(false);
			}
			;
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
			}
			;
			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(true);
				this.formContainer.getLayoutData().setWeight(3);
			}
		} else {
			if (this.byId("S4")) {
				this.byId("S4").setEnableScrolling(false);
			}
			;
			if (this.byId("LRS4_FRM_CNT_CALENDAR")) {
				this.byId("LRS4_FRM_CNT_CALENDAR").getLayoutData().setWeight(6);
			}
			;
			if (this.cale) {
				this.cale.setMonthsToDisplay(2);
				this.cale.setMonthsPerRow(2);
			}
			;
			if (this.formContainer) {
				this.formContainer.getLayoutData().setLinebreak(false);
				this.formContainer.getLayoutData().setWeight(3);
			}
			;
			if (this.balanceElem) {
				this.balanceElem.getLayoutData().setLinebreak(false);
			}
			;
			if (this.timeInputElem) {
				this.timeInputElem.getLayoutData().setLinebreak(true);
				this.timeInputElem.setVisible(false);
			}
			;
			if (this.noteElem) {
				this.noteElem.getLayoutData().setLinebreak(true);
			}
			;
			if (this.byId("LRS4_LEGEND")) {
				this.byId("LRS4_LEGEND").setExpandable(true);
				this.byId("LRS4_LEGEND").setExpanded(true);
			}
			;
			if (this.byId("LRS4_FRM_CNT_LEGEND")) {
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setLinebreak(true);
				this.byId("LRS4_FRM_CNT_LEGEND").getLayoutData().setWeight(9);
			}
		}
		if (this.extHookDeviceDependantLayout) {
			this.extHookDeviceDependantLayout();
		}
	},
	_getDaysOfRange : function(s, e) {
		var _ = null;
		var a = null;
		var d = [];
		if (s instanceof Date) {
			_ = s;
		} else if (typeof s === "string") {
			_ = new Date(s);
		}
		if (e instanceof Date) {
			a = e;
		} else if (typeof e === "string") {
			a = new Date(e);
		}
		if (a === null) {
			return [ _.toDateString() ];
		} else {
			while (_ <= a) {
				d.push(_.toDateString());
				_.setTime(_.getTime() + 86400000);
			}
			return d;
		}
	},
	onSend : function(e) {
		
		if(this.salaryAdvancedBoolean ==undefined){
			sap.m.MessageToast.show(_that.resourceBundle.getText("view.AddInfo.CashHandling.Toast"));
			return;
		}
		this.submit(true);
	},
	
	submit : function(i) {
		
		var s, S, e, E;
		this.bApproverOK = null;
		this.bSubmitOK = null;
		this.oSubmitResult = {};
		this.bSimulation = i;
		if (this.cale) {
			var dates = this._getStartEndDate(this.cale.getSelectedDates());
			if (this.timeFrom && this.timeTo && this.leaveType.AllowedDurationPartialDayInd) {
				s = com.peol.util.Formatters.DATE_YYYYMMdd(dates.startDate) + 'T00:00:00';
				(this.timeFrom.getValue() === "") ? S = 'PT00H00M00S' : S = "PT" + this.timeFrom.getValue().substring(0, 2) + "H" + this.timeFrom.getValue().substring(3, 5)
						+ "M00S";
				e = com.peol.util.Formatters.DATE_YYYYMMdd(dates.endDate) + 'T00:00:00';
				(this.timeTo.getValue() === "") ? E = 'PT00H00M00S' : E = "PT" + this.timeTo.getValue().substring(0, 2) + "H" + this.timeTo.getValue().substring(3, 5) + "M00S";
			} else {
				s = com.peol.util.Formatters.DATE_YYYYMMdd(dates.startDate) + 'T00:00:00';
				S = 'PT00H00M00S';
				e = com.peol.util.Formatters.DATE_YYYYMMdd(dates.endDate) + 'T00:00:00';
				E = 'PT00H00M00S';
			}

			var n = "";
			//var petrol=this.petrol.getSelected();
			//var tool_box=this.tool_box.getSelected();
			var cash=this.salaryAdvancedBoolean;
			//var others=this.others.getSelected();
			var contactNumber=this.contactNumber.getValue();
			var alternateContactNumber=this.alternateContactNumber.getValue();

			var errorHappened=false;

			this.contactNumber.setValueState("None");
			if(contactNumber!=""){
				var pat=/^(\+?[0-9]+-?)?[0-9]+$/;
				if(pat.test(contactNumber)){
					this.contactNumber.setValueState("None");
				}else{
					this.contactNumber.setValueState("Error");
					this.contactNumber.focus();
					errorHappened=true;
				}
			}

			this.alternateContactNumber.setValueState("None");
			if(alternateContactNumber!=""){
				var pat=/^[A-z]*[A-z0-9]+[_.]?[A-z0-9]+@[A-z]+[.][A-z]+[.]?[A-z]+$/;
				if(pat.test(alternateContactNumber)){
					this.alternateContactNumber.setValueState("None");
				}else{
					this.alternateContactNumber.setValueState("Error");
					this.alternateContactNumber.focus();
					errorHappened=true;
				}
			}
			if(errorHappened)
				return;
			if (!this.oBusy) { this.oBusy = new sap.m.BusyDialog(); }
			this.oBusy.open();
			if (this.note) {
				n = this.note.getValue();
			}
			/* Success callback for Mock Submit */
			var successCallBack=function(o,r){
				var obj=o;
				var additionalinfo=[
				                    {
				                    	label : obj.AbsenceTypeName,
				                    	text : com.peol.util.Formatter.dateFormate(obj.StartDate)+" "+_.resourceBundle.getText("LR_TO")+" "+ com.peol.util.Formatter.dateFormate(obj.EndDate)+" ("+_.resourceBundle.getText("util.Conversions.Value_Days",[obj.WorkingDaysDuration])+")"
				                    }];
				if(obj.LeaveTypeDesc1){
					var adData={
							label : obj.LeaveTypeDesc1,
							text : com.peol.util.Formatter.dateFormate(obj.StartDate1)+" "+_.resourceBundle.getText("LR_TO")+" "+ com.peol.util.Formatter.dateFormate(obj.EndDate1)+" ("+_.resourceBundle.getText("util.Conversions.Value_Days",[obj.WorkingHoursDuration])+")"
					};
					additionalinfo.push(adData);
				}
				var popupmodel = {
						question : _.resourceBundle.getText("LR_CONFIRMATIONMSG"),
						additionalInformation : additionalinfo,
						showNote : false,
						title : _.resourceBundle.getText("LR_TITLE_SEND"),
						confirmButtonLabel : _.resourceBundle.getText("LR_OK")
				};
				sap.ca.ui.dialog.factory.confirm(popupmodel, function(r) {
					if (r.isConfirmed == true) {
						/* Success callback for Actual Submit */
						var callSuccess=function(o,r){
							//var approver=o.ApproverEmployeeName;  //new changes
							debugger ;
							var a = sap.ui.getCore().getModel("ApproverNameModel");
							approver = a.getData().approverName ;
							sap.m.MessageToast.show(_.resourceBundle.getText("LR_SUBMITDONE",[approver]));
							_.onCancelClick(event);
						};
						/* Failure callback for Actual Submit */
						var callFailed=function(o,r){
							var response=JSON.parse(o.response.body);
							var error=response.error.message.value;
							var dialog=new sap.m.Dialog({
								title:"Warning",
								type:"Message",
								content:[
								         new sap.m.Text({text:error})
								         ],
								         beginButton:new sap.m.Button({
								        	 text:"Close",
								        	 press:function(){
								        		 dialog.close();
								        	 }
								         })
							});
							dialog.open();
							_.onCancelClick(event);
						};
						if (_.changeMode) {
							com.peol.util.DataManager.changeLeaveRequest(_.oChangeModeData.employeeID, _.oChangeModeData.requestID, _.oChangeModeData.changeStateID,
									_.oChangeModeData.leaveKey, s, S, e, E, _.leaveType.AbsenceTypeCode, n,cash,contactNumber,alternateContactNumber, false, callSuccess,callFailed);
						} else {
							com.peol.util.DataManager.submitLeaveRequest(s, S, e, E, _.leaveType.AbsenceTypeCode, n,cash,contactNumber,alternateContactNumber, false,callSuccess,callFailed);
						}
					}
				});
			};

			/* Failure callback for Mock Submit */
			var failureCallBack=function(o,r){
				if(o.response.body){
					var response=JSON.parse(o.response.body);
					var error=response.error.message.value;
					var dialog=new sap.m.Dialog({
						title:"Warning",
						type:"Message",
						content:[
						         new sap.m.Text({text:error})
						         ],
						         beginButton:new sap.m.Button({
						        	 text:"Close",
						        	 press:function(){
						        		 dialog.close();
						        	 }
						         })
					});
					dialog.open();
					if (!_.changeMode) {
						_.onCancelClick(event);
					}
				}
			};
			if (_.changeMode) {
				com.peol.util.DataManager.changeLeaveRequest(_.oChangeModeData.employeeID, _.oChangeModeData.requestID, _.oChangeModeData.changeStateID,
						_.oChangeModeData.leaveKey, s, S, e, E, _.leaveType.AbsenceTypeCode, n,cash,contactNumber,alternateContactNumber, true, successCallBack,failureCallBack);
			} else {
				com.peol.util.DataManager.submitLeaveRequest(s, S, e, E, _.leaveType.AbsenceTypeCode, n,cash,contactNumber,alternateContactNumber, true,successCallBack,failureCallBack);
			}

			/*
			 * if (this.changeMode) {
			 * com.peol.util.DataManager.changeLeaveRequest(this.oChangeModeData.employeeID,
			 * this.oChangeModeData.requestID,
			 * this.oChangeModeData.changeStateID,
			 * this.oChangeModeData.leaveKey, s, S, e, E,
			 * this.leaveType.AbsenceTypeCode, n, i, this.onSubmitLRCsuccess,
			 * this.onSubmitLRCfail); } else {
			 * com.peol.util.DataManager.submitLeaveRequest(s, S, e, E,
			 * this.leaveType.AbsenceTypeCode,
			 * n,petrol,cash,tool_box,others,contactNumber,alternateContactNumber,
			 * i; }
			 */
		}
		;
		if (this.extHookSubmit) {
			this.extHookSubmit();
		}
		this.oBusy.close();
	},
	onSubmitLRCfail : function(e) {
		var _ = com.peol.util.UIHelper.getControllerInstance();
		_.evalSubmitResult("submitLRC", false, {});
		_.oBusy.close();
		if (this.extHookOnSubmitLRCfail) {
			e = this.extHookOnSubmitLRCfail(e);
		}
		;
		com.peol.util.UIHelper.errorDialog(e);
	},
	onSubmitLRCsuccess : function(r, m) {
		var _ = com.peol.util.UIHelper.getControllerInstance();
		if (this.extHookOnSubmitLRCsuccess) {
			var e = this.extHookOnSubmitLRCsuccess(r, m);
			r = e.oResult;
			m = e.oMsgHeader;
		}
		;
		_.oLRSuccessResult = r;
		if (_.bSimulation) {
			if (m.severity) {
				if (m.severity == "warning") {
					var d = "";
					m.details.forEach(function(b) {
						d += unescape(b.message.substring(1, b.message.length - 1)) + '\r\n';
					});
					sap.ca.ui.message.showMessageBox({
						type : sap.ca.ui.message.Type.WARNING,
						message : unescape(m.message.substring(1, m.message.length - 1)),
						details : d
					}, jQuery.proxy(_._fetchApprover, _));
				} else {
					_._fetchApprover(r);
				}
			} else {
				_._fetchApprover(r);
			}
		} else {
			if (_.cale && _.changeMode) {
				_.cale.toggleDatesType(_._getDaysOfRange(_.oChangeModeData.startDate, _.oChangeModeData.endDate), _.oChangeModeData.evtType, false);
			}
			sap.m.MessageToast.show(_.resourceBundle.getText("LR_SUBMITDONE", [ _.sApprover ]), {
				width : "15em",
			});
			if (_.changeMode === true) {
			}
			_._clearData();
			_._setUpLeaveTypeData(_.slctLvType.getSelectedKey());
			_.note.setValue("");
			if (_.cale) {
				_.cale.unselectAllDates();
				var a = _._getDaysOfRange(_.oLRSuccessResult.StartDate, _.oLRSuccessResult.EndDate);
				_.cale.toggleDatesType(a, sap.me.CalendarEventType.Type06, false);
				_.cale.toggleDatesType(a, sap.me.CalendarEventType.Type01, false);
				_.cale.toggleDatesType(a, sap.me.CalendarEventType.Type07, false);
				_.cale.toggleDatesType(a, sap.me.CalendarEventType.Type04, true);
			}
		}
		_.oBusy.close();
	},
	_fetchApprover : function(l) {
		var _ = com.peol.util.UIHelper.getControllerInstance();
		var a = {};
		if (l.ApproverEmployeeName != "") {
			_.slctLvType.setSelectedKey(_.leaveType.AbsenceTypeCode);
			a.sApprover = _.sApprover = l.ApproverEmployeeName;
			_.evalSubmitResult("getApprover", true, a);
			_.evalSubmitResult("submitLRC", true, _.oLRSuccessResult);
		} else {
			com.peol.util.DataManager.getApprover(function(A) {
				_.slctLvType.setSelectedKey(_.leaveType.AbsenceTypeCode);
				a.sApprover = _.sApprover = A;
				_.evalSubmitResult("getApprover", true, a);
				_.evalSubmitResult("submitLRC", true, _.oLRSuccessResult);
			}, function(e) {
				a.sApprover = _.resourceBundle.getText("LR_UNKNOWN");
				_.evalSubmitResult("getApprover", false, a);
			}, this);
		}
	},
	evalSubmitResult : function(c, s, r) {
		var _ = com.peol.util.UIHelper.getControllerInstance();
		if (c === "submitLRC") {
			_.bSubmitOK = s;
			_.oSubmitResult = r;
		}
		if (c === "getApprover") {
			_.bApproverOK = s;
			_.sApprover = r.sApprover;
		}
		if (_.bSubmitOK === false) {
			if (_.oBusy) {
				_.oBusy.close();
			}
		} else if (_.bSubmitOK === true) {
			if (_.bApproverOK === false) {
				if (_.oBusy) {
					_.oBusy.close();
				}
				_.callDialog(_.oSubmitResult, _.sApprover);
			} else if (_.bApproverOK === true) {
				if (_.oBusy) {
					_.oBusy.close();
				}
				_.callDialog(_.oSubmitResult, _.sApprover);
			}
		}
	},
	callDialog : function(s, a) {
		var _ = com.peol.util.UIHelper.getControllerInstance();
		var b;
		var c;
		if (jQuery.sap.getUriParameters().get("responderOn")) {
			if (_.selRange.start === null) {
				_.selRange.start = _.cale.getSelectedDates()[0];
			}
			b = _.selRange.start;
			_.selRange.end == null ? c = _.selRange.start : c = _.selRange.end;
		} else {
			if (_.leaveType.AllowedDurationPartialDayInd) {
				b = com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(s.StartDate, "medium");
				c = com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(s.EndDate, "medium");
				b += " " + com.peol.util.Formatters.TIME_hhmm(s.StartTime);
				c += " " + com.peol.util.Formatters.TIME_hhmm(s.EndTime);
			} else {
				b = com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(s.StartDate);
				c = com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(s.EndDate);
			}
		}
		var S = {
				question : this.resourceBundle.getText("LR_CONFIRMATIONMSG", [ a ]),
				additionalInformation : [
				                         {
				                        	 label : _.resourceBundle.getText("LR_BALANCE_DEDUCTIBLE"),
				                        	 text : this.leaveType.AbsenceTypeName
				                         },
				                         {
				                        	 label : _.resourceBundle.getText("LR_FROM"),
				                        	 text : b
				                         },
				                         {
				                        	 label : _.resourceBundle.getText("LR_TO"),
				                        	 text : c
				                         },
				                         {
				                        	 label : _.resourceBundle.getText("LR_REQUEST"),
				                        	 text : com.peol.util.Formatters.DURATION(s.WorkingDaysDuration, s.WorkingHoursDuration) + " "
				                        	 + com.peol.util.Formatters.DURATION_UNIT(s.WorkingDaysDuration, s.WorkingHoursDuration)
				                         } ],
				                         showNote : false,
				                         title : _.resourceBundle.getText("LR_TITLE_SEND"),
				                         confirmButtonLabel : _.resourceBundle.getText("LR_OK")
		};
		if (this.extHookCallDialog) {
			S = this.extHookCallDialog(S);
		}
		;
		sap.ca.ui.dialog.factory.confirm(S, function(r) {
			if (r.isConfirmed == true) {
				_.submit(false);
			}
		});
	},
	onSelectionChange : function(e) {
		var s = e.getParameter("selectedItem");
		var a = s.getProperty("key");
		this._setUpLeaveTypeData(a);
	},
	getBalancesForAbsenceType : function(a) {
		if (a == undefined || a.length < 1)
			return;
		if (this.bookedVacation) {
			this.bookedVacation.setNumber("-");
		}
		;
		if (this.remainingVacation) {
			this.remainingVacation.setNumber("-");
		}
		;
		this._getBalancesBusyOn();
		var _ = this;
		nonlrBoolean=false;
		com.peol.util.DataManager.getBalancesForAbsenceType(a, function(b, t, B, T, s, c, d,resumptionSendStatus,requestID,ApproverEmployeeName) {
			_._getBalancesBusyOff();
			_.resumptionRequestID=requestID;
			if(ApproverEmployeeName!=""){
				_.byId("approvernamefield").setValue(_.resourceBundle.getText("approvernamefield")+" : "+ApproverEmployeeName);
			}


			var j = {
					BalancePlannedQuantity : b,
					BalanceAvailableQuantity : B,
					BalanceUsedQuantity : c,
					BalanceTotalUsedQuantity : d,
					TimeUnitName : T,
					Status : resumptionSendStatus
			};
			var m = new sap.ui.model.json.JSONModel(j);
			_.getView().setModel(m, "TimeAccount");

			//if(d)
			//_.bookedVacation.setNumber(d);
			if(b)
			{
				_.remainingVacation.setNumber(B);
				_.byId("LRS4_TXT_REMAINING").setText(_.resourceBundle.getText("LR_BALANCE_BALANCE")+" :  ");

			}
//			debugger;
			if(resumptionSendStatus=="NONL"||ApproverEmployeeName=="" || resumptionSendStatus=="NONR"){
				_.setBtnVisible("LRS4_BTN_SEND", false);
				_.setBtnVisible("LRS4_BTN_CANCEL", false);
				_.setBtnVisible("resumptionButton", false);
			}
			else if(resumptionSendStatus=="RESU"){

				_.setBtnVisible("LRS4_BTN_SEND", false);
				_.setBtnVisible("LRS4_BTN_CANCEL", false);
				_.setBtnVisible("resumptionButton", true);
			}
			else if(resumptionSendStatus==""){
				_.setBtnVisible("LRS4_BTN_SEND", true);
				_.setBtnVisible("LRS4_BTN_CANCEL", true);
				_.setBtnVisible("resumptionButton", false);
			}

			if(_.fromChangeBtn==true){
				_.setBtnVisible("LRS4_BTN_SEND", true);
				_.setBtnVisible("LRS4_BTN_CANCEL", true);
			}
			/*
			 * m.createBindingContext("/", function(C) {
			 * _.getView().setBindingContext(C, "TimeAccount") })
			 */

			var TimeAccount=_.getView().getModel("TimeAccount");
			/*if(TimeAccount.oData.Status==="SEND"){
				_.getView().byId("staticText").setValue(_.getView().getModel("i18n").getResourceBundle().getText("CALENDARHINT4"));
			}else if(TimeAccount.oData.Status==="RESU"){
				_.getView().byId("staticText").setValue(_.getView().getModel("i18n").getResourceBundle().getText("CALENDARHINT5"));

			}
			 */
			if(TimeAccount.oData.Status==="NONL"){
				_.getView().byId("staticText").setValue(_.getView().getModel("i18n").getResourceBundle().getText("CALENDARHINT6"));
				nonlrBoolean=true;

			}else if(TimeAccount.oData.Status==="NONR"){
				_.getView().byId("staticText").setValue(_.getView().getModel("i18n").getResourceBundle().getText("CALENDARHINT7"));
				nonlrBoolean=true;
			}
		}, function(e) {
			_._getBalancesBusyOff();
			if (_.bookedVacation) {
				_.bookedVacation.setNumber("-");
			}
			;
			_.bookedVacation.setNumberUnit("-");
			if (_.remainingVacation) {
				_.remainingVacation.setNumber("-");
			}
			;
			_.remainingVacation.setNumberUnit("-");
			com.peol.util.UIHelper.errorDialog(e);
		}, this);
	},
	onTimeChange : function(e) {
		var _ = this.byId("LRS4_DAT_ENDTIME").getValue();
		var a = this.byId("LRS4_DAT_STARTTIME").getValue();
		if (this.byId("LRS4_DAT_ENDTIME") && _ === "" && a !== "") {
			this.byId("LRS4_DAT_ENDTIME").setValue(a);
		}
		if (this.byId("LRS4_DAT_STARTTIME") && _ !== "" && a === "") {
			this.byId("LRS4_DAT_STARTTIME").setValue(_);
		}
	},
	onSendClick : function(e) {
		this.submit(true);
	},
	onCancelClick : function(e) {
		if (!this.changeMode) {
			this._isLocalReset = true;
			this._clearData();
			com.peol.util.CalendarTools.clearCache();
			this._setHighlightedDays(this.cale.getCurrentDate());
			_.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			var router= sap.ui.core.UIComponent.getRouterFor(_that);
			//router.navTo("History_Master",null,false);
			router.navTo("History_Master",{from : "history"},false);
		}
	},
	onEntitlementClick : function(e) {
		this.oRouter.navTo("entitlements", {});
	},
	_copyChangeModeData : function() {
		var _ = null;
		var a = null;
		var b = 0;
		var c = 0;
		if (this.oChangeModeData === {}) {
			return
		}
		;
		this.selRange.start = this.oChangeModeData.startDate;
		this.selRange.end = this.oChangeModeData.endDate;
		if (this.selRange.start === this.selRange.end) {
			this.selRange.end = null;
			if (this.cale) {
				this.cale.toggleDatesSelection(
						[ this.selRange.start ], true);
			}
		} else {
			if (this.cale) {
				this.cale.toggleDatesRangeSelection(this.selRange.start, this.selRange.end,	true);
			}
		}
		if (this.cale) {
			this.cale.setCurrentDate(this.selRange.start);
			this
			._setHighlightedDays(this.cale
					.getCurrentDate());
		}
		;
		this.requestID = this.oChangeModeData.requestID;
//		this.petrol.setSelected(this.oChangeModeData.PetrolCard);
//		this.tool_box.setSelected(this.oChangeModeData.ToolBox);
//		this.cash.setSelected(this.oChangeModeData.CashHandling);
//		this.others.setSelected(this.oChangeModeData.Others);
		this.contactNumber.setValue(this.oChangeModeData.Contact1);
		this.alternateContactNumber.setValue(this.oChangeModeData.Contact2);

		if (this.note) {/*
		 * if (this.byId("LRS4_NOTE") &&
		 * this.byId("LRS4_NOTE").getContent().length > 2)
		 * this.byId("LRS4_NOTE").removeContent(1); if
		 * (!!this.oChangeModeData.noteTxt &&
		 * this.oChangeModeData.noteTxt !== "") { var n = new
		 * sap.m.Text( { width : "100%", wrapping : true,
		 * layoutData : new
		 * sap.ui.layout.ResponsiveFlowLayoutData( { weight : 8 })
		 * }); n.setText(this.oChangeModeData.noteTxt);
		 * this.byId("LRS4_NOTE").insertContent(n, 1) }
		 */

			this.byId("LRS4_TXA_NOTE").setValue(this.oChangeModeData.noteTxt);
		}
		if(this.oChangeModeData.ResSubmit){
			this.setBtnVisible("LRS4_BTN_SEND", false);
			this.setBtnVisible("resumptionButton", true);
		}
		else{
			this.setBtnVisible("LRS4_BTN_SEND", true);
			this.setBtnVisible("resumptionButton", false);
		}

		if (typeof this.oChangeModeData.startTime === "string") {
			if (this.timeFrom) {
				(this.oChangeModeData.startTime === "PT00H00M00S") ? this.timeFrom
						.setValue("")
						: this.timeFrom
						.setValue(this.oChangeModeData.startTime
								.substring(2, 4)
								+ ":"
								+ this.oChangeModeData.startTime
								.substring(5, 7));
			}
			;
			if (this.timeTo) {
				(this.oChangeModeData.endTime === "PT00H00M00S") ? this.timeTo
						.setValue("")
						: this.timeTo
						.setValue(this.oChangeModeData.endTime
								.substring(2, 4)
								+ ":"
								+ this.oChangeModeData.endTime
								.substring(5, 7));
			}
		} else {
			_ = new Date(this.oChangeModeData.startTime.ms);
			b = _.getUTCHours();
			c = _.getUTCMinutes();
			b = (b < 10 ? "0" : "") + b;
			c = (c < 10 ? "0" : "") + c;
			if (this.timeFrom) {
				this.timeFrom.setValue(b + ":" + c);
			}
			;
			a = new Date(this.oChangeModeData.endTime.ms);
			b = a.getUTCHours();
			c = a.getUTCMinutes();
			b = (b < 10 ? "0" : "") + b;
			c = (c < 10 ? "0" : "") + c;
			if (this.timeTo) {
				this.timeTo.setValue(b + ":" + c);
			}
		}
		if (this.cale
				& this.cale.getSelectedDates().length === 0) {
			this.setBtnEnabled("LRS4_BTN_SEND", false);
		} else {
			this.setBtnEnabled("LRS4_BTN_SEND", true);
		}
	},
	_setInputTimePattern : function() {
		var t = new Date();
		var p = "";
		t.setHours(23, 30, 59);
		var T = com.peol.util.Formatters
		.TIME_hhmm(t);
		if (T !== "") {
			var a = T.split(":");
			var h = "";
			h = a[0];
			if (isNaN(h)) {
				p = "a hh:mm";
			} else if (parseInt(h) === 23) {
				p = "HH:mm";
			} else if (parseInt(h) === 11) {
				if (isNaN(a[a.length - 1])) {
					p = "hh:mm a";
				} else {
					p = "hh:mm";
				}
			}
		}
		;
		if (p !== "") {
			this.timeFrom.setDisplayFormat(p);
			this.timeTo.setDisplayFormat(p);
		}
	},
	_clearData : function() {
		this._clearDateSel();
		this.startDateDisplay.setValue("");
		this.endDateDisplay.setValue("");
		this.byId("staticText").setValue(this.resourceBundle.getText("CALENDARHINT1"));
		if (this._isLocalReset) {
			for ( var i = 0; i < this.calSelResetData.length; i++) {
				this.cale.toggleDatesType(
						this.calSelResetData[i].calEvt,
						this.calSelResetData[i].evtType, false);
			}
			this.calSelResetData = [];
		}
		this.oChangeModeData = {};
		if (this.cale) {
			this.cale.setCurrentDate(new Date());
		}
		;
		if (this.note) {
			this.note.setValue("");
			if (!!this.byId("LRS4_NOTE")
					&& this.byId("LRS4_NOTE").getContent().length > 2)
				this.byId("LRS4_NOTE").removeContent(1);
		}
		if (this.timeFrom) {
			this.timeFrom.setValue("");
			this.timeFrom.setEnabled(true);
		};
		if (this.timeTo) {
			this.timeTo.setValue("");
			this.timeTo.setEnabled(true);
		};
		// this.setBtnEnabled("LRS4_BTN_SEND", false);
		if (this.byId("LRS4_LBL_TITLE")) {
			this.byId("LRS4_LBL_TITLE").setText(
					this.resourceBundle
					.getText("LR_TITLE_CREATE_VIEW"));
		}
		;
		if (this.aLeaveTypes.length > 0
				&& this.changeMode == false
				&& this._isLocalReset == true) {
			var d = com.peol.util.DataManager
			.getCachedModelObjProp("DefaultAbsenceTypeCode");
			this.slctLvType
			.setSelectedKey(d.DefaultAbsenceTypeCode);
			this._setUpLeaveTypeData(d.DefaultAbsenceTypeCode);
		}
		this._isLocalReset = false;
		if (this.extHookClearData) {
			this.extHookClearData();
		}
		//this.byId("petrol").setSelected(false);
		//this.byId("tool_box").setSelected(false);
		//this.byId("cash").setSelected(false);
		//this.byId("others").setSelected(false);
		this.byId("LRS4_TXA_CONTACT_NO").setValue("");
		this.byId("LRS4_TXA_ALT_CONTACT_NO").setValue("");
	},
	_clearDateSel : function() {
		if (this.cale) {
			this.cale.unselectAllDates();
		}
		;
		this.selRange.end = null;
		this.selRange.start = null;
		// this.setBtnEnabled("LRS4_BTN_SEND", false)
	},
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	},
	goBack:function(){
		var router= sap.ui.core.UIComponent.getRouterFor(_that);
		router.navTo("Tile",null,true);
	},
	logout:function(){
		com.peol.utils.SessionManager.DeleteSession();
	},onAfterRendering : function() {
		var t = this;
		$(window).on("orientationchange", function(e) {
			t._orientationDependancies(e.orientation);
		});
		if (jQuery.device.is.phone === true) {
			if (this.cale) {
				this.cale.setMonthsToDisplay(1);
				this.cale.setMonthsPerRow(1);
			}
		}
		/*
		 * this.byId('LRS4_TXT_REMAININGDAY').onAfterRendering = function() {
		 * jQuery(this.getDomRef()).css({ 'text-align' : '-webkit-right',
		 * 'text-align' : 'right', }) };
		 * this.byId('LRS4_TXT_REMAINING_DAYS').onAfterRendering = function() {
		 * jQuery(this.getDomRef()).css({ 'font-size' : '1.5rem', 'font-weight' :
		 * '700' }) }; this.byId('LRS4_TXT_BOOKED_DAYS').onAfterRendering =
		 * function() { jQuery(this.getDomRef()).css({ 'font-size' : '1.5rem',
		 * 'font-weight' : '700' }) }
		 */
	},
	showResumptionDate : function(evt) {
		var dialog = new sap.m.Dialog({
			title : _that.resourceBundle.getText("XTIT_RESUMPTION"),
			type : "Standard",
			content : [
			           new sap.m.VBox({
			        	   items:[
			        	          new sap.m.Label({
			        	        	  text:_that.resourceBundle.getText("LR_TITLE_DETAILS_VIEW"),
			        	        	  design:"Bold",
			        	        	  textAlign:"Center",
			        	        	  width:"100%"
			        	          }),
			        	          new sap.ui.layout.VerticalLayout({
			        	        	  content:[  
			        	        	           new sap.ui.layout.HorizontalLayout({
			        	        	        	   content:[
			        	        	        	            new sap.m.Label({
			        	        	        	            	text:_that.resourceBundle.getText("LABEL_START_DATE"),
			        	        	        	            	design:"Bold"
			        	        	        	            }),
			        	        	        	            new sap.m.Text({
			        	        	        	            	text:com.peol.util.Formatter.dateFormate(sap.ui.getCore().getModel("additionalResumptionModel").oData.begdate)
			        	        	        	            })]
			        	        	           }),
			        	        	           new sap.ui.layout.HorizontalLayout({
			        	        	        	   content:[
			        	        	        	            new sap.m.Label({
			        	        	        	            	text:_that.resourceBundle.getText("LABEL_END_DATE"),
			        	        	        	            	design:"Bold"
			        	        	        	            }),
			        	        	        	            new sap.m.Text({
			        	        	        	            	text:com.peol.util.Formatter.dateFormate(sap.ui.getCore().getModel("additionalResumptionModel").oData.enddate)
			        	        	        	            })]
			        	        	           })]
			        	          }),
			        	          new sap.m.DatePicker({
			        	        	  placeholder : "{i18n>RESDATE_PLACEHOLDER}",
			        	          }).addStyleClass("dob")]
			           })
			           ],
			           beginButton : new sap.m.Button({
			        	   text : _.resourceBundle.getText("LR_SEND"),
			        	   press : function(evt) {
			        		   if (!_.oBusy) { _.oBusy = new sap.m.BusyDialog(); }
			        		   _.oBusy.open();
			        		   var oModel = sap.ui.getCore().getModel("ResumptionModel");
			        		   // var
			        		   // object=_HISTORY_CONTEXT.oModel.getProperty(_HISTORY_CONTEXT.sPath);
			        		   if(location.hostname == "localhost"){
			        			   _.resDate=evt.oSource.getParent().getParent().mAggregations.content[0].mAggregations.items[2].getDateValue();	
			        			  // _.resDate=evt.oSource.getParent().mAggregations.content[0].mAggregations.items[2].getDateValue();
			        		   }else{
			        			   _.resDate=evt.oSource.getParent().getParent().mAggregations.content[0].mAggregations.items[2].getDateValue();			        			   
			        		   }
			        		   _.resDate=new Date(_.resDate);
			        		   var startDate=sap.ui.getCore().getModel("additionalResumptionModel").oData.begdate;
			        		   if(startDate>_.resDate){
			        			   sap.m.MessageToast.show(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("RESUMPTION_FAIL_DATE_ERROR"));
			        			   _.oBusy.close();
			        			   return;
			        		   }
			        		   var sBody = {
			        				   Pernr : EMPLOYEE_ID,
			        				   Begda : com.peol.util.Formatters.DATE_YYYYMMdd(_.resDate) + 'T00:00:00',
			        				   // VersionNo:object.ChangeStateID,
			        				   RequestID:_.resumptionRequestID,
			        				   SessionID : SESSION_ID
			        		   };
			        		   oModel.create("/ResumSet", sBody, null,function(o,r){
			        			   sap.m.MessageToast.show(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("RESUMPTION_DONE"));
			        			   _.setBtnVisible("LRS4_BTN_SEND", false);
			        			   _.setBtnVisible("resumptionButton", false);
			        			   _.oBusy.close();
			        		   },function(o,r){
			        			   sap.m.MessageToast.show(sap.ui.getCore().getModel("i18n").getResourceBundle().getText("RESUMPTION_FAIL"));
			        			   _.oBusy.close();
			        		   });
			        		   dialog.close();
			        	   }
			           }),
			           endButton : new sap.m.Button({
			        	   text : _.resourceBundle.getText("LR_CANCEL"),
			        	   press : function() {
			        		   dialog.close();
			        	   }
			           })
		});
		dialog.open();
	}
});