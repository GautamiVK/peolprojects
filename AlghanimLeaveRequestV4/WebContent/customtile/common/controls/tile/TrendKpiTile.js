jQuery.sap.declare("views.common.controls.tile.TrendKpiTile");
jQuery.sap.require("views.common.controls.tile.AreaChart");
$.sap.includeStyleSheet("css/areaChart.css");

sap.suite.ui.commons.InfoTile.extend("views.common.controls.tile.TrendKpiTile", {
	metadata : {
		properties : {
			minMeasureValue : {
				type : "string",
				defaultValue : ""
			},
			maxMeasureValue : {
				type : "string",
				defaultValue : ""
			},
			minDimensionValue : {
				type : "string",
				defaultValue : ""
			},
			maxDimensionValue : {type : "string",defaultValue : ""},
			unitOfMeasure: {type : "string" }
		},
		aggregations : {
			_minMeasureValue : {
				type : "sap.m.Text",
				multiple : false,
				visibility : "hidden"
			},
			_maxMeasureValue : {
				type : "sap.m.Text",
				multiple : false,
				visibility : "hidden"
			},
			_minDimensionValue : {
				type : "sap.m.Text",
				multiple : false,
				visibility : "hidden"
			},
			_maxDimensionValue : {
				type : "sap.m.Text",
				multiple : false,
				visibility : "hidden"
			},
			_areaChart : {
				type : "views.common.controls.tile.AreaChart",
				multiple : false,
				visibility : "hidden"
			},
		}
	},
	init : function() {
		sap.suite.ui.commons.InfoTile.prototype.init.apply(this);
		this.setAggregation("_minMeasureValue", new sap.m.Text()
				.addStyleClass("minValue measure"));
		this.setAggregation("_maxMeasureValue", new sap.m.Text()
				.addStyleClass("maxValue measure"));
		this.setAggregation("_minDimensionValue", new sap.m.Text()
				.addStyleClass("minValue dimension"));
		this.setAggregation("_maxDimensionValue", new sap.m.Text()
				.addStyleClass("maxValue dimension"));
		this.areaChart = new views.common.controls.tile.AreaChart();
		this.setAggregation("_areaChart", this.areaChart);
		//this.__bindAreaChartWithDummyData();
	},
	
	onAfterFinalEvaluation : function() {
		var t = this;
		var c = sap.smartbusiness.cache.getTrendChartData(t.getKpiCode(), t
				.getVariantId());
		;
		var a = this.getChipApi();
		if (this.DEFINITION_DATA.text) {
			this.setName(this.DEFINITION_DATA.text)
		} else {
			this.DEFINITION_DATA.text = this.getName()
		}
		if (this.EVALUATION_DATA.evaluationText) {
			this.setEvaluationText(this.EVALUATION_DATA.evaluationText);
			if (this.EVALUATION_DATA.unitOfMeasure) {
				this.setEvaluationText(this.getEvaluationText() + " ("
						+ this.EVALUATION_DATA.unitOfMeasure + ")")
			}
		} else {
			this.EVALUATION_DATA.evaluationText = this.getEvaluationText()
		}
		var u = this.DEFINITION_DATA.queryServiceURI;
		var e = this.DEFINITION_DATA.queryQualifiedResultEntitySetName;
		var d = this.getDimension() || this.EVALUATION_DATA.dimension;
		var m = this.getMeasure()
				|| this.DEFINITION_DATA.queryResultMeasurePropertyName;
		var s = this.EVALUATION_DATA.scaleFactor || null;
		var n = this.EVALUATION_DATA.numberOfDecimals || null;
		function _(b) {
			var f = b.results.length;
			var g = Number(b.results[0][m]);
			var M = sap.smartbusiness.util.formatValue(g, s, n);
			g = M.value + " " + M.unitPrefix;
			var h = Number(b.results[f - 1][m]);
			var o = sap.smartbusiness.util.formatValue(h, s, n);
			h = o.value + " " + o.unitPrefix;
			var i = sap.smartbusiness.util
					.formatOdataObjectToString(b.results[0][d]);
			var j = sap.smartbusiness.util
					.formatOdataObjectToString(b.results[f - 1][d]);
			var k = t.getAggregation("_areaChart");
			k.setData(b.results);
			t.setMinMeasureValue(g);
			t.setMaxMeasureValue(h);
			t.setMinDimensionValue(i);
			t.setMaxDimensionValue(j);
			k.setDimension(d);
			k.setMeasure(m);
			k.setImprovementDirection(t.DEFINITION_DATA.improvementDirection);
			k.setToleranceLow(t.EVALUATION_DATA.toleranceRangeLowValue);
			k.setDeviationLow(t.EVALUATION_DATA.deviationRangeLowValue);
			k.setToleranceHigh(t.EVALUATION_DATA.toleranceRangeHighValue);
			k.setDeviationHigh(t.EVALUATION_DATA.deviationRangeHighValue);
			setTimeout(function() {
				k.rerender()
			}, 0);
			t._removeBusyIndicator()
		}
		if (!c) {
			var q = sap.smartbusiness.util.prepareQueryServiceUri(
					(t.getChipApi().url.addSystemToServiceUrl(u)), e, m, d,
					this.VARIANT_DATA);
			if (q) {
				this.queryUriForTrendChart = q.uri;
				this.trendChartODataReadRef = q.model.read(q.uri, null, null, true,
						function(b) {
							t.queryUriResponseForTrendChart = b;
							sap.smartbusiness.cache.setTrendChartData(t
									.getKpiCode(), t.getVariantId(), b);
							_(b)
						}, function(b) {
							if (b && b.response) {
								jQuery.sap.log.error(b.message + " : "
										+ b.response.requestUri)
							}
							t._showErrorIndicator()
						})
			} else {
				this._showErrorIndicator()
			}
		} else {
			_(c)
		}
	},
	
	__bindAreaChartWithDummyData : function() {
		var t = this;
		this.areaChartAggregation = this.getAggregation("_areaChart");
		var a = {};
		a.data = [ {
			"RequestedDeliveryDate" : "1",
			"NetAmount_E" : 20
		}, {
			"RequestedDeliveryDate" : "3",
			"NetAmount_E" : 50
		}, {
			"RequestedDeliveryDate" : "5",
			"NetAmount_E" : 25
		}, {
			"RequestedDeliveryDate" : "7",
			"NetAmount_E" : 120
		}, {
			"RequestedDeliveryDate" : "9",
			"NetAmount_E" : 40
		}, {
			"RequestedDeliveryDate" : "11",
			"NetAmount_E" : 70
		}, {
			"RequestedDeliveryDate" : "13",
			"NetAmount_E" : 50
		} ];
		a.dimension = "RequestedDeliveryDate";
		a.measure = "NetAmount_E";
		a.deviationLow = 10;
		a.toleranceLow = 40;
		a.target = 60;
		a.toleranceHigh = 170;
		a.deviationHigh = 180;
		a.improvementDirection = "0";
		this.setMinMeasureValue(a.data[0][a.measure]);
		this.setMaxMeasureValue(a.data[(a.data).length - 1][a.measure]);
		this.setMinDimensionValue(a.data[0][a.dimension]);
		this.setMaxDimensionValue(a.data[(a.data).length - 1][a.dimension]);
		if (a.improvementDirection == "1") {
			this.getAggregation("_minMeasureValue").addStyleClass(
					"maximizingMeasureValues");
			this.getAggregation("_maxMeasureValue").addStyleClass(
					"maximizingMeasureValues")
		} else if (a.improvementDirection == "2") {
			this.getAggregation("_minMeasureValue").addStyleClass(
					"minimizingMeasureValues");
			this.getAggregation("_maxMeasureValue").addStyleClass(
					"minimizingMeasureValues")
		} else if (a.improvementDirection == "0") {
			this.getAggregation("_minMeasureValue").addStyleClass(
					"targetMeasureValues");
			this.getAggregation("_maxMeasureValue").addStyleClass(
					"targetMeasureValues")
		}
		this.areaChartAggregation.setDimension(a.dimension);
		this.areaChartAggregation.setMeasure(a.measure);
		this.areaChartAggregation.setImprovementDirection(a.improvementDirection);
		this.areaChartAggregation.setTarget(a.target);
		this.areaChartAggregation.setToleranceLow(a.toleranceLow);
		this.areaChartAggregation.setDeviationLow(a.deviationLow);
		this.areaChartAggregation.setToleranceHigh(a.toleranceHigh);
		this.areaChartAggregation.setDeviationHigh(a.deviationHigh);
		t.areaChartAggregation.setData(a.data);
		setTimeout(function() {
			t.areaChartAggregation.rerender()
		}, 0)
	},
	
	renderer: {
		renderContent : function(r, c) {
			if (sap.suite.ui.commons.LoadState.Loaded == c.getState() ) {
				r.write("<div");
				r.writeControlData(c);
				r.addClass("numericKpiTileContent");
				r.addClass(c.getSize());
				r.addClass("sapUiCockpitTrendKpiTile");
				r.writeClasses();
				r.write(">");
				r.write("<div class='measureChart'>");
				c._createTrendChart(r);
				r.write("<div class='numericKpiTileFooter'>");
				var unitOfMeasure = new sap.m.Text({text:c.getUnitOfMeasure()});
				unitOfMeasure.addStyleClass("fontGray");
				r.renderControl(unitOfMeasure);
				r.write("</div>");
				r.write("</div>");
				
				r.renderControl(c.getAggregation("_kpiBusyErrorIcon"));
				r.renderControl(c.getAggregation("_kpiErrorText"));
				if (c._errorFlag) {
					r.write("<div class='maskLayer'/>")
				}
				r.write("</div>")
			}
		}
	},
	_createTrendChart : function(r) {
		r.write("<div class='minMaxMeasureValueWrapper'>");
		r.renderControl(this.getAggregation("_minMeasureValue"));
		r.renderControl(this.getAggregation("_maxMeasureValue"));
		r.write("</div>");
		r.write("<div style='clear:both'/>");
		r.write("<div class='sapUiCockpitAreaChart'>");
		r.renderControl(this.getAggregation("_areaChart"));
		r.write("</div>");
		r.write("<div class='minMaxDimensionValueWrapper'>");
		r.renderControl(this.getAggregation("_minDimensionValue"));
		r.renderControl(this.getAggregation("_maxDimensionValue"));
		r.write("</div>")
		
	},
	
});


