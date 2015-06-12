sap.ui.controller("com.sap.shoppingcart.Main", {

	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('com.sap.shoppingcart', this);
	}
});
