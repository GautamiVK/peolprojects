jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("com.sap.shoppingcart.util.Formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("com.sap.shoppingcart.view.Dashboard_S1", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Dashboard_S1
*/
	onInit: function() {
		that = this ;
		
		//----- set model for tiles
		jModel = new sap.ui.model.json.JSONModel("model/tiles.json");
		tile = this.getView().byId("tile_container");
		tile.setModel(jModel,"tilesModel");
		
		stdTile = this.getView().byId("tile_std");
		
		//----- cart model
		var cartModel = new sap.ui.model.json.JSONModel({"Cart" : [] });
		core = sap.ui.getCore() ;
		core.setModel(cartModel,"CartModel");
		
		//----- user model
		userModel = core.getModel("User");
		user = userModel.getData().User ;
		
       this.oRouter.attachRoutePatternMatched(this._handleRouterMatched, this);
       
	},

	_handleRouterMatched:function(evt){
		if("dashboard" !== evt.getParameter("name")){
			return;
		}
		oModel = this.getView().getModel();
		userModel = core.getModel("User");
		user = userModel.getData().User ;
		
		oCartModel = core.getModel("CartModel");
		oCartData = oCartModel.getData();
		aCartEntries = oCartData.Cart;
		
		var j = tile.getModel("tilesModel").getData().TileCollection ;
		if(j != undefined){
			j[2].number = aCartEntries.length ;
		}
	},

	_handleLogoutButtonPress:function(evt){
		this.oRouter.navTo("fullscreen",null,false);
	} ,

	_handleNavButtonPress : function(evt) {
		this.oRouter.navTo("fullscreen", {}, false);
	},
	
	_handleTilePress : function(evt){
		 var index = evt.getSource().getParent()._iCurrentFocusIndex ;
		 switch(index){
			 case 0 : //sap.m.MessageToast.show("Profile");
			 		  this.openDialog('ProfileDisplay');
			 		  break ;
			 case 1 : //sap.m.MessageToast.show("Order summary");
			          this.oRouter.navTo("order",{},false);  
			          break ;
			 case 2 : //sap.m.MessageToast.show("Cart");
			 		  this.oRouter.navTo("cart",{},false);  
			 		  break ;
			 case 3 : //sap.m.MessageToast.show("Shop");
			 		  this.oRouter.navTo("master",{},false);  
			 		  break ;
		 }
	} ,
	
	
	//----- profile dialog open
	openDialog: function (sType) {
	    if (!this['Std']) {
	      this['Std'] = sap.ui.xmlfragment(
	        "com.sap.shoppingcart.view." + sType , this );
	      this.getView().addDependent(this['Std']);
	    }
	    this['Std'].bindElement("/ES_CUSTOMERS('"+user.EMAIL+"')");
	    jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this['Std']);
	    this['Std'].open();
	  } ,
	  
	//----- profile dialog close
	  onDialogCloseButton: function (oEvent) {
		    var sType = oEvent.getSource().data("dialogType");
		    this[sType].close();
		    
	  },

});