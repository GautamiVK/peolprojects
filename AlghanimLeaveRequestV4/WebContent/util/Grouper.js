jQuery.sap.declare("com.peol.util.Grouper");

com.peol.util.Grouper = {

	bundle : null, // somebody has to set this

	Status : function (oContext) {
		var status = oContext.getProperty("Status");
		var text = com.peol.util.Grouper.bundle.getText(status + " " + "Requests", "?");
		return {
			key: status,
			text: text
		};
	},

	ecost : function (oContext) {
		var price = oContext.getProperty("ecost");
		/*var currency = oContext.getProperty("currency");*/
		var key = null,
			text = null;
		if (price <= 500) {
			key = "LE10";
			text = "Amount < 500 ";
		} else if (price > 500 && price <= 1000) {
			key = "LE100";
			text = "Amount < 1000  ";
		} else if (price > 1000) {
			key = "GT100";
			text = "Amount > 1000 ";
		}
		return {
			key: key,
			text: text
		};
	}
};