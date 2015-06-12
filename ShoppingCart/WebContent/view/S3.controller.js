

jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("com.sap.shoppingcart.util.Formatter");
sap.ca.scfld.md.controller.BaseDetailController.extend("com.sap.shoppingcart.view.S3", {
   
	onInit : function() {
		
		var view = this.getView();
		oModel = view.getModel();
		list = this.getView().byId("listProducts");
		
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			
			if (oEvent.getParameter("name") === "detail") {
				context = oEvent.getParameter("arguments").context ;
				var cat ="";
				cat = context.substring(0, 3).toUpperCase() ;
				
				oModel.read("/ES_PRODUCTS?$filter=CATEGORY eq '" + cat + "'", null, null, false, function(data ,response) {
					res = 0 ;
					res = data.results ;
				  }); 
				m = new sap.ui.model.json.JSONModel({ "ProductsCollection" : res
				  });
				var list = this.getView().byId("listProducts");
				list.setModel(m,"Products");
				
				var prodCount = this.getView().byId("totalProdCount");
				prodCount.setCount(list.getMaxItemsCount());
				
				    core = sap.ui.getCore();
			    	oCartModel = core.getModel("CartModel");
					oCartData = oCartModel.getData();
					aCartEntries = oCartData.Cart;
					
					cartIcon = this.getView().byId("idCartIcon");
					cartIcon.setText((aCartEntries.length) + " Items");
			}
		}, this);
		
	} ,

   _handleNavButtonPress : function(evt) {
	  this.oRouter.navTo("fullscreen", {}, true);
	},
	_handleLogoutButtonPress:function(evt)
	{
	 this.oRouter.navTo("fullscreen",null,true);
	} ,
	_handleCartButtonPress : function(event){
    	this.oRouter.navTo("cart",{},true);
    } ,
	
	_handleSelect : function(evt) {
		var context = evt.getSource().getSelectedItem();
		prodid = context.mProperties.intro ;
		this.oRouter.navTo("productdetail",{from : "product" , path:prodid},false);
	},
	
	_handleSearchProducts : function(oEvt) {
		var aFilters = [];
	    var sQuery = oEvt.getSource().getValue();
	    if (sQuery && sQuery.length > 0) {
	      var filter = new sap.ui.model.Filter("PRODNAME", sap.ui.model.FilterOperator.Contains, sQuery);
	      aFilters.push(filter);
	    }
	    // update list binding
        var binding = list.getBinding("items");
        binding.filter(filter);
	},
	
	handleIconTabBarFilterSelect: function (oEvent) {
	    var oBinding = list.getBinding("items"),
	      sKey = oEvent.getParameter("selectedKey"),
	      oFilter;
	    if (sKey === "lttt") {
	      oFilter = new sap.ui.model.Filter("UNITPRICE", "LE", 10000);
	      oBinding.filter([oFilter]);
	    } else if (sKey === "mttt") {
	      oFilter = new sap.ui.model.Filter("UNITPRICE", "GT", 10000);
	      oBinding.filter([oFilter]);
	    } else if (sKey === "avail") {
	      oFilter = new sap.ui.model.Filter("AVAILABLE", "EQ", "AVAILABLE");
	      oBinding.filter([oFilter]);
	    } else  if (sKey === "ofs") {
	      oFilter = new sap.ui.model.Filter("AVAILABLE", "EQ", "OUTOFSTOCK");
		  oBinding.filter([oFilter]);
	    }else {
	    	oBinding.filter([]);
	    }
	  }
	
	
});
