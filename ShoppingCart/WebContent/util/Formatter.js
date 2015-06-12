jQuery.sap.declare("com.sap.shoppingcart.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
com.sap.shoppingcart.util.Formatter = {
		
	 //product availability
	_statusProductAvailability : {
		"AVAILABLE" : "Success",
		"OUTOFSTOCK" : "Warning"
	},
	statusProductAvailabilityText : function(value) {
		if(value == "OUTOFSTOCK"){
			value = "OUT OF STOCK" ;
		}
		return value ;
	},
	statusProductAvailabilityState : function(value) {
		var map = com.sap.shoppingcart.util.Formatter._statusProductAvailability;
		return ( value && map[value]) ? map[value] : "None";
	},
	
	
	_statusShipStatus : {
		"DELIVERED" : "Success",
		"PENDING" : "Warning",
		"CANCELLED" : "Error"
	},
	statusShipStatusText : function(value) {
		return value ;
	},
	statusShipStatusState : function(value) {
		var map = com.sap.shoppingcart.util.Formatter._statusShipStatus;
		return ( value && map[value]) ? map[value] : "None";
	},
	
	
	dateConversion : function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat
					.getDateTimeInstance({
						pattern : "dd-MMM-yyyy"
					});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},
	
};