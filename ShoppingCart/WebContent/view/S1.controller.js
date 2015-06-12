jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("com.sap.shoppingcart.view.S1", {
	
	//-------------------fragments for login & register
	
	_fragments: {},

    _getFormFragment: function (sName) {
	    if (!this._fragments[sName]) {
	      this._fragments[sName] = sap.ui.xmlfragment("com.sap.shoppingcart.view." + sName, this.getView().getController());
	    }
	    return this._fragments[sName];
	  },

	  onExit : function () {
	    jQuery.each(this._fragments, function (i, oFrag) {
	      oFrag.destroy();
	    });
	  },
	  
   onInit : function() {
	   that = this;
       core = sap.ui.getCore();
       
       //----- show login fragment at first
       var oForm = this._getFormFragment("Login");
       this.getView().byId("idLoginPageContainer").insertContent(oForm);
       
       //----- set i18n model for app
       var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/i18n.properties"
		});
	   sap.ui.getCore().setModel(i18nModel, "i18n");
       
	 } ,
    
    _handleLogin :function(evt){
    	
		var emailComp = sap.ui.getCore().byId("login_email");
		var loginComp = sap.ui.getCore().byId("login_btn") ;
		var emailVal  = emailComp.getValue();
		if(emailVal.length > 0){
		     	var oModel = this.getView().getModel();
				var resEmail = "" ,  res = 0 ;
				
				//----- validate email entered 
				oModel.read("ES_CUSTOMERS('"+emailVal+"')?format=json", null, null, false, function(response) {
					   res = 0 ;
					   res = response ;
					   resEmail = response.EMAIL;
					  });
					   m = new sap.ui.model.json.JSONModel({ "User" : res
					  });
					   
			    //----- set the user details for core
				core.setModel(m,"User");
				
					if(resEmail.length!=0){
						 sap.m.MessageToast.show("Login Successful");
						 that.oRouter.navTo("dashboard",{},true);
					}
					else{
						sap.m.MessageToast.show("Login failed. Please Register again - modified");
					}
					
				}else{
					emailVal.setValueState("Error");
					emailVal.focus();
				}
	},
	
	_handleRegistration : function(evt){
		//----- get all the registration values
		var fnameComp = sap.ui.getCore().byId("register_fname").getValue();
		var lnameComp = sap.ui.getCore().byId("register_lname").getValue();
		var dobComp = sap.ui.getCore().byId("register_dob").getValue();
		var phoneComp = sap.ui.getCore().byId("register_phone").getValue();
		var emailComp = sap.ui.getCore().byId("register_email").getValue();
		var street1Comp = sap.ui.getCore().byId("register_street1").getValue();
		var street2Comp = sap.ui.getCore().byId("register_street2").getValue();
		var cityComp = sap.ui.getCore().byId("register_city").getValue();
		var stateComp = sap.ui.getCore().byId("register_state").getValue();
		var postalcodeComp = sap.ui.getCore().byId("register_postalcode").getValue();
		var countryComp = sap.ui.getCore().byId("register_country").getValue();
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy" }); 
		var dateFormated = new Date(dateFormat.parse(dobComp));
		
		var oModel = this.getView().getModel();
		
		var oEntry = {
							FNAME :  fnameComp ,
							LNAME :  lnameComp ,
							DOB : dateFormated ,
 							EMAIL : emailComp,
							PHONE : phoneComp,
							STREET1 : street1Comp,
							STREET2 : street2Comp,
							CITY :  cityComp,
							STATE : stateComp ,
							COUNTRY : countryComp ,
							POSTALCODE : postalcodeComp
					
			};
		
		//----- register the user 
		oModel.create('ES_CUSTOMERS',oEntry,null,function onSuccess(response){
			res = 0 ;
			res = response ;
			m = new sap.ui.model.json.JSONModel({ "User" : res
			  });
			
			//----- set the user details for core
			core.setModel(m,"User");
			that.oRouter.navTo("dashboard",{},true);
		    sap.m.MessageToast.show("Registered Successfully");
		} , function onFailure(){
			sap.m.MessageToast.show("Registration failed");
		})
		
	},
	
	_handleFooterBarButtonPress : function(evt){
		//---- if user chooses to register remove login fragment & add register fragment
		oForm = this._getFormFragment("Register");
	    oContainer = this.getView().byId("idLoginPageContainer");
	    oContainer.removeContent(0);
	    oContainer.insertContent(oForm);
	}
});