jQuery.sap.declare("views.common.controls.tile.area");
(function(M, V) {
	function a() {
		var t, g, l, n, o, p, q, r;
		var s, u, v = undefined, z = undefined, A = d3.scale.category20()
				.range(), B = {};
		function f(D) {
			function E(d) {
				var k = [], m, i, j;
				for (i = -1; ++i < d.length;) {
					m = {
						dimension : d[i].col.val,
						data : []
					};
					for (j = -1; ++j < d[i].rows.length;)
						m.data.push(d[i].rows[j].val);
					k.push(m)
				}
				return k
			}
			function F(d) {
				var c1 = [], d1, e1, f1, m, i, j, k;
				for (k = -1; ++k < d.length;) {
					m = d[k];
					d1 = {
						measure : m.col,
						data : []
					};
					f1 = d1.data;
					for ( var i = 0; i < m.rows.length; i++) {
						f1[i] = [];
						for ( var j = 0; j < m.rows[i].length; j++) {
							f1[i].push(m.rows[i][j].val)
						}
					}
					c1.push(d1)
				}
				return c1
			}
			var G = s.getAnalysisAxisDataByIdx(0).values, H = s
					.getAnalysisAxisDataByIdx(1) ? s
					.getAnalysisAxisDataByIdx(1).values : undefined, I = s
					.getMeasureValuesGroupDataByIdx(0).values, b = E(G), J = H ? E(H)
					: undefined, c = F(I);
			u = [];
			var K = b[0].dimension, L = c[0].measure;
			b[0]["data"].forEach(function(d, i) {
				var j = {};
				j[K] = d + "";
				j[L] = c[0]['data'][0][i] + "";
				u.push(j)
			});
			var N = "chartdef_" + new Date().getTime();
			if (!(K && L && u && l)) {
				return
			} else {
				var O;
				var P = [];
				for ( var i = 0; i < u.length; i++) {
					P[i] = parseFloat(u[i][L])
				}
				var Q = Math.min.apply(Math, P);
				if (l == "0") {
					if (Q < parseFloat(n)) {
						O = Q
					} else {
						O = parseFloat(n)
					}
				} else if (l == "1") {
					if (Q < parseFloat(n)) {
						O = Q
					} else {
						O = parseFloat(n)
					}
				} else if (l == "2") {
					if (Q < parseFloat(q)) {
						O = Q
					} else {
						O = parseFloat(q)
					}
				}
				if (O < 0) {
					for ( var i = 0; i < u.length; i++) {
						u[i][L] = P[i] + (-O) + ""
					}
					if (l == "0") {
						n = parseFloat(n) + (-O) + "";
						o = parseFloat(o) + (-O) + "";
						q = parseFloat(q) + (-O) + "";
						p = parseFloat(p) + (-O) + ""
					} else if (l == "1") {
						n = parseFloat(n) + (-O) + "";
						o = parseFloat(o) + (-O) + ""
					} else if (l == "2") {
						q = parseFloat(q) + (-O) + "";
						p = parseFloat(p) + (-O) + ""
					}
				}
				var R = {
					top : 0,
					right : 0,
					bottom : 0,
					left : 0
				}, S = [], i;
				var w = t - R.left - R.right, h = g - R.top - R.bottom;
				for (i = 0; i < u.length; i++) {
					S.push(u[i][K])
				}
				var T = d3.extent(d3.merge(u), function(d) {
					return parseInt(d[L])
				});
				var U = d3.extent(d3.merge(u), function(d) {
					return d[K]
				});
				var x = d3.scale.ordinal().domain(S).rangePoints([ R.left, w ]);
				var y = d3.scale.linear().domain([ 0, T[1] ]).range([ h, 0 ]);
				var W = D.attr("class", "areaChartSvg");
				var X = d3.max(u, function(d) {
					return parseInt(d[L])
				});
				if (l === "1") {
					if (!(n || o)) {
						var Y = new d3.svg.line().x(function(d) {
							return x(d[K])
						}).y(function(d) {
							return y(d[L])
						});
						W.append("path").datum(u).attr("fill", "none").attr(
								"d", Y).attr("stroke", "rgb(95,119,140)").attr(
								"stroke-width", "2px").attr("width", w);
						W.append("line").attr("clip-path", "url(#clip)").attr(
								"x1", R.left).attr("y1",
								(h - parseInt((h / (X)) * (r))) - 1).attr("x2",
								w).attr("y2",
								(h - parseInt((h / (X)) * (r))) - 1).attr(
								"stroke", "#ffffff")
								.attr("stroke-width", "1px");
						W.append("line").attr("clip-path", "url(#clip)").attr(
								"x1", R.left).attr("y1",
								h - parseInt((h / (X)) * (r))).attr("x2", w)
								.attr("y2", h - parseInt((h / (X)) * (r)))
								.attr("stroke", "#5f778c").attr("stroke-width",
										"2px");
						W.append("line").attr("clip-path", "url(#clip)").attr(
								"x1", R.left).attr("y1",
								(h - parseInt((h / (X)) * (r))) + 1).attr("x2",
								w).attr("y2",
								(h - parseInt((h / (X)) * (r))) + 1).attr(
								"stroke", "#ffffff")
								.attr("stroke-width", "1px")
					} else {
						if (parseInt(X) < parseInt(n)) {
							var Z = ((X) / n);
							var $ = ((((h / X) * n) / h) * 100);
							var _ = ((((h / X) * o) / h) * 100);
							$ = $ + "%";
							_ = _ + "%";
							var Y = new d3.svg.line().x(function(d) {
								return x(d[K])
							}).y(function(d) {
								return y(d[L] * Z)
							});
							W.append("linearGradient").attr("id",
									"area-gradient" + N).attr("gradientUnits",
									"userSpaceOnUse").attr("x1", 0).attr("y1",
									y(0)).attr("x2", 0).attr("y2", y(X))
									.selectAll("stop").data([ {
										offset : "0%",
										color : "#cc1919"
									}, {
										offset : $,
										color : "#cc1919"
									}, {
										offset : $,
										color : "#d14900"
									}, {
										offset : _,
										color : "#d14900"
									}, {
										offset : _,
										color : "#007833"
									}, {
										offset : "100%",
										color : "#007833"
									} ]).enter().append("stop").attr("offset",
											function(d) {
												return d.offset
											}).attr("stop-color", function(d) {
										return d.color
									}).attr("stroke", function(d) {
										return d.line
									});
							W.append("path").datum(u).attr("fill", "none")
									.attr("d", Y).attr("stroke",
											"url(#area-gradient" + N + ")")
									.attr("stroke-width", "2px").attr("width",
											w);
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 1).attr(
											"x2", w).attr("y2", 1).attr(
											"stroke", "rgb(234,229,215)").attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 2).attr(
											"x2", w).attr("y2", 2).attr(
											"stroke", "rgb(69,69,69)").attr(
											"stroke-width", "2px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 4).attr(
											"x2", w).attr("y2", 4).attr(
											"stroke", "rgb(234,229,215)").attr(
											"stroke-width", "1px")
						} else {
							var $ = (((h / X) * n) / h) * 100;
							var _ = (((h / X) * o) / h) * 100;
							$ = $ + "%";
							_ = _ + "%";
							var Y = new d3.svg.line().x(function(d) {
								return x(d[K])
							}).y(function(d) {
								return y(d[L])
							});
							W.append("linearGradient").attr("id",
									"area-gradient" + N).attr("gradientUnits",
									"userSpaceOnUse").attr("x1", 0).attr("y1",
									y(0)).attr("x2", 0).attr("y2", y(X))
									.selectAll("stop").data([ {
										offset : "0%",
										color : "#cc1919"
									}, {
										offset : $,
										color : "#cc1919"
									}, {
										offset : $,
										color : "#d14900"
									}, {
										offset : _,
										color : "#d14900"
									}, {
										offset : _,
										color : "#007833"
									}, {
										offset : "100%",
										color : "#007833"
									} ]).enter().append("stop").attr("offset",
											function(d) {
												return d.offset
											}).attr("stop-color", function(d) {
										return d.color
									}).attr("stroke", function(d) {
										return d.line
									});
							W.append("path").datum(u).attr("fill", "none")
									.attr("d", Y).attr("stroke",
											"url(#area-gradient" + N + ")")
									.attr("stroke-width", "2px").attr("width",
											w);
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (o)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (o)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("1,2")).attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (n)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (n)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("5,2")).attr(
											"stroke-width", "1px");
							W
									.append("line")
									.attr("clip-path", "url(#clip)")
									.attr("x1", R.left)
									.attr("y1",
											(h - parseInt((h / (X)) * (r))) - 1)
									.attr("x2", w)
									.attr("y2",
											(h - parseInt((h / (X)) * (r))) - 1)
									.attr("stroke", "#ffffff").attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (r)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (r)))
									.attr("stroke", "#5f778c").attr(
											"stroke-width", "2px");
							W
									.append("line")
									.attr("clip-path", "url(#clip)")
									.attr("x1", R.left)
									.attr("y1",
											(h - parseInt((h / (X)) * (r))) + 1)
									.attr("x2", w)
									.attr("y2",
											(h - parseInt((h / (X)) * (r))) + 1)
									.attr("stroke", "#ffffff").attr(
											"stroke-width", "1px")
						}
					}
				} else if (l == "2") {
					if (!(q || p)) {
						var Y = new d3.svg.line().x(function(d) {
							return x(d[K])
						}).y(function(d) {
							return y(d[(L)])
						});
						W.append("path").datum(u).attr("fill", "none").attr(
								"d", Y).attr("stroke", "rgb(95,119,140)").attr(
								"stroke-width", "2px").attr("width", w);
						W.append("line").attr("clip-path", "url(#clip)").attr(
								"x1", R.left).attr("y1",
								(h - parseInt((h / (X)) * (r))) - 1).attr("x2",
								w).attr("y2",
								(h - parseInt((h / (X)) * (r))) - 1).attr(
								"stroke", "#ffffff")
								.attr("stroke-width", "1px");
						W.append("line").attr("clip-path", "url(#clip)").attr(
								"x1", R.left).attr("y1",
								h - parseInt((h / (X)) * (r))).attr("x2", w)
								.attr("y2", h - parseInt((h / (X)) * (r)))
								.attr("stroke", "#5f778c").attr("stroke-width",
										"2px");
						W.append("line").attr("clip-path", "url(#clip)").attr(
								"x1", R.left).attr("y1",
								(h - parseInt((h / (X)) * (r))) + 1).attr("x2",
								w).attr("y2",
								(h - parseInt((h / (X)) * (r))) + 1).attr(
								"stroke", "#ffffff")
								.attr("stroke-width", "1px")
					} else {
						if (parseInt(X) < parseInt(q)) {
							var Z = ((X) / q);
							var $ = ((((h / X) * p) / h) * 100);
							var _ = ((((h / X) * q) / h) * 100);
							$ = $ + "%";
							_ = _ + "%";
							var Y = new d3.svg.line().x(function(d) {
								return x(d[K])
							}).y(function(d) {
								return y(d[(L)] * Z)
							});
							W.append("linearGradient").attr("id",
									"area-gradient" + N).attr("gradientUnits",
									"userSpaceOnUse").attr("x1", 0).attr("y1",
									y(0)).attr("x2", 0).attr("y2", y(X))
									.selectAll("stop").data([ {
										offset : "0%",
										color : "#007833"
									}, {
										offset : $,
										color : "#007833"
									}, {
										offset : $,
										color : "#d14900"
									}, {
										offset : _,
										color : "#d14900"
									}, {
										offset : _,
										color : "#cc1919"
									}, {
										offset : "100%",
										color : "#cc1919"
									} ]).enter().append("stop").attr("offset",
											function(d) {
												return d.offset
											}).attr("stop-color", function(d) {
										return d.color
									}).attr("stroke", function(d) {
										return d.line
									});
							W.append("path").datum(u).attr("fill", "none")
									.attr("d", Y).attr("stroke",
											"url(#area-gradient" + N + ")")
									.attr("stroke-width", "2px").attr("width",
											w);
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 1).attr(
											"x2", w).attr("y2", 1).attr(
											"stroke", "rgb(234,229,215)").attr(
											"stroke-dasharray", ("5,8")).attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 2).attr(
											"x2", w).attr("y2", 2).attr(
											"stroke", "rgb(69,69,69)").attr(
											"stroke-dasharray", ("8,5")).attr(
											"stroke-width", "2px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 4).attr(
											"x2", w).attr("y2", 4).attr(
											"stroke", "rgb(234,229,215)").attr(
											"stroke-dasharray", ("8,5")).attr(
											"stroke-width", "1px")
						} else {
							var $ = (((h / X) * p) / h) * 100;
							var _ = (((h / X) * q) / h) * 100;
							$ = $ + "%";
							_ = _ + "%";
							var Y = new d3.svg.line().x(function(d) {
								return x(d[K])
							}).y(function(d) {
								return y(d[(L)])
							});
							W.append("linearGradient").attr("id",
									"area-gradient" + N).attr("gradientUnits",
									"userSpaceOnUse").attr("x1", 0).attr("y1",
									y(0)).attr("x2", 0).attr("y2", y(X))
									.selectAll("stop").data([ {
										offset : "0%",
										color : "#007833"
									}, {
										offset : $,
										color : "#007833"
									}, {
										offset : $,
										color : "#d14900"
									}, {
										offset : _,
										color : "#d14900"
									}, {
										offset : _,
										color : "#cc1919"
									}, {
										offset : "100%",
										color : "#cc1919"
									} ]).enter().append("stop").attr("offset",
											function(d) {
												return d.offset
											}).attr("stop-color", function(d) {
										return d.color
									}).attr("stroke", function(d) {
										return d.line
									});
							W.append("path").datum(u).attr("fill", "none")
									.attr("d", Y).attr("stroke",
											"url(#area-gradient" + N + ")")
									.attr("stroke-width", "2px").attr("width",
											w);
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (p)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (p)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("1,2")).attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (q)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (q)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("5,2")).attr(
											"stroke-width", "1px");
							W
									.append("line")
									.attr("clip-path", "url(#clip)")
									.attr("x1", R.left)
									.attr("y1",
											(h - parseInt((h / (X)) * (r))) - 1)
									.attr("x2", w)
									.attr("y2",
											(h - parseInt((h / (X)) * (r))) - 1)
									.attr("stroke", "#ffffff").attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (r)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (r)))
									.attr("stroke", "#5f778c").attr(
											"stroke-width", "2px");
							W
									.append("line")
									.attr("clip-path", "url(#clip)")
									.attr("x1", R.left)
									.attr("y1",
											(h - parseInt((h / (X)) * (r))) + 1)
									.attr("x2", w)
									.attr("y2",
											(h - parseInt((h / (X)) * (r))) + 1)
									.attr("stroke", "#ffffff").attr(
											"stroke-width", "1px")
						}
					}
				} else if (l == "0") {
					if (!(n || o || q || p)) {
						var Y = new d3.svg.line().x(function(d) {
							return x(d[K])
						}).y(function(d) {
							return y(d[(L)])
						});
						W.append("path").datum(u).attr("fill", "none").attr(
								"d", Y).attr("stroke", "rgb(95,119,140)").attr(
								"stroke-width", "2px").attr("width", w)
					} else {
						if (parseInt(X) < parseInt(n)) {
							var Z = ((X) / n);
							var $ = ((((h / X) * n) / h) * 100);
							var _ = ((((h / X) * o) / h) * 100);
							var a1 = ((((h / X) * p) / h) * 100);
							var b1 = ((((h / X) * q) / h) * 100);
							$ = $ + "%";
							_ = _ + "%";
							a1 = a1 + "%";
							b1 = b1 + "%";
							var Y = new d3.svg.line().x(function(d) {
								return x(d[K])
							}).y(function(d) {
								return y(d[(L)] * Z)
							});
							W.append("linearGradient").attr("id",
									"area-gradient" + N).attr("gradientUnits",
									"userSpaceOnUse").attr("x1", 0).attr("y1",
									y(0)).attr("x2", 0).attr("y2", y(X))
									.selectAll("stop").data([ {
										offset : "0%",
										color : "#cc1919"
									}, {
										offset : $,
										color : "#cc1919"
									}, {
										offset : $,
										color : "#d14900"
									}, {
										offset : _,
										color : "#d14900"
									}, {
										offset : _,
										color : "#007833"
									}, {
										offset : a1,
										color : "#007833"
									}, {
										offset : a1,
										color : "#d14900"
									}, {
										offset : b1,
										color : "#d14900"
									}, {
										offset : b1,
										color : "#cc1919"
									}, {
										offset : "100%",
										color : "#cc1919"
									} ]).enter().append("stop").attr("offset",
											function(d) {
												return d.offset
											}).attr("stop-color", function(d) {
										return d.color
									}).attr("stroke", function(d) {
										return d.line
									});
							W.append("path").datum(u).attr("fill", "none")
									.attr("d", Y).attr("stroke",
											"url(#area-gradient" + N + ")")
									.attr("stroke-width", "1px").attr("width",
											w);
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 1).attr(
											"x2", w).attr("y2", 1).attr(
											"stroke", "rgb(234,229,215)").attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 2).attr(
											"x2", w).attr("y2", 2).attr(
											"stroke", "rgb(69,69,69)").attr(
											"stroke-width", "2px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1", 4).attr(
											"x2", w).attr("y2", 4).attr(
											"stroke", "rgb(234,229,215)").attr(
											"stroke-width", "1px")
						} else {
							var $ = ((((h / X) * n) / h) * 100);
							var _ = ((((h / X) * o) / h) * 100);
							var a1 = ((((h / X) * p) / h) * 100);
							var b1 = ((((h / X) * q) / h) * 100);
							$ = $ + "%";
							_ = _ + "%";
							a1 = a1 + "%";
							b1 = b1 + "%";
							var Y = new d3.svg.line().x(function(d) {
								return x(d[K])
							}).y(function(d) {
								return y(d[(L)])
							});
							W.append("linearGradient").attr("id",
									"area-gradient" + N).attr("gradientUnits",
									"userSpaceOnUse").attr("x1", 0).attr("y1",
									y(0)).attr("x2", 0).attr("y2", y(X))
									.selectAll("stop").data([ {
										offset : "0%",
										color : "#cc1919"
									}, {
										offset : $,
										color : "#cc1919"
									}, {
										offset : $,
										color : "#d14900"
									}, {
										offset : _,
										color : "#d14900"
									}, {
										offset : _,
										color : "#007833"
									}, {
										offset : a1,
										color : "#007833"
									}, {
										offset : a1,
										color : "#d14900"
									}, {
										offset : b1,
										color : "#d14900"
									}, {
										offset : b1,
										color : "#cc1919"
									}, {
										offset : "100%",
										color : "#cc1919"
									} ]).enter().append("stop").attr("offset",
											function(d) {
												return d.offset
											}).attr("stop-color", function(d) {
										return d.color
									}).attr("stroke", function(d) {
										return d.line
									});
							W.append("path").datum(u).attr("fill", "none")
									.attr("d", Y).attr("stroke",
											"url(#area-gradient" + N + ")")
									.attr("stroke-width", "2px").attr("width",
											w);
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (o)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (o)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("1,2")).attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (n)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (n)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("5,2")).attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (q)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (q)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("5,2")).attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (p)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (p)))
									.attr("stroke", "#666666").attr(
											"stroke-dasharray", ("1,2")).attr(
											"stroke-width", "1px");
							W
									.append("line")
									.attr("clip-path", "url(#clip)")
									.attr("x1", R.left)
									.attr("y1",
											(h - parseInt((h / (X)) * (r))) - 1)
									.attr("x2", w)
									.attr("y2",
											(h - parseInt((h / (X)) * (r))) - 1)
									.attr("stroke", "#ffffff").attr(
											"stroke-width", "1px");
							W.append("line").attr("clip-path", "url(#clip)")
									.attr("x1", R.left).attr("y1",
											h - parseInt((h / (X)) * (r)))
									.attr("x2", w).attr("y2",
											h - parseInt((h / (X)) * (r)))
									.attr("stroke", "#5f778c").attr(
											"stroke-width", "2px");
							W
									.append("line")
									.attr("clip-path", "url(#clip)")
									.attr("x1", R.left)
									.attr("y1",
											(h - parseInt((h / (X)) * (r))) + 1)
									.attr("x2", w)
									.attr("y2",
											(h - parseInt((h / (X)) * (r))) + 1)
									.attr("stroke", "#ffffff").attr(
											"stroke-width", "1px")
						}
					}
				}
			}
			return f
		}
		f.width = function(d) {
			if (!arguments.length) {
				return v
			}
			v = d;
			return f
		};
		f.height = function(d) {
			if (!arguments.length) {
				return z
			}
			z = d;
			return f
		};
		f.data = function(d) {
			if (!arguments.length) {
				return u
			}
			s = d;
			return f
		};
		f.getPreferredSize = function() {
		};
		f.properties = function(d) {
			if (!arguments.length) {
				return B
			}
			jQuery.extend(B, d);
			C();
			return f
		};
		f.colorPalette = function(_) {
			if (!arguments.length) {
				return A
			}
			A = _;
			return this
		};
		return f;
		function C() {
			t = B.tileWidth;
			g = B.tileHeight;
			l = B.improvementDirection;
			n = B.deviationLow;
			o = B.toleranceLow;
			r = B.target;
			p = B.toleranceHigh;
			q = B.deviationHigh
		}
	}
	var b = {
		"id" : "viz.ext.feed.DS1",
		"name" : "RequestedDeliveryDate",
		"type" : "Dimension",
		"min" : 1,
		"max" : 1,
		"aaIndex" : 1
	};
	var c = {
		"id" : "viz.ext.feed.MS",
		"name" : "NetAmount_E",
		"type" : "Measure",
		"min" : 1,
		"max" : 1,
		"mgIndex" : 1
	};
	var e = {
		"id" : "viz.ext.module.area",
		"name" : "Hello World Module",
		"feeds" : [ b, c ],
		"fn" : a
	};
	M.register(e);
	var f = {
		"id" : "viz/ext/area",
		"name" : "area ext",
		"legacyDataAdapter" : true,
		"modules" : {
			"root" : {
				"id" : "sap.viz.modules.rootContainer",
				"configure" : {
					"propertyCategory" : "general"
				},
				"modules" : {
					"layout" : {
						"id" : "sap.viz.modules.layout.dock"
					},
					"main" : {
						"id" : "sap.viz.modules.xycontainer",
						"modules" : {
							"plot" : {
								"id" : "viz.ext.module.area",
								"configure" : {
									"propertyCategory" : "area"
								}
							}
						},
						"configure" : {
							"properties" : {
								"layout" : {
									"position" : "center",
									"priority" : 5
								}
							}
						}
					}
				}
			}
		},
		"dependencies" : {
			"attributes" : [],
			"events" : []
		}
	};
	V.register(f)
})(sap.viz.extapi.manifest.Module, sap.viz.extapi.manifest.Viz);
