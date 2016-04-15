jQuery.sap.declare("com.peol.customtile.common.controls.tile.NumericKpiTile");
jQuery.sap.require("sap.suite.ui.commons.InfoTile");

sap.suite.ui.commons.InfoTile.extend("com.peol.customtile.common.controls.tile.NumericKpiTile", {
	metadata : {
		properties : {
			value : {
				type : "string"
			},
			unit : {
				type : "string"
			},
			unitOfMeasure : {
				type : "string"
			},
			trendImage : {
				type : "string",
				defaultValue : ""
			},
			color : {
				type : "string"
			},
			image : {
				type : "string"
			}
		},

	},

	init : function() {
		sap.suite.ui.commons.InfoTile.prototype.init.apply(this);

	},
	onBeforeRendering : function() {
		this._setContentProperty("size", this.getSize());
	},
	onAfterRendering : function() {
		// this._addDescriptionMargin();
	},

	_setContentProperty : function(sProp, sValue) {
		var oCnt = this.getContent();
		if (oCnt) {
			oCnt.setProperty(sProp, sValue);
		}
	},

	renderer : {
		renderContent : function(oRm, oControl) {
			if (sap.suite.ui.commons.LoadState.Loaded == oControl.getState()) {
				oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-content");
				oRm.addClass("numericKpiTileContent");
				oRm.addClass(oControl.getSize());
				oRm.writeClasses();
				oRm.write(">");
				if (oControl.getTrendImage !== "") {
					var trendIcon = new sap.ui.core.Icon({
						src : sap.ui.core.IconPool.getIconURI(oControl.getTrendImage()),
						color : oControl.getColor()
					});
					oRm.renderControl(trendIcon);
				}

				oRm.write("<span style='color:" + oControl.getColor() + "'");
				oRm.writeAttribute("id", oControl.getId() + "-value");
				oRm.addClass("tileValue");
				oRm.addClass(oControl.getSize());
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oControl.getValue());
				oRm.write("</span>");

				/*
				 * oRm.write("<span style='color:"+oControl.getColor()+"'");
				 * oRm.writeAttribute("id", oControl.getId() + "-value");
				 * oRm.write(">"); oRm.writeEscaped(oControl.getUnit());
				 * oRm.write("</span>");
				 */

				oRm.write("<span");
				oRm.writeAttribute("id", oControl.getId() + "-value");
				oRm.write(">");
			/*	oRm.write("<img src='"+oControl.getImage()+"' style='width: 65px;height: 50px;padding-left: 42px;padding-top: 14px;'/>");*/
				oRm.write("</span>");	
				oRm.write("</div>");

				oRm.write("<div");
				oRm.writeAttribute("id", oControl.getId() + "-content");
				oRm.addClass("numericKpiTileFooter");
				oRm.addClass(oControl.getSize());
				oRm.writeClasses();
				oRm.write(">");

				oRm.write("<span");
				oRm.writeAttribute("id", oControl.getId() + "-unit");
				oRm.addClass("sapSuiteCmpTileUnitInner");
				oRm.writeClasses();
				oRm.write(">");
				oRm.writeEscaped(oControl.getUnitOfMeasure());
				oRm.write("</span>");
				oRm.write("</div>");
			}
		},

	}
});
