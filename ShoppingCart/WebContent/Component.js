// define a root UIComponent which exposes the main view
jQuery.sap.declare("com.sap.shoppingcart.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// extent of sap.ca.scfld.md.ComponentBase
sap.ca.scfld.md.ComponentBase.extend("com.sap.shoppingcart.Component", {
	metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
		"name": "Shopping Cart",
		"version" : "${project.version}",
		"library" : "com.sap.shoppingcart",
		"includes" : ["css/display.css"],
		"dependencies" : {
			"libs" : ["sap.m", "sap.me"],
			"components" : [],
		},
		viewPath : "com.sap.shoppingcart.view",
		
			
		masterPageRoutes : {
			"master" : {
				"pattern" : "dashboard/category",
				"view" : "S2"
			} 
		},
		detailPageRoutes:{
			"detail":{
				"pattern":"dashboard/category/{context}",
				"view":"S3"
			},
			"welcome":{
				"pattern":"dashboard/category",
				"view":"welcome"
			}
		},
		fullScreenPageRoutes : {
			"fullscreen" : {
				"pattern" : "",
				"view" : "S1"
			},
			"dashboard" : {
				"pattern" : "dashboard",
				"view" : "Dashboard_S1"
			},
			"order" : {
				"pattern" : "dashboard/orders",
				"view" : "Orders_S1"
			},
			
			"productdetail":{
				"pattern":"dashboard/{from}/productdetail/{path}",
				"view":"ProductDetail_S3"
			},
			"cart":{
				"pattern":"dashboard/cart",
				"view":"Cart_S1"
			},
		}

		
	}),	

	
	
	
	
	
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var oViewData = {
			component : this
		};
		return sap.ui.view({
			viewName : "com.sap.shoppingcart.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
});