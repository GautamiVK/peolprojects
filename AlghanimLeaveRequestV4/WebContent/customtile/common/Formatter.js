jQuery.sap.declare("views.common.Formatter");
views.common.Formatter = {

		format  : function(fValue){
			if(fValue){
				return 0;
			}
		},
		numberFormat : function(no){
			var num = Math.round(no);
			return num;
		},


		date : function(value){
			if(value!=null){
				var m_names = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
				res = value.split("-");
				sValue = parseInt(res[0]);
				qValue = parseInt(res[1]);
				if(isNaN(sValue)===false && isNaN(qValue)===false)
					return(m_names[sValue-1]+ "-"+res[1]);
				else
					return value;

			}
		},
		financeDate : function(value){
			if(value!=null){
				var m_names = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
				res = value.split("-");
				sValue = parseInt(res[0]);
				qValue = parseInt(res[1]);
				if(isNaN(qValue)===false && isNaN(qValue)===false)
					return(res[0]+"-"+m_names[qValue-1]);
				else
					return value;

			} 
		},
		numberWithCommas: function(value){
			return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		yAxisFormatter:function(fvalue){
			var forvalue = (fvalue/1000);
			return parseFloat(forvalue).toFixed(2);
		},

		/**************************************************************/	
		//Measure formatter By Rabin		
		measure : function(value)
		{

			switch(value)
			{
			case "REVENUE_AMT":
				return "Revenue Ammount";
				break;
			case "GROSS_MARGIN":
				return "Gross Margin";
				break;
			case "GROSS_MARGIN_PERCENTAGE":
				return "Gross margin %";
				break;
			case "ONSITE_PPC_REV":
				return "Onsite PPC revenue";
				break;
			case "OFFSHORE_PPC_REV":
				return "Offshore PPC revenue";
				break;
			case "OFFSHORE_RATIO":
				return "Offshore Ratio";
				break;

			}
		}
		/**************************************************************/
};