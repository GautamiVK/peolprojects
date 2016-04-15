/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");

jQuery.sap.declare("com.peol.util.Formatters");
com.peol.util.Formatters= (function() {

	return {

		init : function(resourseBundle) {

			this.resourceBundle = resourseBundle;
		},

		getDate : function(oValue) {

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return null;
				if (oValue.length < 8)
					return null;
				if (oValue.substring(0, 6) != "/Date("
						|| oValue.substring(oValue.length - 2, oValue.length) != ")/") {
					return null;
				}
				var dateValue = oValue.substring(6, 6 + oValue.length - 8);
				oDate = new Date();
				oDate.setTime(dateValue * 1);
			}

			return oDate;
		},

		stripDecimals : function(sNumber) {

			while (sNumber.length > 0 && sNumber.charAt(0) == "0") {
				sNumber = sNumber.substring(1, 1 + sNumber.length - 1);
			}

			var pos = sNumber.indexOf(".");
			if (pos < 0) {
				if (sNumber.length < 1)
					return "0";
				return sNumber;
			}

			while (sNumber.charAt(sNumber.length - 1) == "0") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}
			if (sNumber.charAt(sNumber.length - 1) == ".") {
				sNumber = sNumber.substring(0, sNumber.length - 1);
			}

			if (sNumber.length < 1)
				return "0";

			if (sNumber.length > 0 && sNumber.charAt(0) == ".") {
				return "0" + sNumber;
			}

			return sNumber;
		},

		adjustSeparator : function(number) {

			try {
				if (!isNaN(parseFloat(number)) && isFinite(number)) {
					var numberFormatter = sap.ca.ui.model.format.NumberFormat
							.getInstance();
					if(number.indexOf(".")>0)//truncating decimals only if they exist
					numberFormatter.oFormatOptions.decimals=2;
					return numberFormatter.format(number);
				}
			} catch (e) {
			}
			return "";
		},

		// format date MMMyyyy
		DATE_ODATA_MMMyyyy : function(oValue) {

			var oDate = com.peol.util.Formatters
					.getDate(oValue);

			if (oDate != null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
						.getInstance({
							pattern : "MMM yyyy"
						});

				return oDateFormat.format(oDate,true);
			} else {
				return null;
			}
		},

		FORMAT_STARTDATE : function(StartDate, StartDate1){
			if(StartDate1 == undefined){
				return com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(StartDate);
			} else if(StartDate==undefined){
				return com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(StartDate1);
				
			}
			else
				{
				return com.peol.util.Formatters.DATE_ODATA_EEEdMMMyyyy(StartDate);
				}
		},
		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyy : function(oValue, sStyle) {

			var oDate = com.peol.util.Formatters
					.getDate(oValue);

			if (oDate != null) {
				if (sStyle) {
					var oDateFormat = sap.ca.ui.model.format.DateFormat
							.getInstance({
								style : sStyle
							});
					return oDateFormat.format(oDate,true);
				} else {
					if (jQuery.device.is.phone === true) {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "medium"
								});
						return oDateFormat.format(oDate,true);
					} else {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "medium"
								});
						return oDateFormat.format(oDate,true);
					}
					;
				}
				;
			} else {
				return null;
			}
		},


		// format date EEEdMMMyyyy
		DATE_ODATA_EEEdMMMyyyyLong : function(oValue, sStyle) {

			var oDate = com.peol.util.Formatters
					.getDate(oValue);

			if (oDate != null) {
				if (sStyle) {
					var oDateFormat = sap.ca.ui.model.format.DateFormat
							.getInstance({
								style : sStyle
							});
					return oDateFormat.format(oDate,true);
				} else {
					if (jQuery.device.is.phone === true) {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "long"
								});
						return oDateFormat.format(oDate,true);
					} else {
						var oDateFormat = sap.ca.ui.model.format.DateFormat
								.getInstance({
									style : "full"
								});
						return oDateFormat.format(oDate,true);
					}
					;
				}
				;
			} else {
				return null;
			}
		},
		
		// format date ddMMMyyyy
		DATE_ODATA_ddMMMyyyy : function(oValue) {
			var oDate = com.peol.util.Formatters
					.getDate(oValue);

			if (oDate != null) {
				var oDateFormat = sap.ca.ui.model.format.DateFormat
						.getInstance({
							pattern : "dd.MM.yyyy"
						});
				return oDateFormat.format(oDate,true);
			} else {
				return null;
			}
		},

		// format date YYYYMMdd
		DATE_YYYYMMdd : function(oDate) {

			if (oDate == undefined)
				return "";

			var oDateFormat = sap.ca.ui.model.format.DateFormat.getInstance({
				pattern : "YYYY-MM-dd"
			});

			return oDateFormat.format(oDate);
		},

		BALANCE : function(oValue) {

			if (oValue == undefined)
				return "";

			if (typeof oValue != 'string' && !(oValue instanceof String))
				return "";

			return com.peol.util.Formatters
					.adjustSeparator(com.peol.util.Formatters
							.stripDecimals(oValue));
		},
		
		//return duration Hours in 00:00 format 
        DURATION_FORMAT : function(sHours)
        {
            if(sHours.indexOf(".")>-1){
             var duration = sHours.split(".");
             var hours = duration[0].toString();
             if(parseInt(duration[1])<10) duration[1]=parseInt(duration[1])*10;
             var minutes = (parseInt(duration[1])*60)/100 ;
             minutes = Math.round(minutes);
             minutes = minutes.toString();
         if (minutes<10)minutes = "0"+minutes;
         return hours+":"+minutes;
           }else
         return sHours+":00";
               
        },
        
		// return duration days or hours depending on input
		DURATION : function(sDays, sHours, aRelatedRequests) {
			if(aRelatedRequests){
				sDays = aRelatedRequests[0].WorkingDaysDuration;
				sHours = aRelatedRequests[0].WorkingHoursDuration;
			}
			if (sDays == undefined || sHours == undefined)
				return "";

			sDays = com.peol.util.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return com.peol.util.Formatters
						.adjustSeparator(sDays);

			return com.peol.util.Formatters.DURATION_FORMAT(com.peol.util.Formatters.stripDecimals(sHours));
		},

		// determine duration unit based on leave time range
		DURATION_UNIT : function(sDays, sHours, aRelatedRequests) {
			
			if(aRelatedRequests){
				sDays = aRelatedRequests[0].WorkingDaysDuration;
				sHours = aRelatedRequests[0].WorkingHoursDuration;
			}
			if (sDays == undefined || sHours == undefined)
				return "";

			sDays = com.peol.util.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return (sDays * 1 != 1) ? com.peol.util.Formatters.resourceBundle
						.getText("LR_DAYS")
						: com.peol.util.Formatters.resourceBundle
								.getText("LR_DAY");

			return (sHours * 1 != 1) ? com.peol.util.Formatters.resourceBundle
					.getText("LR_HOURS")
					: com.peol.util.Formatters.resourceBundle.getText("LR_HOUR");
		},

		// check leave time range whether below 1 day
		isHalfDayLeave : function(sDays) {

			if (sDays == undefined)
				return false;

			sDays = com.peol.util.Formatters
					.stripDecimals(sDays);

			var pos = sDays.indexOf(".");
			if (pos < 0)
				return false;

			return true;
		},

		// time formatter
		TIME_hhmm : function(oValue) {

			if (oValue == undefined)
				return "";

			var oDate;

			if (oValue instanceof Date) {
				oDate = oValue;
			} else if (oValue.ms) {
				var hours = (oValue.ms / (3600 * 1000)) | 0;
				var minutes = ((oValue.ms - (hours * 3600 * 1000)) / (60 * 1000)) | 0;
				var seconds = ((oValue.ms - (hours * 3600 * 1000) - (minutes * 60 * 1000)) / 1000) | 0;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			} else {
				if (typeof oValue != 'string' && !(oValue instanceof String))
					return "";
				if (oValue.length != 11)
					return "";
				if (oValue.substring(0, 2) != "PT"
						|| oValue.substring(4, 5) != "H"
						|| oValue.substring(7, 8) != "M"
						|| oValue.substring(10, 11) != "S") {
					return "";
				}
				var hours = oValue.substring(2, 4) * 1;
				var minutes = oValue.substring(5, 7) * 1;
				var seconds = oValue.substring(8, 10) * 1;
				oDate = new Date();
				oDate.setHours(hours, minutes, seconds, 0);
			}

			var oDateFormat = sap.ca.ui.model.format.DateFormat
					.getTimeInstance({
						style : "short"
					});
			var sTime = oDateFormat.format(oDate);
			var aTimeSegments = sTime.split(":");
			var sAmPm = "";
			var lastSeg = aTimeSegments[aTimeSegments.length - 1];

			// chop off seconds
			// check for am/pm at the end
			if (isNaN(lastSeg)) {
				var aAmPm = lastSeg.split(" ");
				// result array can only have 2 entries
				aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
				sAmPm = " " + aAmPm[1];
			}
			return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);

		},

		// format date and time in format EEEdMMMyyyy
		FORMAT_DATETIME : function(sPrefix, oValue) {

			return sPrefix
					+ " "
					+ com.peol.util.Formatters
							.DATE_ODATA_EEEdMMMyyyy(oValue);
		},

		// history view date and label formatters: related dates are the ones
		// from an original leave request
		// where a change request has been submitted

		// header label indicating cancel or change request pending
		FORMATTER_INTRO : function(aRelatedRequests) {
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
		},

		// format end date
		FORMAT_ENDDATE : function(sHyphen, sWorkingDaysDuration, sStartTime,
				sEndDate, sEndTime, aRelatedRequests) {
			if(aRelatedRequests == undefined || !aRelatedRequests || aRelatedRequests.length < 1){
				try {
					if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
							&& sEndTime) {
						if (com.peol.util.Formatters
								.isHalfDayLeave(sWorkingDaysDuration)) {
							return com.peol.util.Formatters
									.TIME_hhmm(sStartTime)
									+ " "
									+ sHyphen
									+ " "
									+ com.peol.util.Formatters
											.TIME_hhmm(sEndTime);
						} else if (sWorkingDaysDuration * 1 != 1) {
							return sHyphen
									+ " "
									+ com.peol.util.Formatters
											.DATE_ODATA_EEEdMMMyyyy(sEndDate);
						}
					}
				} catch (e) {
					// ignore
				}
				return "";
			} else {
				sWorkingDaysDuration = aRelatedRequests[0].WorkingDaysDuration;
				sStartTime = aRelatedRequests[0].StartTime;
				sEndDate = aRelatedRequests[0].EndDate;
				sEndTime = aRelatedRequests[0].EndTime;
				try {
					if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
							&& sEndTime) {
						if (com.peol.util.Formatters
								.isHalfDayLeave(sWorkingDaysDuration)) {
							return com.peol.util.Formatters
									.TIME_hhmm(sStartTime)
									+ " "
									+ sHyphen
									+ " "
									+ com.peol.util.Formatters
											.TIME_hhmm(sEndTime);
						} else if (sWorkingDaysDuration * 1 != 1) {
							return sHyphen
									+ " "
									+ com.peol.util.Formatters
											.DATE_ODATA_EEEdMMMyyyy(sEndDate);
						}
					}
				} catch (e) {
					// ignore
				}
				return "";
			}
