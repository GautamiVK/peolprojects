/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("com.peol.utils.NumberFormatter");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
com.peol.utils.NumberFormatter = (function() {
	"use strict";
	return {
		formatNumberStripZeros : function(n) {
			var a = sap.ca.ui.model.format.NumberFormat.getInstance();
			if (typeof n === "string") {
				return a.format(Number(n))
			}
			return a.format(n)
		}
	}
}());
