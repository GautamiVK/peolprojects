jQuery.sap.declare("com.peol.utils.SessionManager");
jQuery.sap.require("com.peol.util.CalendarTools");

com.peol.utils.SessionManager = {
	init : function(oController) {
		this.oController=oController;
		if (typeof (Storage) != "undefined") {
			this.sessionHandler=localStorage;
		} else {

		}
		return this;
	},
	createSession : function() {
		this.sessionHandler.setItem("appSession",true);
	},
	checkSession : function() {
		if(this.sessionHandler.getItem("appSession"))
			return true;
		else{
			$(location).attr('href',window.location.origin+window.location.pathname);
		}
	},
	ifAlreadyLoggedIn:function(){
		if(this.sessionHandler.getItem("appSession")){
			$(location).attr('href',window.location.origin+window.location.pathname+"#/tiles/");
		}
	},
	invalidateSession:function(){
		com.peol.util.CalendarTools.clearCache();
		this.sessionHandler.removeItem("appSession");
		return this;
	},
	DeleteSession:function(){
		var oModel = sap.ui.getCore().getModel("logOutModel");
		_that = this;
		oModel.read("/Logout(EmployeeID='" + EMPLOYEE_ID + "',SessionID='" + SESSION_ID + "')", null, null, true, function(oData, oResponse) {
			_that.invalidateSession();
			EMPLOYEE_NAME=null;
			SESSION_ID=null;
			$(location).attr('href',window.location.origin+window.location.pathname);
		});		
	},
	checkManager:function(){
		if(!sap.ui.getCore().getModel("logInDataModel").oData.isManager){
			this.oController.router.navTo("Tile",null,false);
		}
	}
};