//			try {
//				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
//						&& sEndTime) {
//					if (com.peol.util.Formatters
//							.isHalfDayLeave(sWorkingDaysDuration)) {
//						return com.peol.util.Formatters
//								.TIME_hhmm(sStartTime)
//								+ " "
//								+ sHyphen
//								+ " "
//								+ com.peol.util.Formatters
//										.TIME_hhmm(sEndTime);
//					} else if (sWorkingDaysDuration * 1 != 1) {
//						return sHyphen
//								+ " "
//								+ com.peol.util.Formatters
//										.DATE_ODATA_EEEdMMMyyyy(sEndDate);
//					}
//				}
//			} catch (e) {
//				// ignore
//			}
//			return "";
		},

		
	// format end date
		FORMAT_ENDDATE_LONG : function(sHyphen, sWorkingDaysDuration, sStartTime,
				sEndDate, sEndTime) {
			try {
				if (sHyphen && sWorkingDaysDuration && sStartTime && sEndDate
						&& sEndTime) {
					if (com.peol.util.Formatters
							.isHalfDayLeave(sWorkingDaysDuration)) {
						return com.peol.util.Formatters
								.TIME_hhmm(sStartTime)
								+ " "
								+ sHyphen
								+ " "
								+ com.peol.util.Formatters
										.TIME_hhmm(sEndTime);
					} else if (sWorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ com.peol.util.Formatters
										.DATE_ODATA_EEEdMMMyyyyLong(sEndDate);
					}
				}
			} catch (e) {
				// ignore
			}
			return "";
		},

		// visibility setter for original/changed date range labels
		SET_RELATED_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2";
		},

		SET_RELATED_START_DATE_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined;
		},

		// format related start date
		FORMAT_RELATED_START_DATE : function(aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined) {
				try {
					return com.peol.util.Formatters
							.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].StartDate);
				} catch (e) {
				}
			}
			return "";
		},

		FORMAT_RELATED_START_DATE_LONG : function(aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].StartDate != undefined) {
				try {
					return com.peol.util.Formatters
							.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].StartDate);
				} catch (e) {
				}
			}
			return "";
		},
		
		// set related end date from change request visible if available
		SET_RELATED_END_DATE_VISIBILITY : function(aRelatedRequests) {
			return aRelatedRequests != undefined
					&& aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined
					&& (com.peol.util.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration) || aRelatedRequests[0].WorkingDaysDuration * 1 != 1);
		},

		// format related end date
		FORMAT_RELATED_END_DATE : function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined) {
				try {
					if (com.peol.util.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return com.peol.util.Formatters
								.TIME_hhmm(aRelatedRequests[0].StartTime)
								+ " "
								+ sHyphen
								+ " "
								+ com.peol.util.Formatters
										.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ com.peol.util.Formatters
										.DATE_ODATA_EEEdMMMyyyy(aRelatedRequests[0].EndDate);
					}
				} catch (e) {
				}
			}
			return "";
		},
		
		FORMAT_RELATED_END_DATE_LONG : function(sHyphen, aRelatedRequests) {
			if (aRelatedRequests != undefined && aRelatedRequests.length > 0
					&& aRelatedRequests[0].LeaveRequestType == "2"
					&& aRelatedRequests[0].WorkingDaysDuration != undefined
					&& aRelatedRequests[0].StartDate != undefined
					&& aRelatedRequests[0].EndDate != undefined
					&& !aRelatedRequests[0].EndTime != undefined) {
				try {
					if (com.peol.util.Formatters
							.isHalfDayLeave(aRelatedRequests[0].WorkingDaysDuration)) {
						return com.peol.util.Formatters
								.TIME_hhmm(aRelatedRequests[0].StartTime)
								+ " "
								+ sHyphen
								+ " "
								+ com.peol.util.Formatters
										.TIME_hhmm(aRelatedRequests[0].EndTime);
					}
					if (aRelatedRequests[0].WorkingDaysDuration * 1 != 1) {
						return sHyphen
								+ " "
								+ com.peol.util.Formatters
										.DATE_ODATA_EEEdMMMyyyyLong(aRelatedRequests[0].EndDate);
					}
				} catch (e) {
				}
			}
			return "";
		},
		
		Approvetype :function(type){
			if(type == "111111111111")
				return com.peol.util.Formatters.resourceBundle
				.getText("LR_Approve_creation");
			else if(type == "222222222222")
				return com.peol.util.Formatters.resourceBundle
				.getText("LR_Approve_change");
			else if(type == "333333333333")
				return com.peol.util.Formatters.resourceBundle
				.getText("LR_Approve_cancel");
		},
				
		pendingManager:function(resSubmit, approverName, aRelatedRequests){
			var labelManager;
			if(aRelatedRequests != undefined){
				resSubmit = aRelatedRequests[0].ResSubmit;
			}
			if(resSubmit == true){
				labelManager = com.peol.util.Formatters.resourceBundle.getText("RES_PENDING_MANAGER");
			} else {
				labelManager = com.peol.util.Formatters.resourceBundle.getText("PENDING_MANAGER");
			}				
			if(aRelatedRequests == undefined || !aRelatedRequests || aRelatedRequests.length < 1){
				return labelManager+" : "+approverName;
			} else {
				return labelManager+" : "+aRelatedRequests[0].ApproverEmployeeName;
			}
			
		},

		State : function(status) {
			status = status.toLowerCase();
			switch (status) {
			case "sent":
				return null;
				break;
			case "posted":
				return "Success";
				break;
			case "approved":
				return "Success";
				break;
			case "rejected":
				return "Error";
				break;
			default:
				return null;
			}
			;

		}

	};

}());
