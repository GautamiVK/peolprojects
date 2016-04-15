jQuery.sap.declare("com.peol.util.Formatter");
jQuery.sap.require("com.peol.util.Const");
jQuery.sap.require("sap.ui.core.format.DateFormat");

com.peol.util.Formatter = {
	state : function(fValue) {
		alert("hello");
		return (fValue === util.Const.state.APPROVED) ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.Error;
	},
	// Method for reformatting task status text
	taskStatusFormat : function(status) {
		try {
			if (status == "Approved") {
				return "Success";
			} else if (status == "Rejected") {
				return "Error";
			} else if (status == "In Progress") {
				return "Warning";
			}
		} catch (err) {
			return none;
		}
	},

	dateFormate : function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern : "dd-MMM-yyyy"
			});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},
	getDifferenceBetween : function(start, end) {
		var date1 = new Date(start);
		var date2 = new Date(end);
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		com.peol.util.DataManager.getLeavesBetween(date1, date2, function(leaves) {
			diffDays = diffDays - leaves.length;
		}, null);
		return (diffDays + 1) + " Days";
	},
	getDifferenceBetweenToday : function(withDate) {
		var date1 = new Date(withDate);
		var date2 = new Date();
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		return (diffDays) + " Days Ago";
	},
	decidePrintButtonName : function(status) {
		if (!status)
			return "Print Leave";
		else
			return "Print Resumption";
	},

	displayWithdrawOnStatus : function(status,aRelatedRequests,resSubmit,RequestID) {
		var secondStatus = function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			} else {
				resSubmit = aRelatedRequests[0].ResSubmit;
			}
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType == "2") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType == "3") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_DONE");
				}
				
			}
			return "";
		};	
		var sstatus = secondStatus(aRelatedRequests);
		
		if(status == "Approved" && sstatus=="Cancellation Approved" || 
				status == "Approved" && sstatus=="Cancellation Pending" || 
				status == "Approved" && sstatus=="Change Pending" || 
				resSubmit == true ||
				status == "Booked" && resSubmit==false && RequestID == "")
		{
			return false;
		} else if(status == "Approved" && resSubmit == false && RequestID != "") {
			return true;
		} else {
			return false;
		}

	},
	
	 
	displayChangeOnStatus : function(status,aRelatedRequests,resSubmit,RequestID) {
		
		var secondStatus = function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			} else {
				resSubmit = aRelatedRequests[0].ResSubmit;
			}
			
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType == "2") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType == "3") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_DONE");
				}
				
			}
			return "";
		};	
		var sstatus = secondStatus(aRelatedRequests);

		if(status == "Approved" && sstatus=="Cancellation Approved" || 
				status == "Approved" && sstatus=="Cancellation Pending" || 
				status == "Approved" && sstatus=="Change Pending" ||
				resSubmit == true ||
				status == "Booked" && resSubmit==true && RequestID == ""){
			return false;
		}else if(status == "Approved" && resSubmit == false && RequestID != ""){
			return true;
		}else{
			return false;
		}
    },
	
displayPrintOnStatus : function(status,aRelatedRequests,resSubmit,RequestID) {
		
		var secondStatus = function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			}
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType == "2") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType == "3") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_DONE");
				}
				
			}
			return "";
		};	
		var sstatus = secondStatus(aRelatedRequests);

		if(status == "Rejected" || RequestID == "")
			return false;
		else 
			return true;
		
    
	},
	
displayPrintResOnStatus : function(status,aRelatedRequests,resSubmit,RequestID) {
		
		var secondStatus = function(aRelatedRequests) {
			if (!aRelatedRequests || aRelatedRequests.length < 1) {
				return "";
			} else {
				resSubmit = aRelatedRequests[0].ResSubmit;
			}
			var sLeaveRequestType = aRelatedRequests[0].LeaveRequestType;
			var sStatusCode = aRelatedRequests[0].StatusCode;
			if (sLeaveRequestType == "2") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CHANGE_DONE");
				}
			}
			if (sLeaveRequestType == "3") {
				if (sStatusCode == "SENT") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_PENDING");
				}
				if (sStatusCode == "APPROVED") {
					return com.peol.util.Formatters.resourceBundle
							.getText("LR_CANCEL_DONE");
				}
				
			}
			return "";
		};	
		var sstatus = secondStatus(aRelatedRequests);

		if(status=="Approved" && sstatus=="Change Pending" ||status == "Rejected" || RequestID == "" || resSubmit == false)
			return false;
		else 
			return true;
		
    
	},
	
	
	
	enableDisableResumptionButton : function(status) {
		if (!status)
			return true;
		else
			return false;
	},
	getNoteVisibility : function(notes) {
		if (notes != "")
			return true;
		else
			return false;
	},
	visibleManagerSection : function(status) {
		return isManager;
	},
	
	displaysstatus : function(aRelatedRequests){
		if(aRelatedRequests)
			return true;
		else
			 return false;
		
	},
	
	displayApproverEmployeeName : function(displayApproverEmployeeName, aRelatedRequests){
		if(aRelatedRequests != undefined){
			if(aRelatedRequests[0].ApproverEmployeeName)
				return true;
			else 
				return false;
		} else {
			if(displayApproverEmployeeName)
				return true;
			else
				return false;
		}
		
//		if(displayApproverEmployeeName == ' ' && aRelatedRequests == undefined ) {
//			return false;
//		} else if(displayApproverEmployeeName != '' || aRelatedRequests != undefined ){
//			return true;
//		}		
	},
	
	displayOptionalLeave : function(status) {
		if (status =="Paid Leave" || status =="Unpaid Leave") {
			return true;
		} else {
			return false;
		}
	},
	profileImageSrcFormation : function(empID) {
		var completeImageURL = "/sap/opu/odata/sap/ZLEAVE_APPROVAL_SRV_01/EmployeeCollection(" + empID + ")/$value";
		return completeImageURL;
	}
};