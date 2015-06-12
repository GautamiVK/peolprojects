
jQuery.sap.declare("com.sap.shoppingcart.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("com.sap.shoppingcart.Configuration", {

	oServiceParams: {
		serviceList: [
			{
				masterCollection: "ES_CUSTOMERS",
				serviceUrl: "proxy/http/119.82.125.18:50000/sap/opu/odata/sap/Z_SHOPPING_CART_SRV/",
				//serviceUrl: "/sap/opu/odata/sap/Z_SHOPPING_CART_SRV/",
				isDefault: true,
				//mockedDataSource: "/com.sap.shoppingcart/model/metadata.xml"
			}
		]
	},

	getServiceParams: function () {
		return this.oServiceParams;
	},

	getAppConfig: function() {
		return this.oAppConfig;
	},

	/**
	 * @inherit
	 */
	getServiceList: function () {
		return this.oServiceParams.serviceList;
	},

	getMasterKeyAttributes: function () {
		return ["Id"];
	}

});
