jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("com.sap.shoppingcart.view.welcome", {

onInit : function() {
		
		var view = this.getView();
		oModel = view.getModel();
		this.oRouter.attachRoutePatternMatched(this._handleRouterMatched, this);
		
},

_handleRouterMatched:function(oEvent){
	if (oEvent.getParameter("name") === "detail") {
			
					
			}
		},

_handleLogoutButtonPress:function(evt)
{
 this.oRouter.navTo("fullscreen",null,true);
} ,
_handleCartButtonPress : function(event){
	this.oRouter.navTo("cart",{},false);
			},

		});