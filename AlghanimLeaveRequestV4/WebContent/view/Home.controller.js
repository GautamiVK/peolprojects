/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("com.peol.utils.SessionManager");
jQuery.sap.require("com.peol.util.Formatters");
sap.ui.controller("com.peol.view.Home", {
	onInit : function() {
		this.getView().addEventDelegate({
			onBeforeShow : jQuery.proxy(function(evt) {
				this.onBeforeShow(evt);

			}, this)
		});
		_that = this;
		var langBtn = this.getView().byId("langBtn");
		this.applicationURL = window.location.href;
		var languagePattern = new RegExp("sap-language=(..)");
		var languageCode = languagePattern.exec(this.applicationURL);
		langBtn.setText("Arabic");
                this.languageCode = "EN";
		if (languageCode) {
			if (languageCode[1] == "AR") {
				langBtn.setText("English");
	                        this.languageCode = "AR";
			} else {
				langBtn.setText("Arabic");
			}
		}
		// get the model
		this.oModel = sap.ui.getCore().getModel("logInModel");
		
		//create Base64 object
		Base64 = {
			_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			encode: function(e) {
				var t = "";
			    var n, r, i, s, o, u, a;
			    var f = 0;
			    e = Base64._utf8_encode(e);
			    while (f < e.length) {
			    	n = e.charCodeAt(f++);
			        r = e.charCodeAt(f++);
			        i = e.charCodeAt(f++);
			        s = n >> 2;
			        o = (n & 3) << 4 | r >> 4;
			        u = (r & 15) << 2 | i >> 6;
			        a = i & 63;
			        if (isNaN(r)) {
			        	u = a = 64;
			        } else if (isNaN(i)) {
			            a = 64;
			        }
			        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
			    }
			    t.replace('=', "%3D");
			    return t;
			},
			_utf8_encode: function(e) {
			    e = e.replace(/\r\n/g, "\n");
			    var t = "";
			    for (var n = 0; n < e.length; n++) {
			    	var r = e.charCodeAt(n);
			        if (r < 128) {
			            t += String.fromCharCode(r);
			        } else if (r > 127 && r < 2048) {
			            t += String.fromCharCode(r >> 6 | 192);
			            t += String.fromCharCode(r & 63 | 128);
			        } else {
			            t += String.fromCharCode(r >> 12 | 224);
			            t += String.fromCharCode(r >> 6 & 63 | 128);
			            t += String.fromCharCode(r & 63 | 128);
			        }
			    }
			    return t;
			}
		};
	},
	
	resourceBundle : {
		getText : function(key,array) {
			return sap.ui.getCore().getModel("i18n").getResourceBundle().getText(key,array);
		}
	},
	handleLogin : function() {
		var username = this.getView().byId("uname");
		var password = this.getView().byId("password");
		var pfNature = this.getView().byId("pfNature");
		var civilId = this.getView().byId("civilId");
		var dob = this.getView().byId("dob");
		var radioAd = this.getView().byId("ad");
		var isADValidated = true;
		var isCivilValidated = true;
		var _that = this;

		if (radioAd.getSelected() == true) {
			if (username.getValue() == "") {
				username.setValueState("Error");
				username.focus();
				isADValidated = false;
			} else if (password.getValue() == "") {
				username.setValueState("Success");
				password.setValueState("Error");
				password.focus();
				isADValidated = false;
			}
		} else {
			if (pfNature.getValue() == "") {
				pfNature.setValueState("Error");
				pfNature.focus();
				isCivilValidated = false;
			} else if (civilId.getValue() == "") {
				civilId.setValueState("Error");
				pfNature.setValueState("Success");
				civilId.focus();
				isCivilValidated = false;
			} else if (dob.getValue() == "") {
				dob.setValueState("Error");
				civilId.setValueState("Success");
				pfNature.setValueState("Success");
				dob.focus();
				isCivilValidated = false;
			}
		}

		if (isADValidated && isCivilValidated) {
			// Check the login credentials
			if (!radioAd.getSelected() == true) {
				this.oModel.read("/Civil_IdSet(PfNature='" + pfNature.getValue() + "',CivilId='" + civilId.getValue() + "',Dob=datetime'"+com.peol.util.Formatters.DATE_YYYYMMdd(new Date(dob.getDateValue())) + "T00:00:00"+"',Ename='" + this.languageCode + "')", null, null, true, function(oData, oResponse) {
					// Get alluser details
					var status = oData.Success;
					var logInDetails = {
							empId : oData.Pernr,
							countryCode : oData.CountryCode,
							Ename: oData.Ename,
							isManager : oData.IsManager,
							SessionID : oData.SessionID
					};
					EMPLOYEE_ID = logInDetails.empId;
					SESSION_ID = logInDetails.SessionID;
					var logInDataModel = new sap.ui.model.json.JSONModel(logInDetails);
					// set employee details in core
					sap.ui.getCore().setModel(logInDataModel, "logInDataModel");
					if(oData.ADID){
						sap.m.MessageToast.show(_that.resourceBundle.getText("ADIDEXIST"));
						return;
					}
					if (status == "VALID") {
						com.peol.utils.SessionManager.createSession();
						var router = sap.ui.core.UIComponent.getRouterFor(_that);
						router.navTo("Tile", null, false);
					} else {
						sap.m.MessageToast.show(_that.resourceBundle.getText("INVALID_CREDENTIALS"));
						password.setValue("");
					}
				}, function() {
					sap.m.MessageToast.show(_that.resourceBundle.getText("INVALID_CREDENTIALS"));
					password.setValue("");
				});
			}
			else{

				username = encodeURIComponent(Base64.encode(username.getValue()));
				password = encodeURIComponent(Base64.encode(password.getValue()));
				
				this.oModel.read("/Ad_IdSet(Username='" + username + "',Password='" + password + "',Ename='" + this.languageCode + "')", null, null, true, function(oData, oResponse) {
					// Get alluser details
					var activeState = oData.Inactive;

					if(activeState == true)
					{
						sap.m.MessageToast.show(_that.resourceBundle.getText("INACTIVE_CREDENTIALS"));
						password.setValue("");
					}
					else{
						// Get alluser details
						var status = oData.Success;

						var logInDetails = {
								empId : oData.Pernr,
								countryCode : oData.CountryCode,
								Ename: oData.Ename,
								isManager : oData.IsManager,
								SessionID : oData.SessionID
						};
						EMPLOYEE_ID = logInDetails.empId;
						SESSION_ID = logInDetails.SessionID;
						var logInDataModel = new sap.ui.model.json.JSONModel(logInDetails);
						// set employee details in core
						sap.ui.getCore().setModel(logInDataModel, "logInDataModel");
						if (status == "VALID") {
							com.peol.utils.SessionManager.createSession();
							var router = sap.ui.core.UIComponent.getRouterFor(_that);
							router.navTo("Tile", null, false);
						} else {
							sap.m.MessageToast.show(_that.resourceBundle.getText("INVALID_CREDENTIALS"));
							password.setValue("");
						}
					}//activestate else close
				},function() {
					sap.m.MessageToast.show(_that.resourceBundle.getText("INVALID_CREDENTIALS"));
					password.setValue("");
				} );	

			}
		}
	},
	changeLanguage : function() {
		var langBtn = this.getView().byId("langBtn");
		var url = window.location.href;
		var absoluteURL = url.split("?");
		if (langBtn.getText() == "Arabic") {
			window.location.href = absoluteURL[0] + "?sap-language=AR";
		} else {
			window.location.href = absoluteURL[0] + "?sap-language=en_US";
		}
	},
	changeSelect1 : function(oEvent) {
		var evtSource = oEvent.getSource();
		var selected = evtSource.getSelected();
		var adPanel = this.getView().byId("adPanel");
		var civilPanel = this.getView().byId("civilPanel");

		if (selected) {
			adPanel.setVisible(true);
			civilPanel.setVisible(false);
		}
	},
	changeSelect2 : function(oEvent) {
		var evtSource = oEvent.getSource();
		var selected = evtSource.getSelected();
		var adPanel = this.getView().byId("adPanel");
		var civilPanel = this.getView().byId("civilPanel");
		if (selected) {
			adPanel.setVisible(false);
			civilPanel.setVisible(true);
		}
	},
	onBeforeShow : function() {
		com.peol.utils.SessionManager.init(_that).ifAlreadyLoggedIn();
	},

	onAfterRendering : function() {
		
		
	},
});