 jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("com.sap.shoppingcart.view.Cart_S1", {

	onInit: function() {
		var view = this.getView();
		that = this ;
		oModel = this.getView().getModel();
		
		core = sap.ui.getCore();
    	oCartModel = core.getModel("CartModel");
    	
    	cartList = this.getView().byId("cartList");
    	cartList.setModel(oCartModel,"Cart");
    	//cartList.bindElement("/Cart");
    	
    	this._displayTotalPrice() ;
    	this.oRouter.attachRoutePatternMatched(this._handleRouterMatched, this);
    	
	},
	
	 _handleRouterMatched : function(evt) {
	     if("cart" !== evt.getParameter("name"))
	     {
	      return;
	     }
	     this._displayTotalPrice() ;
	 },
	resourceBundle : {
		getText : function(key,array) {
			return sap.ui.getCore().getModel("i18n").getResourceBundle().getText(key,array);
		}
	},
	
	_handleLogoutButtonPress:function(evt)
	{
	 this.oRouter.navTo("fullscreen",null,true);
	} ,

	_handleNavButtonPress : function(evt) {
		//window.history.go(-1);
	   this.oRouter.navTo("dashboard", {}, true);
	},

	//delete item from list
	_handleEntryListDelete : function(oEvent){
		debugger ;
		var deleteid = oEvent.getSource()._oItemNavigation.getFocusedIndex();
		sap.m.MessageBox.show(that.resourceBundle.getText("DELETE_MSG"),
				null,
				that.resourceBundle.getText("CONFIRMATION_TITLE"),
				[sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
				jQuery.proxy(function (oAction) {
					if (sap.m.MessageBox.Action.DELETE === oAction) {
						oData = oCartModel.getData();
						debugger ;
						entries = oData.Cart ;
						newEntries = [] ;
						for(i=0;i<entries.length;i++){
							if(i!=deleteid){
								newEntries = newEntries.concat(entries[i]);
							}
						}
						oData.Cart = newEntries ;
						oCartModel.setData(oData);
						cartList.setModel(oCartModel);
						this._displayTotalPrice() ;
					}
				}, this)
		);
	},
	
	//display total price
	_displayTotalPrice : function(){
		oData = oCartModel.getData();
		entries = oData.Cart ;
		price = 0 ;
		for(i=0;i<entries.length;i++){
			price =  price + (parseFloat(entries[i].PRICE) * parseInt(entries[i].ITEMS)) ;
		}
		cartList.setFooterText(that.resourceBundle.getText("TOTAL_PRICE_TEXT") + price + " INR");
	},
	
	_handleEntryListSelect : function(){
		sap.m.MessageBox.show("Select");
	} ,
	
	_handleOrder : function(event){
		oData = oCartModel.getData();
		entries = oData.Cart ;
		if(entries.length > 0 ){
		
		sap.m.MessageBox.show(that.resourceBundle.getText("CONFIRM_ORDER_MSG"),
				null,
				that.resourceBundle.getText("CONFIRMATION_TITLE"),
				[sap.m.MessageBox.Action.OK , sap.m.MessageBox.Action.CANCEL],
				jQuery.proxy(function (oAction) {
					if (sap.m.MessageBox.Action.OK === oAction) {
						oUserModel = core.getModel("User");
						oUserData = oUserModel.getData();
						debugger ;
						entries = oUserData.User ;
						//var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd/MM/yyyy" });
						var dateFormated = new Date();
						//var dateFormated = dateFormat.format(date);
						var oOrderEntry = {
								ORDERID : "" ,
								CUSTID :  entries.CUSTID ,
								ORDERDATE :  dateFormated ,
								SHIPDATE : dateFormated ,
								SHIPPERID : "3",
								SHIPSTATUS : "PENDING" ,
								AMOUNT :  String(price) ,
								SHIPPINGCOST : "50"
					   }
						oModel.create('ES_ORDERS',oOrderEntry,null,function onSuccess(oResponse){
							debugger ;
							var res = oResponse ;
							oOrderRetailData = oCartModel.getData();
							orderDetailentries = oOrderRetailData.Cart ;
							newEntries = [] ;
							for(i=0;i<orderDetailentries.length;i++){
								  var oOrderDetailEntry = {
										  ORDERID : String(res.ORDERID) ,
										  PRODUCTID : String(orderDetailentries[i].PRODUCTID) ,
										  ITEMS : parseInt(orderDetailentries[i].ITEMS)
							       }
								//newEntries = newEntries.concat(oOrderDetailEntry);
								oModel.create('ES_ORDER_DETAIL',oOrderDetailEntry,null,function onSuccess(oResponse){ 
									debugger ;
									//sap.m.MessageToast.show("Order detail created successfully");
								},function onFailure(){
									//sap.m.MessageToast.show("Order detail failed");
								})
							}
							sap.m.MessageToast.show(that.resourceBundle.getText("ORDER_PLACED_MSG"));
							 sap.m.MessageBox.show( that.resourceBundle.getText("ORDER_PLACED_MSG") , {
							      icon : sap.m.MessageBox.Icon.QUESTION,
							      title : "Order",
							      actions : [sap.m.MessageBox.Action.OK],
							      onClose : function(oAction) { 
							        if ( oAction === sap.m.MessageBox.Action.OK ) {
							        	that.oRouter.navTo("dashboard",{},true);
							        }
							      },
							    });
							
						} , function onFailure(){
							sap.m.MessageToast.show(that.resourceBundle.getText("ORDER_FAILED_MSG"));
						})
					
					}
				}
			, this)
			
         )
         
		}else{
			sap.m.MessageToast.show(that.resourceBundle.getText("CART_NO_ITEMS"));
			 
		}}
		
});