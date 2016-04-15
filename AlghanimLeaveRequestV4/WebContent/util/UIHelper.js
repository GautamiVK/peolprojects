/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.dialog.factory");

jQuery.sap.declare("com.peol.util.UIHelper");

com.peol.util.UIHelper = (function() {

	var _cntrlrInst = null;
	var _objLeaveRequestCollection = null;
	var _isLeaveCollCached = false;
	var _isWithDrawn = [];
	var _isChangeAction = false;

	
	return {

		setControllerInstance : function(oControllerInst) {
			_cntrlrInst = oControllerInst;
		},

		getControllerInstance : function() {
			return _cntrlrInst;
		},
		setRoutingProperty : function(objLeaveRequestCollection) {
			if(!!objLeaveRequestCollection){
				for ( var oItemIndex = 0; oItemIndex < objLeaveRequestCollection.length; oItemIndex++) {
					var oLeaveKey = objLeaveRequestCollection[oItemIndex].LeaveKey;
					var oRequestID = objLeaveRequestCollection[oItemIndex].RequestID;
					if(oRequestID!==""){
						objLeaveRequestCollection[oItemIndex]._navProperty = oRequestID;
					}else{
						objLeaveRequestCollection[oItemIndex]._navProperty = oLeaveKey;
					}
				}
			}
			_objLeaveRequestCollection = objLeaveRequestCollection;
		},

		getRoutingProperty : function() {
			return _objLeaveRequestCollection;
		},
		setIsLeaveCollCached : function(isLeaveCollCached) {
			_isLeaveCollCached = isLeaveCollCached;
		},

		getIsLeaveCollCached : function() {
			return _isLeaveCollCached;
		},
		
		setIsWithDrawn : function(id) {
			_isWithDrawn.push(id);
		},

		getIsWithDrawn : function(id) {
			if(jQuery.inArray(id,_isWithDrawn) >= 0)
			return true;
			else return false;
		},
		
		setIsChangeAction : function(oStatus) {
			_isChangeAction = oStatus;
		},

		getIsChangeAction : function() {
			return _isChangeAction;
		},
		
		errorDialog : function(messages) {

			var _errorTxt = "";
			var _firstMsgTxtLine = "";
			var _detailmsg = "";
			var oSettings = "";

			if (typeof messages === "string") {
				oSettings = {
					message : messages,
					type : sap.ca.ui.message.Type.ERROR
				};
			} else if (messages instanceof Array) {

				for ( var i = 0; i < messages.length; i++) {
					_errorTxt = "";
					if (typeof messages[i] === "string") {
						_errorTxt = messages[i];
					} else if (typeof messages[i] === "object") {
						_errorTxt = messages[i].value;
					}
					if (i == 0) {
						_firstMsgTxtLine = _errorTxt;
					} else {
						_detailmsg = _detailmsg + _errorTxt + "\n";
					}
				}

				if (_detailmsg == "") { // do not show any details if none are there
					oSettings = {
						message : _firstMsgTxtLine,
						type : sap.ca.ui.message.Type.ERROR
					};
				} else {
					oSettings = {
						message : _firstMsgTxtLine,
						details : _detailmsg,
						type : sap.ca.ui.message.Type.ERROR
					};
				}

			}
			sap.ca.ui.message.showMessageBox(oSettings);
		}

	};

}());