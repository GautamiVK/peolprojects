

jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("com.sap.shoppingcart.util.Formatter");
jQuery.sap.require("sap.m.MessageBox");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("com.sap.shoppingcart.view.ProductDetail_S3", {

onInit : function() {
	
		var view = this.getView();
		core = sap.ui.getCore();
    	oCartModel = core.getModel("CartModel");
		oCartData = oCartModel.getData();
		aCartEntries = oCartData.Cart;
		
		cartIcon = this.getView().byId("idCartIcon");
		cartIcon.setText((aCartEntries.length) + " Items")
		
		simpleform = this.getView().byId("SimpleForm");
		icontabspec = this.getView().byId("specification_form");
		icontabsupplier = this.getView().byId("supplier_form");
		 
		this.oRouter.attachRoutePatternMatched(this._handleRouterMatched, this);
		
	} ,

	_handleNavButtonPress : function(evt) {
		 window.history.go(-1);
	},
	
	 _handleRouterMatched : function(evt) {
	     if("productdetail" !== evt.getParameter("name"))
	     {
	      return;
	     }
	     prodid = evt.getParameter("arguments").path;
	     var from = evt.getParameter("arguments").from;
	     
	     debugger ;
	     var addtocart = this.getView().byId("btn_addToCart");
	     if(from === "order"){
	    	 addtocart.setVisible(false);
	     }else{
	    	 addtocart.setVisible(true);
	     }
	     
	     oCartModel = core.getModel("CartModel");
		 oCartData = oCartModel.getData();
		 aCartEntries = oCartData.Cart;
		 cartIcon.setText((aCartEntries.length) + " Items")
			
	     oModel = this.getView().getModel();
	     
	     //get product detail
	     var supplierid = 0 ;
	     prodname = ""  , prodprice = 0 , prodavail="";
	     oModel.read("ES_PRODUCTS('"+prodid+"')", null, null, false, function(response) {
				//debugger;
				 res = 0 ;
				 res = response;
				 supplierid = response.SUPPID ;
				 prodname = response.PRODNAME ;
				 prodprice = response.UNITPRICE ;
				 prodavail = response.AVAILABLE ;
			  });
	     m = new sap.ui.model.json.JSONModel({ "Product" : res
		  });
	     
		
		 simpleform.setModel(m,"ProductDetail");
		 simpleform.bindElement("ProductDetail>/Product");
		 
		 icontabspec.setModel(m,"ProductDetail_tab");
		 icontabspec.bindElement("ProductDetail_tab>/Product");
		 
		 //get supplier detail
		 oModel.read("ES_SUPPLIERS?$filter=SUPPID eq '"+supplierid+"'", null, null, false, function(response) {
				//debugger;
				 res = 0 ;
				 res = response.results;
			  });
	     n = new sap.ui.model.json.JSONModel({ "Supplier" : res
		  });
	     
	     icontabsupplier.setModel(n,"SupplierDetail");
	     icontabsupplier.bindElement("SupplierDetail>/Supplier/0");
	     
	   
	    },
	    
	    _handleAddToCart : function(event){
	    	//debugger ;

	    	if (prodavail == "AVAILABLE"){
			// find existing entry for product
			var oEntry = null;
			for (var i = 0 ; i < aCartEntries.length ; i ++) {
				if (aCartEntries[i].PRODUCTID == prodid) {
					oEntry = aCartEntries[i];
					break;
				}
			}

			if (oEntry === null) {
				// create new entry
				oEntry = {
						PRODUCTID : prodid ,
						ITEMS : 1 ,
						NAME : prodname ,
				        PRICE : prodprice
				};
				
				oCartData.Cart[oCartData.Cart.length] = oEntry;
				cartIcon.setText((aCartEntries.length) + " Items");
				sap.m.MessageToast.show("Item added to cart");

			} else {
				// update existing entry
				oEntry.ITEMS += 1;
				sap.m.MessageToast.show("Item quantity increased");
			}
			
			// update model
			oCartModel.setData(oCartData);
//			var oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
//			sap.m.MessageToast.show(oBundle.getText("PRODUCT_MSG_ADDED_TO_CART"));
	    	}
	    	else{
	    		sap.m.MessageToast.show("Product out of stock");
	    	}
	    } ,
	    
	    _handleBuyButtonPress : function(event){
	    	//this._handleAddToCart();
		    this._handleCartButtonPress();
	    },
	    
	    _handleCartButtonPress : function(event){
	    	this.oRouter.navTo("cart",{},false);
	    } ,
	    _handleLogoutButtonPress:function(evt)
		{
		 this.oRouter.navTo("fullscreen",null,true);
		} ,
	   
});