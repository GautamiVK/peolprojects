/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("com.peol.utils.CalendarServices");
jQuery.sap.require("com.peol.utils.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
com.peol.utils.CalendarServices = (function() {
	"use strict";
	var c = {}, C = {}, a = null, s = null, o = new sap.ui.model.json.JSONModel(C);
	c.RequestID = "4711";
	c.ReqOrigin = "";
	c.StartDate = "1970-01-01T00:00:00";
	c.EndDate = "1970-01-01T00:00:00";
	return {
		checkLoadRequired : function(r, R) {
			var b = r.getTime(), d = R.getTime(), e = o.getData(), D = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
				pattern : "yyyy-MM-dd'T'HH:mm:ss"
			}), f = e[c.RequestID].range.StartDate, g = e[c.RequestID].range.EndDate, h = D.parse(f).getTime(), i = D.parse(g).getTime(), j = {};
			j.bLoadReq = false;
			j.bLoadBefore = false;
			j.StartDate = f;
			j.EndDate = g;
			if (!e[c.RequestID]) {
				return
			}
			if (b > h && d < i) {
				j.bLoadReq = false;
				j.bLoadBefore = false
			} else if (d > i) {
				j.bLoadReq = true;
				j.bLoadBefore = false
			} else if (b < h) {
				j.bLoadReq = true;
				j.bLoadBefore = true
			} else {
				j.bLoadReq = false;
				j.bLoadBefore = false
			}
			return j
		},
		getTimeframe : function(v, e) {
			var d = {}, S = new Date(), E = new Date(), D = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
				pattern : "yyyy-MM-dd'T'HH:mm:ss"
			}), b, m, f, g;
			d.StartDate = "1970-01-01T00:00:00";
			d.EndDate = "1970-01-01T00:00:00";
			if (v instanceof Date) {
				b = v
			} else if (typeof v === "string") {
				b = D.parse(v)
			} else {
				return
			}
			m = b.getTime();
			if (e === null) {
				m = b.getTime();
				f = m - (7 * 24 * 60 * 60 * 1000);
				g = m + (21 * 24 * 60 * 60 * 1000);
				S.setTime(f);
				E.setTime(g);
				d.StartDate = D.format(S, false);
				d.EndDate = D.format(E, false)
			} else if (e === false) {
				d.StartDate = v;
				m = b.getTime();
				g = m + (14 * 24 * 60 * 60 * 1000);
				E.setTime(g);
				d.EndDate = D.format(E, false)
			} else if (e === true) {
				d.EndDate = v;
				m = b.getTime();
				f = m - (14 * 24 * 60 * 60 * 1000);
				S.setTime(f);
				d.StartDate = D.format(S, false)
			}
			return d
		},
		readCalData : function(r, d, e, O) {
			var b, t, f, g, h, j, k, R;
			var l = null;
			if (e === null) {
				c.RequestID = r;
				c.ReqOrigin = O;
				t = this.getTimeframe(d, null);
				c.RequestID = r;
				c.StartDate = t.StartDate;
				c.EndDate = t.EndDate;
				f = o.getData();
				if (!f[c.RequestID]) {
					g = c.ReqOrigin ? "',SAP__Origin='" + c.ReqOrigin : "";
					b = "/TeamCalendarHeaderCollection(StartDate=datetime'" + c.StartDate + "',EndDate=datetime'" + c.EndDate + "',RequestID='" + c.RequestID + g + "',FilterLeaves=false,SessionID='" + SESSION_ID + "')";
					if (a) {
						a.read(b, undefined, [ "$expand=TeamCalendar" ], false, function(D) {
							l = D
						})
					}
					h = o.getData();
					h[c.RequestID] = {};
					h[c.RequestID].range = {};
					h[c.RequestID].range.StartDate = c.StartDate;
					h[c.RequestID].range.EndDate = c.EndDate;
					h[c.RequestID].events = [];
					if (l) {
						j = l.TeamCalendar.results;
						h[c.RequestID].events = j;
						o.setData(h)
					} else {
						return
					}
				}
			} else {
				k = o.getData();
				if (k[c.RequestID]) {
					if (e) {
						R = k[c.RequestID].range.StartDate;
						t = this.getTimeframe(R, e);
						k[c.RequestID].range.StartDate = t.StartDate
					} else {
						R = k[c.RequestID].range.EndDate;
						t = this.getTimeframe(R, e);
						k[c.RequestID].range.EndDate = t.EndDate
					}
					c.StartDate = t.StartDate;
					c.EndDate = t.EndDate
				}
				g = c.ReqOrigin ? "',SAP__Origin='" + c.ReqOrigin : "";
				b = "/TeamCalendarHeaderCollection(StartDate=datetime'" + c.StartDate + "',EndDate=datetime'" + c.EndDate + "',RequestID='" + c.RequestID + g + "',FilterLeaves=false)";
				if (a) {
					a.read(b, undefined, [ "$expand=TeamCalendar" ], false, function(D) {
						l = D
					})
				}
				if (l) {
					j = l.TeamCalendar.results;
					for (var i = 0; i < j.length; i++) {
						k[c.RequestID].events.push(j[i])
					}
					o.setData(k)
				} else {
					return
				}
			}
		},
		setAppModel : function(m) {
			if (m) {
				a = m
			}
		},
		getAppModel : function() {
			return a
		},
		getLeadRequestID : function() {
			return c.RequestID
		},
		getCalModel : function() {
			return o
		},
		clearCalData : function() {
			var i = {};
			o.setData(i)
		},
		setCalStartDate : function(d) {
			var D = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
				pattern : "yyyy-MM-dd'T'HH:mm:ss"
			});
			s = D.format(d, false)
		},
		getCalStartDate : function() {
			return s
		},
		setDateType : function(v) {
			var d = null;
			var D = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
				pattern : "yyyy-MM-dd'T'HH:mm:ss"
			});
			if (v instanceof Date) {
				d = com.peol.utils.Conversions.revertTimezoneOffset(v)
			} else if (typeof v === "string") {
				d = D.parse(v)
			}
			return d
		}
	}
}());
