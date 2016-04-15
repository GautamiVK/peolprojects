jQuery.sap.declare("views.common.controls.tile.AreaChart");
jQuery.sap.require("views.common.controls.tile.area");
sap.ui.core.Control.extend("views.common.controls.tile.AreaChart", {
	metadata : {
		properties : {
			dimension : {
				type : "string",
				defaultValue : null
			},
			measure : {
				type : "string",
				defaultValue : null
			},
			toleranceLow : {
				type : "string",
				defaultValue : null
			},
			deviationLow : {
				type : "string",
				defaultValue : null
			},
			target : {
				type : "string",
				defaultValue : null
			},
			toleranceHigh : {
				type : "string",
				defaultValue : null
			},
			deviationHigh : {
				type : "string",
				defaultValue : null
			},
			improvementDirection : {
				type : "string",
				defaultValue : "1"
			},
			data : {
				type : "any",
				defaultValue : null
			},
			width : {
				type : "sap.ui.core.CSSSize",
				defaultValue : "200px"
			},
			height : {
				type : "sap.ui.core.CSSSize",
				defaultValue : "190px"
			}
		}
	},
	init : function() {
		var t = this;
		window.addEventListener("resize", function() {
			if (t.getDomRef()) {
				t.rerender()
			}
		})
	},
	renderer : function(r, c) {
		r.write("<div");
		r.writeControlData(c);
		r.addClass("sapUiCockpitAreaChart");
		r.writeClasses();
		r.write(">");
		r.write("<div id=\"sap-ui-dummy-");
		r.writeEscaped(c.getId());
		r.write("\" style='height : 100%'>");
		r.write("</div>");
		r.write("</div>")
	},
	onAfterRendering : function() {
		var t = this.$().width();
		var a = this.$().height();
		var d = [];
		d = this.getData();
		var b = this.getDimension();
		var m = this.getMeasure();
		var c = this.getImprovementDirection();
		var e = this.getToleranceLow();
		var f = this.getDeviationLow();
		var g = this.getToleranceHigh();
		var h = this.getDeviationHigh();
		var j = this.getTarget();
		if (!(d && b && m)) {
			return
		}
		this.areaChart = sap.viz.api.core.createViz({
			type : 'viz/ext/area',
			container : "#sap-ui-dummy-" + this.getId()
		});
		var C = sap.viz.api.data.CrosstableDataset;
		var k = {
			area : {
				tileWidth : t,
				tileHeight : a,
				improvementDirection : c,
				deviationLow : f,
				toleranceLow : e,
				target : j,
				toleranceHigh : g,
				deviationHigh : h
			}
		};
		var i;
		var l = [];
		var n = [];
		for (i = 0; i < d.length; i++) {
			l[i] = i + "";
			n[i] = d[i][m]
		}
		var o = new C();
		o.data({
			'analysisAxis' : [ {
				'index' : 1,
				'data' : [ {
					'name' : b,
					'values' : l
				} ]
			} ],
			'measureValuesGroup' : [ {
				'index' : 1,
				'data' : [ {
					'name' : m,
					'values' : [ n ]
				} ]
			} ]
		});
		this.areaChart.data(o);
		this.areaChart.properties(k)
	},
});
