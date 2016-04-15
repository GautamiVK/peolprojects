jQuery.sap.require("com.peol.customtile.common.TileManager");
jQuery.sap.require("com.peol.utils.SessionManager");
jQuery.sap.require("com.peol.util.Formatter");
sap.ui.controller("com.peol.view.Tile", {
	/**
	 * @memberOf tiledemo.Tile
	 */
	onInit : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
		this.pernr = sap.ui.getCore().getModel("pernr");
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);
			}, this)
		});
		if(!sap.ui.getCore().getModel("logInDataModel").oData.isManager){
			this.byId("ManangerSection").setVisible(false);
		}
		this.byId("Ename").setText(this.resourceBundle.getText("WELCOME")+" "+sap.ui.getCore().getModel("logInDataModel").oData.Ename);
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
		/*var welcomeBar=this.byId("welcomeBar");
		welcomeBar.addContentRight(new sap.ui.core.HTML({
			preferDOM : true,
			content : "<embed id='adobeTag' src='/sap/opu/odata/sap/ZLEAVE_APPROVAL_SRV_01/EmployeeCollection(%275178%27)/$value' />"
		}));*/
		this.byId("profileimage").setSrc("/sap/opu/odata/sap/ZLEAVE_APPROVAL_SRV/EmployeeCollection('" + EMPLOYEE_ID + "')/$value");
	},
	resourceBundle : {
		getText : function(key,array) {
			return sap.ui.getCore().getModel("i18n").getResourceBundle().getText(key,array);
		}
	},
	_handleRouterMatched:function(evt){
		if(evt.getParameter("name")=="Tile"){
			com.peol.customtile.common.TileManager.updateCustomTileApproveLeave(this.getView());
			com.peol.customtile.common.TileManager.updateCustomTileApproveResumption(this.getView());
		}
	},
	requestTilePressed : function(oEvent) {
		/*
		 * this.applicationURL = window.location.href; var languagePattern = new
		 * RegExp("sap-language=(.*?)#"); var languageCode =
		 * languagePattern.exec(this.applicationURL); if(languageCode){
		 * this.targetURL =
		 * "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=400&sap-language=" +
		 * languageCode[1] + "#Zleave-display"; } else{ this.targetURL =
		 * "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=400&sap-language=EN#Zleave-display"; }
		 * window.location = this.targetURL;
		 */
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.navTo("initial", null, false);
	},

	approveTilePressed : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		//router.navTo("Approve_Master", null, false);		
		router.navTo("Approve_Master", {from : "tile" } , false);	
		if (!jQuery.device.is.phone){
			router.navTo("empty", null , false);
		}
	},
	resumptionTilePressed : function() {
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		//router.navTo("Resumption_Master", null , false);
		router.navTo("Resumption_Master", {from : "tile" } , false);
		//router.navTo("empty", null , false);
		if (!jQuery.device.is.phone){
			router.navTo("empty", null , false);
		}
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf tiledemo.Tile
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf tiledemo.Tile
	 */
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	},
	logout:function(){
		com.peol.utils.SessionManager.DeleteSession();
	}

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and
	 * finalize activities.
	 * 
	 * @memberOf tiledemo.Tile
	 */
//	onExit: function() {

//	}
});