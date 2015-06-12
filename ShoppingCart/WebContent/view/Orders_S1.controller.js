jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("com.sap.shoppingcart.util.Formatter");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
sap.ca.scfld.md.controller.BaseFullscreenController.extend("com.sap.shoppingcart.view.Orders_S1", {
	
	onInit: function() {
         view = this.getView();
         that = this ;
         core = sap.ui.getCore() ;
         
		 orderlist = this.getView().byId("list_orders");
		 
		 orderdetaillist = this.getView().byId("list_orders_detail");
		 orderdetaillist.setVisible(false);
		 
		 cartIcon = this.getView().byId("cartIcon");
     	 
		//----- reloading cart & user models
		    oCartModel = core.getModel("CartModel");
		    oCartData = oCartModel.getData();
			aCartEntries = oCartData.Cart;
			cartIcon.setText((aCartEntries.length) + " Items")
			
			userModel = core.getModel("User");
			user = userModel.getData().User ;
		 
		 this.oRouter.attachRoutePatternMatched(this._handleRouterMatched, this);
		
	},
	
	_handleRouterMatched:function(evt){
		if("order" !== evt.getParameter("name")){
			return;
		}
		
		//----- reloading cart & user models
		oCartModel = core.getModel("CartModel");
	    oCartData = oCartModel.getData();
		aCartEntries = oCartData.Cart;
		cartIcon.setText((aCartEntries.length) + " Items")
		userModel = core.getModel("User");
		user = userModel.getData().User ;
		
		
		//----- set model for order list
		oModel = this.getView().getModel();
		
		//----- get all orders for specific customer id
		var custid =  0 ;
		oModel.read("ES_ORDERS?$filter=CUSTID eq '" + user.CUSTID + "'", null, null, false, function(response) {
			 res = 0 ;
			 res = response.results ;
		  });
		m = new sap.ui.model.json.JSONModel({ "OrdersCollection" : res
		  });
		orderlist.setModel(m , "Orders");
		orderdetaillist.setVisible(false);
		
	},
	
	_handleNavButtonPress : function(evt) {
		that.oRouter.navTo("dashboard",{},true);  
	},
		
	_handleLogoutButtonPress:function(evt) {
		that.oRouter.navTo("fullscreen",null,false);
	} ,
		
	_handleCartButtonPress : function(event){
		that.oRouter.navTo("cart",{},true);
	} ,
	
	reloadCartAndUserModel : function(){
		oCartModel = core.getModel("CartModel");
	    oCartData = oCartModel.getData();
		aCartEntries = oCartData.Cart;
		cartIcon.setText((aCartEntries.length) + " Items")
		
		userModel = core.getModel("User");
		user = userModel.getData().User ;
	} ,
	
	//----- show order details for each order
   _handleOrderItemPress : function(evt) {
	   var cells = evt.getSource().mAggregations.cells ;
	   var orderid = cells[0].getTitle() ;
	   
	   oModel.read("ES_ORDER_DETAIL?$filter=ORDERID eq '" + orderid + "'", null, null, false, function(response) {
			 res = 0 ;
			 res = response.results ;
		  });
		m = new sap.ui.model.json.JSONModel({ "OrderDetailCollection" : res
		  });
		
		orderdetaillist.setModel(m , "OrderDetail");
		orderdetaillist.setVisible(true);
   },
   
   //----- show order detail in product detail 
   _handleOrderDetailItemPress : function(evt) {
	   var cells = evt.getSource().mAggregations.cells ;
	   var productid = cells[0].getTitle() ;
	   that.oRouter.navTo("productdetail",{from : "order" ,path:productid},false);
   },

});