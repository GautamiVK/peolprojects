
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("com.sap.shoppingcart.view.S2", {

	onInit: function() {
		  var oModel = new sap.ui.model.json.JSONModel("model/ProductCategories.json");
		  this.getView().setModel(oModel , "Categories");
	},
	
	_handleSelect : function(event){
		//debugger;
		/*var context = event.getParameter("listItem").getBindingContext().sPath;
		context=encodeURIComponent(context);
		this.oRouter.navTo("detail", {id:context}, true);*/
		
		/*var parent = event.getSource().getSelectedItem().getParent();
	    var i = parent._oItemNavigation.getFocusedIndex();
		context=encodeURIComponent(i);*/
		var parent = event.getSource().getSelectedItem();
		var context = parent.getTitle();
		this.oRouter.navTo("detail", {context:context}, false);
		
	} ,
	
	/*getHeaderFooterOptions : function() {
		var that = this;
		return {
			sI18NMasterTitle : "MASTER_TITLE",
			// sI18NSearchFieldPlaceholder : "SEARCHFIELD_PLACEHOLDER",
			onEditPress : function() {
				jQuery.sap.log.info("master list: edit pressed");
				that.refreshHeaderFooterForEditToggle();
			},
			buttonList : [{
				sBtnTxt : "Add",
//				sI18nBtnTxt : "ADDITIONAL_BTN1",
				sIcon : "sap-icon://competitor",
				onBtnPressed : function(evt) {
					that.setBtnEnabled("mySpecialBtn", false);
					jQuery.sap.log.info("additional button 1 pressed + additional button 2 disabled");
				},
				iSize : 3
			
			 * }, { sId : "mySpecialBtn", // optional sIcon : "sap-icon://future", sI18nBtnTxt : "ADDITIONAL_BTN2",
			 * onBtnPressed : function(evt) { jQuery.sap.log.info("additional button 2 pressed"); }, iSize : 3 }, { sIcon :
			 * "sap-icon://future", sBtnTxt : "Karl", onBtnPressed : function(evt) { jQuery.sap.log.info("additional button 3
			 * pressed"); } }, { sIcon : "sap-icon://future", sBtnTxt : "Hugo", onBtnPressed : function(evt) {
			 * jQuery.sap.log.info("additional button 4 pressed"); }
			 
			}],
			oFilterOptions : {
				aFilterItems : [{
					text : "fItem 1",
					key : "key 1"
				}, {
					text : "fItem 2",
					key : "key 2"
				}],
				sSelectedItemKey : "key 2",
				onFilterSelected : function(sKey) {
					jQuery.sap.log.info(sKey + " has been selected");
				}
			},
			oSortOptions : {
				onSortPressed : function(sKey) {
					jQuery.sap.log.info("Sort pressed");
				} 
				aSortItems : [{
					text : "sItem 1",
					key : "Skey 1"
				}, {
					text : "sItem 2",
					key : "Skey 2"
				}],
				onSortSelected : function(sKey) {
					jQuery.sap.log.info(sKey + " has been selected");
				} 
			},
			oGroupOptions : {
				aGroupItems : [{
					text : "gItem 1",
					key : "gkey 1"
				}, {
					text : "gItem 2",
					key : "gkey 2"
				}],
				onGroupSelected : function(sKey) {
					jQuery.sap.log.info(sKey + " has been selected");
				}
			},
			onAddPress : function(evt) {
				jQuery.sap.log.info("add pressed");
			}
		};
	}, */
	
	
	_handleNavButtonPress : function(evt) {
		this.oRouter.navTo("dashboard", {}, true);
	},
	_handleLogoutButtonPress:function(evt)
	{
	 this.oRouter.navTo("fullscreen",null,true);
	} ,
	_handleCartButtonPress : function(event){
    	this.oRouter.navTo("cart",{},false);
    } ,
	
	_handleSearchCategories : function(oEvt) {
		var aFilters = [];
	    var sQuery = oEvt.getSource().getValue();
	    if (sQuery && sQuery.length > 0) {
	      var filter = new sap.ui.model.Filter("desc", sap.ui.model.FilterOperator.Contains, sQuery);
	      aFilters.push(filter);
	    }
	    // update list binding
	    var list = this.getView().byId("listCategories");
        var binding = list.getBinding("items");
        binding.filter(filter);
	}
		
});	