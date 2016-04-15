jQuery.sap.require("com.peol.util.Const");
jQuery.sap.require("com.peol.util.Formatter");
jQuery.sap.require("com.peol.util.Grouper");
jQuery.sap.require("com.peol.util.Formatters");
jQuery.sap.require("com.peol.util.UIHelper");
jQuery.sap.require("com.peol.util.DataManager");
jQuery.sap.require("sap.m.ObjectAttribute");

sap.ui.controller("com.peol.view.History_Master", {

	extHookChangeFooterButtons : null,
	extHookLeaveRequestCollection : null,
	extHookItemTemplate : null,
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

		// Set model for the view
		/*
		 * var url =
		 * "proxy/http/ai-eccpr-sand.alghanim.com:8013/sap/opu/odata/sap/ZLEAVE_REQUEST_SRV";
		 * oModel = new sap.ui.model.odata.ODataModel(url, true, "", "");
		 * this.getView().setModel(oModel);
		 */
		_that = this;
		this.oDataModel = sap.ui.getCore().getModel("leaveReqModel");
		com.peol.util.DataManager.init(this.oDataModel, this.resourceBundle);
		com.peol.util.Formatters.init(this.resourceBundle);
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	},

	/**
	 * @public [onDataLoaded On master list loaded]
	 */
	onDataLoaded : function() {
		var that = this;
		if (that.getList().getItems().length < 1) {
			if (!sap.ui.Device.system.phone) {
				that.showEmptyView();
			}

		}

	},
	getList : function() {
		return this.byId("list");
	},
	showEmptyView : function(sViewTitle, sLanguageKey, sInfoText) {
		var oList = this.getList();
		oList.removeSelections();
		return this;
	},
	getHeaderFooterOptions : function() {
		var _this = this;
		var objHdrFtr = {
				sI18NMasterTitle : "LR_TITLE_LEAVE_REQUESTS",
				onRefresh : function(searchField, fnRefreshCompleted) {
					_this._fnRefreshCompleted = fnRefreshCompleted;
					_this._searchField = searchField;
					_this._isMasterRefresh = true;
					_this._initData();
				}
		};

		/**
		 * @ControllerHook Modify the footer buttons This hook method can be
		 *                 used to add and change buttons for the detail view
		 *                 footer It is called when the decision options for the
		 *                 detail item are fetched successfully
		 * @callback hcm.emp.myzleaverequests.view.S3~extHookChangeFooterButtons
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

	_handleRouterMatched : function(oEvent) {
		if(oEvent.getParameter("name")=="History_Master"){
			this.masterListCntrl = this.oView.byId("list");
			this.objLeaveRequestCollection = null;
			this.oBus = sap.ui.getCore().getEventBus();
			/*
			 * this.oBus.subscribe("hcm.emp.myzleaverequests.LeaveCollection",
			 * "refresh", this._initData, this);
			 */
			this._initData();
			this.onDataLoaded();
			this._fnRefreshCompleted = null;
			this._isLocalRouting = false;
			this._isInitialized = false;
			this._isMasterRefresh = false;
			this._searchField = "";
			//sap.ui.core.UIComponent.getRouterFor(this).navTo("empty", null, false);
		}

	},
	_initData : function() {
		var _this = this;
		// sap.ca.ui.utils.busydialog.requireBusyDialog();
		// Scom.peol.util.DataManager.init(this.oDataModel,
		// this.resourceBundle);

		// creation of a local JSON model is required because
		// the leave request collection in the OData model
		// contains
		// all leave requests including change requests. In the
		// list view, only the original requests shall be shown.
		// Change requests to the original requests shall be
		// only reflected by adding an additional info field
		// like e.g.
		// 'Change Pending'
		// Solution: Function getConsolidatedLeaveRequests
		// operates on all leave requests and creates a new
		// collection
		// result only
		// containing the original requests which have a
		// relation to the change request leave key
		if (!com.peol.util.UIHelper.getIsLeaveCollCached()) {
			com.peol.util.DataManager.getConsolidatedLeaveRequests(function(objResponse) {

				_this.objLeaveRequestCollection = objResponse.LeaveRequestCollection;

				/**
				 * @ControllerHook Modify the LeaveRequestCollection response
				 *                 This hook method can be used to modify the
				 *                 LeaveRequestCollection It is called when the
				 *                 method LeaveRequestCollection in DataManager
				 *                 executes
				 * @callback hcm.emp.myzleaverequests.view.S3~extHookLeaveRequestCollection
				 * @param {object}
				 *            LeaveRequestCollection Object
				 * @return {object} LeaveRequestCollection Object
				 */
				if (this.extHookLeaveRequestCollection) {
					_this.objLeaveRequestCollection = this.extHookLeaveRequestCollection(_this.objLeaveRequestCollection);
				}
				;

				com.peol.util.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests", _this.objLeaveRequestCollection);
				com.peol.util.UIHelper.setIsLeaveCollCached(false);
				_this.setMasterListItems();
				if (_this._searchField != "") {
					_this.applySearchPattern(_this._searchField);
				}
			}, function(objResponse) {

				errorCallback(com.peol.util.DataManager.parseErrorMessages(objResponse));
			});
		} else {
			_this.objLeaveRequestCollection = com.peol.util.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			com.peol.util.UIHelper.setIsLeaveCollCached(false);
			_this.setMasterListItems();
		}
	},

	// @overriding since we are using LeaveKey/RequestId as
	// contextPath
	getDetailNavigationParameters : function(oListItem) {
		var navProperty = "";
		if (!!oListItem) {
			var parameters = oListItem.getBindingContext(this.sModelName).getPath().substr(1).split("/");
			if ((parameters.length > 1) && (this.objLeaveRequestCollection.length > parameters[1])) {
				navProperty = this.objLeaveRequestCollection[parameters[1]]._navProperty;
			}
			return {
				contextPath : encodeURIComponent(navProperty)
			};
		}
	},
	_handleSelectItem : function(evt) {
		var context = evt.getSource().getBindingContext();
		var router = sap.ui.core.UIComponent.getRouterFor(_that);
		context = {
				contextPath : encodeURIComponent(context)
		};
		_HISTORY_CONTEXT = evt.getSource().getBindingContext();
		/*var list = this.byId("list");
		secondStatus = list.getSelectedItems()[0].mAggregations.secondStatus.mProperties.text;*/
		router.navTo("History_Detail", context, false);
	},
	setMasterListItems : function() {

		var _this = this;
		if (_this.objLeaveRequestCollection) {
			com.peol.util.UIHelper.setRoutingProperty(_this.objLeaveRequestCollection);
			_this.objLeaveRequestCollection = com.peol.util.UIHelper.getRoutingProperty();
			var oModel = new sap.ui.model.json.JSONModel({
				"LeaveRequestCollection" : _this.objLeaveRequestCollection
			});
			_this.oView.setModel(oModel);
			// _this._isLocalRouting = true;

			var itemTemplate = new sap.m.ObjectListItem({
			
				type : "{device>/listItemType}",
				press : this._handleSelectItem,
				//title : "{AbsenceTypeName}",
				number : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'},{path:'aRelatedRequests'}], formatter:'com.peol.util.Formatters.DURATION'}",
				numberUnit : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'},{path:'aRelatedRequests'}], formatter:'com.peol.util.Formatters.DURATION_UNIT'}",
				attributes : [ new sap.m.ObjectAttribute({
					text : "{parts:[{path:'StartDate'},{path:'StartDate1'}], formatter:'com.peol.util.Formatters.FORMAT_STARTDATE'}"
				}), new sap.m.ObjectAttribute({
					text : "{parts:[{path:'i18n>LR_HYPHEN'},{path:'WorkingDaysDuration'},{path:'StartTime'},{path:'EndDate'},{path:'EndTime'},{path:'aRelatedRequests'}], formatter: 'com.peol.util.Formatters.FORMAT_ENDDATE'}"
				}) ],
				firstStatus : new sap.m.ObjectStatus({
					text : "{StatusName}",
					state : "{path:'StatusCode', formatter:'com.peol.util.Formatters.State'}"
				}),
				secondStatus : new sap.m.ObjectStatus({
					state : "Error",
					text : "{path:'aRelatedRequests', formatter:'com.peol.util.Formatters.FORMATTER_INTRO'}"
				})
			});

			/**
			 * @ControllerHook Modify the item template for list This hook
			 *                 method can be used to modify the itemTemplate It
			 *                 is called when the method setMasterListItems
			 *                 executes
			 * @callback hcm.emp.myzleaverequests.view.S3~extHookItemTemplate
			 * @param {object}
			 *            itemTemplate Object
			 * @return {object} itemTemplate Object
			 */
			if (this.extHookItemTemplate) {
				itemTemplate = this.extHookItemTemplate(itemTemplate);
			}

			_this.masterListCntrl.bindItems({
				path : "/LeaveRequestCollection",
				template : itemTemplate
			});
			if (_this._fnRefreshCompleted) {
				_this._fnRefreshCompleted();
			}
			// sap.ca.ui.utils.busydialog.releaseBusyDialog();
		}

		/* sap.ca.ui.utils.busydialog.releaseBusyDialog() */;
		if (!jQuery.device.is.phone && !_this._isInitialized) {
			// _this.registerMasterListBind(_this.masterListCntrl);
			_this._isInitialized = true;
		}
		if (!jQuery.device.is.phone) {
			// _this.setLeadSelection();
		}

	},

	// event handler for setting the lead selection in the
	// history overview list. Initially the first entry is
	// preselected.
	// also called when in history details a leave was withdrawn
	/*
	 * setLeadSelection : function() { var oItems =
	 * this.masterListCntrl.getItems(); var oIndex = null, searchKey = null; var
	 * completeURL = window.location.hash.split('detail'); if (completeURL[1]
	 * !== undefined) { completeURL = completeURL[1].split('/'); } if
	 * (completeURL[1] !== undefined) { searchKey =
	 * decodeURIComponent(completeURL[1]); searchKey =
	 * decodeURIComponent(searchKey); } if ((searchKey !== null && searchKey !==
	 * "") && (this.objLeaveRequestCollection)) { for (var i = 0; i <
	 * this.objLeaveRequestCollection.length; i++) { if
	 * (this.objLeaveRequestCollection[i]._navProperty === searchKey) { oIndex =
	 * i; break; } } if (oIndex === null) { if
	 * (com.peol.util.UIHelper.getIsWithDrawn(searchKey) && (oItems.length > 0)) {
	 * this.setListItem(oItems[0]); } else { this.showEmptyView(); } } else { if
	 * (oItems.length > oIndex) { this.setListItem(oItems[oIndex]); } } } else {
	 * oIndex = 0; if (oItems.length > 0) { this.setListItem(oItems[oIndex]); } } },
	 */

	/*
	 * setListItem : function(oItem) { if (this._isMasterRefresh) {
	 * this._isMasterRefresh = false; this.setLeadSelection(); } else { if
	 * (oItem !== undefined) { oItem.setSelected(true);
	 * nav.to("History_Detail",oItem.getBindingContext()); }
	 * this._isLocalRouting = true; } },
	 */

	_handleSelect : function(evt) {
		var context = evt.getParameter("listItem").getBindingContext();
		var router = sap.ui.core.UIComponent.getRouterFor(_that);
		context = {
				contextPath : encodeURIComponent(context)
		};
		_HISTORY_CONTEXT = evt.getParameter("listItem").getBindingContext();
		/*var list = this.byId("list");
		secondStatus = list.getSelectedItems()[0].mAggregations.secondStatus.mProperties.text;*/
		router.navTo("History_Detail", context, false);
	},
	
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	},
	goBack : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(_that);
		router.navTo("initial", null, true);
	},
	handleSearch : function(evt) {
		var key = evt.getParameter("newValue");
		var finalfilter=[];
		finalfilter.push(new sap.ui.model.Filter("AbsenceTypeName",sap.ui.model.FilterOperator.Contains,key));
		finalfilter.push(new sap.ui.model.Filter("StatusName",sap.ui.model.FilterOperator.Contains,key));
		finalfilter.push(new sap.ui.model.Filter("RequestID",sap.ui.model.FilterOperator.Contains,key));
		var filter=new sap.ui.model.Filter(finalfilter,false);
		this.byId("list").getBinding("items").filter(filter, "Application");
	}

});