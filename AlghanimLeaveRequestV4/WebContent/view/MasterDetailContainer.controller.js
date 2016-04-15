sap.ui.controller("view.MasterDetailContainer", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.MasterDetailContainer
	 */
	/*
	 * onInit: function() {
	 * this.router=sap.ui.core.UIComponent.getRouterFor(this);
	 * this.router.attachRoutePatternMatched(this._handleRouterMatched, this);
	 * this.app=this.getView().byId("MasterDetailPage"); },
	 * _handleRouterMatched:function(evt){
	 * if(evt.getParameter("name")=="MasterDetailContainer"){
	 * if(evt.getParameter("arguments").screenType=="History"){ var master =
	 * sap.ui.xmlview("History", "com.peol.view.History_Master");
	 * this.app.addPage(master, true); } } }
	 */
	onInit : function() {

		com.peol.utils.SessionManager.init(this).checkSession();
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);

			}, this)
		});
	},
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(this).checkSession();
	}
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's
	 * View is re-rendered (NOT before the first rendering! onInit() is used for
	 * that one!).
	 * 
	 * @memberOf view.MasterDetailContainer
	 */
//	onBeforeRendering: function() {

//	},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document).
	 * Post-rendering manipulations of the HTML could be done here. This hook is the
	 * same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf view.MasterDetailContainer
	 */
//	onAfterRendering: function() {

//	},
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and
	 * finalize activities.
	 * 
	 * @memberOf view.MasterDetailContainer
	 */
//	onExit: function() {

//	}
});