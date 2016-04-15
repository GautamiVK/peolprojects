/*
 * Copyright (C) 2009-2014 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("com.peol.utils.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("com.peol.utils.NumberFormatter");

com.peol.utils.Conversions = (function() {

    "use strict";

    return {

        formatterAbsenceDuration: function(AbsenceDays, AbsenceHours,
            AllDayFlag) {

            var oAbsenceDays, oAbsenceHours, oDuration;

            if (!AbsenceDays || !AbsenceHours || AllDayFlag === null) {
                return "";
            }

            oAbsenceDays = AbsenceDays;
            oAbsenceHours = AbsenceHours;

            if (AllDayFlag) {
                oDuration = com.peol.utils.NumberFormatter.formatNumberStripZeros(oAbsenceDays);
            } else {
                oDuration = com.peol.utils.NumberFormatter.formatNumberStripZeros(oAbsenceHours);
            }
            return oDuration;
        },

        // convert the UTC Datestring to the local timezone

        formatterAbsenceDurationUnit: function(AbsenceDays, AbsenceHours,
            AllDayFlag) {
            var oAbsenceDays, oAbsenceHours, oDurationUnit, oBundle = com.peol.Configuration.oApplicationFacade.getResourceBundle();

            // if (!AbsenceDays || !AbsenceHours || !AllDayFlag) {
            if (!AbsenceDays || !AbsenceHours || AllDayFlag === null) {
                return "";
            }

            oAbsenceDays = AbsenceDays;
            oAbsenceHours = AbsenceHours;

            if (AllDayFlag) {
                if (oAbsenceDays === 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Day_Singular");
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Days");
                }
            } else {
                if (oAbsenceHours === 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Hour_Singular");
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Hours");
                }
            }
            return oDurationUnit;
        },
        
        booleanYesNo : function(value){
        	if(value != undefined){
        		if(value == false){
        			return "No";
        		}
        		else{
        			return "Yes";
        		}
        	}
        },

        formatterAbsenceDurationAndUnit: function(AbsenceDays, AbsenceHours,
            AllDayFlag) {
            var oAbsenceDays, oAbsenceHours, oDurationUnit, oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();

            if (!AbsenceDays || !AbsenceHours || AllDayFlag === null) {
                return "";
            }

            oAbsenceDays = AbsenceDays;
            oAbsenceHours = AbsenceHours;
            if (AllDayFlag) {
                oAbsenceDays = com.peol.utils.NumberFormatter.formatNumberStripZeros(oAbsenceDays);
                if (oAbsenceDays === 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Day_Singular", [oAbsenceDays]);
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Days", [oAbsenceDays]);
                }
            } else {
                oAbsenceHours = com.peol.utils.NumberFormatter.formatNumberStripZeros(oAbsenceHours);
                if (oAbsenceHours === 1) {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Hour_Singular", [oAbsenceHours]);
                } else {
                    oDurationUnit = oBundle.getText("util.Conversions.Value_Hours", [oAbsenceHours]);
                }
            }

            return oDurationUnit;
        },

        formatterListCancelStatus: function(sLeaveRequestType) {
            var returnValue = "",
                oBundle = com.peol.Configuration.oApplicationFacade.getResourceBundle();
            if (sLeaveRequestType === "3") {
                returnValue = oBundle.getText("view.List.CancellationStatus");
            }
            return returnValue;
        },

        formatterHeaderCancelStatus: function(sLeaveRequestType) {
            var returnValue = "",
                oBundle = com.peol.Configuration.oApplicationFacade.getResourceBundle();
            if (sLeaveRequestType === "3") {
                return oBundle.getText("view.Header.CancellationStatus");
            }
            return returnValue;
        },

        formatterCurrentBalanceVisible: function(currentBalTimeUnitCode) {
            var returnValue = true;

            if (!currentBalTimeUnitCode) {
                returnValue = false;
            }
            // '000' is the initial value; only in this case do not show current
            // balance
            // Remark: Even sick leave (code '001') may require current balance
            if (currentBalTimeUnitCode === "000") {
                returnValue = false;
            }
            return returnValue;
        },

        formatterCurrentBalance: function(CurrentBalance,
            CurrentBalTimeUnitCode) {

            var oCurrentBalance = 0,
                oCurrentBalTimeUnitCode = 0,
                oResCurrentBalance = 0,
                oBundle = com.peol.Configuration.oApplicationFacade.getResourceBundle();

            if (!CurrentBalance || !CurrentBalTimeUnitCode) {
                return "";
            }

            oCurrentBalance = CurrentBalance;
            oCurrentBalTimeUnitCode = CurrentBalTimeUnitCode;

            oCurrentBalance = com.peol.utils.NumberFormatter.formatNumberStripZeros(oCurrentBalance);
            // current balance unit = days
            if (oCurrentBalTimeUnitCode === "010") {
                if (oCurrentBalance === 1) {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Day_Singular", [oCurrentBalance]);
                } else {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Days", [oCurrentBalance]);
                }
            }
            // current balance unit = hours
            if (oCurrentBalTimeUnitCode === "001") {
                if (oCurrentBalance === 1) {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Hour_Singular", [oCurrentBalance]);
                } else {
                    oResCurrentBalance = oBundle.getText("util.Conversions.Value_Hours", [oCurrentBalance]);
                }
            }

            return oResCurrentBalance;
        },

        formatterEmployeeID: function(sEmployeeID) {
            if (!sEmployeeID) {
                return "";
            }
            return com.peol.Configuration.oApplicationFacade.getResourceBundle().getText("view.Header.EmployeeID", [sEmployeeID]);
        },

        formatterOverlapsVisible: function(sOverlaps) {
            var returnValue = true;
            if (!sOverlaps) {
                returnValue = false;
            }
            if (sOverlaps === 0) {
                returnValue = false;
            }
            return returnValue;
        },

        formatterOverlaps: function(sOverlaps) {
            var returnValue = "",
                oBundle = com.peol.Configuration.oApplicationFacade.getResourceBundle();

            if (sOverlaps === 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapSing", [sOverlaps]);
            } else if (sOverlaps > 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapsPl", [sOverlaps]);
            }
            return returnValue;
        },

        formatterOverlapLink: function(sOverlaps) {
            var returnValue = "",
                oBundle = com.peol.Configuration.oApplicationFacade.getResourceBundle();
            if (sOverlaps === 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapSingLink", [sOverlaps]);
            } else if (sOverlaps > 1) {
                returnValue = oBundle.getText("util.Conversions.OverlapsPlLink");
            }
            return returnValue;
        },

        // formate the timestamp of the service to number of days
        formatterTimestampToDate: function(sTimestamp) {

            var dateShortFormatter, oDateCreatedOn;
            dateShortFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
                style: "short"
            });

            if (!sTimestamp) {
                return "";
            }

            if (typeof sTimestamp === "string") {
                if (sTimestamp.indexOf("Date") >= 0) {
                    oDateCreatedOn = com.peol.utils.Conversions.convertDateStringToDate(sTimestamp);
                } else {
                    oDateCreatedOn = com.peol.utils.Conversions.convertTimestampToDate(sTimestamp);
                }
            } else {
                oDateCreatedOn = new Date(sTimestamp);
            }

            return dateShortFormatter.formatDaysAgo(oDateCreatedOn);
        },

        formatterAbsenceDays3: function(StartDate, StartTime, EndDate,
            EndTime, AllDayFlag) {
            // old interface: (sTimeRange, oContext)
            var oTimeRange, oStartDate, oEndDate, oStartTime, oEndTime, dateFormatter;
            dateFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
                style: "full"
            });
            // bug in UI5: function is called several times - only the last time
            // all parameters are available!
            if (!StartDate || !StartTime || !EndDate || !EndTime || AllDayFlag === null) {
                return "";
            }

            oStartDate = dateFormatter.format(StartDate, true);
            oEndDate = dateFormatter.format(EndDate, true);
            oStartTime = com.peol.utils.Conversions.formatterTime(StartTime);
            oEndTime = com.peol.utils.Conversions.formatterTime(EndTime);

            if (oStartDate === oEndDate) {
                if (!AllDayFlag) {
                    if (oStartTime === oEndTime) {
                        oTimeRange = "";
                    } else {
                        oTimeRange = "   " + oStartTime + " - " + oEndTime;
                    }
                } else {
                    oTimeRange = "";
                }
                oTimeRange = oStartDate + oTimeRange;
            } else {
                oTimeRange = oStartDate + " - " + oEndDate;
            }
            return oTimeRange;
        },

        formatterAbsenceDays3Short: function(StartDate, PTStartTime, EndDate,
            PTEndTime, AllDayFlag) {
            // special formatter - converts into short date- the following
            // format:
            // date: Date(1358346063000)
            // time: PT08H00M00S

            // old interface: (sTimeRange, oContext)
            var oTimeRange, oStartDate, oEndDate, oStartTime, oEndTime, dateShortFormatter;
            dateShortFormatter = sap.ca.ui.model.format.DateFormat.getInstance({
                style: "short"
            });

            // bug in UI5: function is called several times - only the last time
            // all parameters are available!
            if (!StartDate || !PTStartTime || !EndDate || !PTEndTime) {
                return "";
            }

            oStartDate = dateShortFormatter.format(StartDate, true);
            oEndDate = dateShortFormatter.format(EndDate, true);
            oStartTime = com.peol.utils.Conversions.formatterTime(PTStartTime);
            oEndTime = com.peol.utils.Conversions.formatterTime(PTEndTime);

            if (oStartDate === oEndDate) {
                if (!AllDayFlag) {
                    if (oStartTime === oEndTime) {
                        oTimeRange = "";
                    } else {
                        oTimeRange = "   " + oStartTime + " - " + oEndTime;
                    }
                } else {
                    oTimeRange = "";
                }
                oTimeRange = oStartDate + oTimeRange;
            } else {
                oTimeRange = oStartDate + " - " + oEndDate;
            }
            return oTimeRange;
        },

        formatterDate1: function(oDate) {
            var oFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
                pattern: "MMddYYYY"
            }),
                oCreationDate = new Date(oDate);

            if (oCreationDate) {
                return oFormatter.format(oCreationDate);
            }
            return "";
        },

        formatterDate2: function(oDate) {
            var oFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance({
                pattern: "YYYY-MM-ddThh:mm"
            }),
                oCreationDate = new Date(oDate);

            if (oCreationDate) {
                return oFormatter.format(oCreationDate);
            }
            return "";
        },

        formatterTime: function(oTime) {
            // We put the times from the backend into today's date and then the
            // time is formatted.
            // Absence Start and End Time are shown as entered in backend,
            // without timezone
            var oDate = new Date(),
                HoursMs = oTime.ms / (3600 * 1000),
                Hours = Math.floor(HoursMs),
                MinutesMs = oTime.ms - (Hours * 3600 * 1000),
                Minutes = Math.floor(MinutesMs / (60 * 1000)),
                Seconds = 0,
                Millis = 0,
                sTime = sap.ca.ui.model.format.DateFormat.getTimeInstance({
                    style: "short"
                }).format(oDate, true),
                aTimeSegments = sTime.split(":"),
                sAmPm = "",
                lastSeg = aTimeSegments[aTimeSegments.length - 1],
                aAmPm = "";

            oDate.setHours(Hours, Minutes, Seconds, Millis);

            if (oDate) {
                // chop off seconds
                // check for am/pm 
                if (isNaN(lastSeg)) {
                    aAmPm = lastSeg.split(" ");
                    // result array can only have 2 entries
                    aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
                    sAmPm = " " + aAmPm[1];
                }
                return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);
            }
        },

        formatterPT_Time: function(ptstring) {
            if (ptstring.substring(0, 2) !== "PT" || ptstring.substring(4, 5) !== "H" || ptstring.substring(7, 8) !== "M" || ptstring.substring(10, 11) !== "S") {
                return "";
            }

            var hoursMS = ptstring.substring(2, 4) * 60 * 60 * 1000,
                minutesMS = ptstring.substring(5, 7) * 60 * 1000,
                secondsMS = ptstring.substring(8, 10) * 1000,
                resultMS = hoursMS + minutesMS + secondsMS,
                oDate = new Date(),
                TimezoneOffset = oDate.getTimezoneOffset() * 60 * 1000,
                sTime = sap.ca.ui.model.format.DateFormat.getTimeInstance({
                    style: "short"
                }).format(oDate, true),
                aTimeSegments = sTime.split(":"),
                sAmPm = "",
                lastSeg = aTimeSegments[aTimeSegments.length - 1],
                aAmPm = "";
            oDate.setTime(resultMS + TimezoneOffset);
            if (oDate) {
                // chop off seconds
                // check for am/pm 
                if (isNaN(lastSeg)) {
                    aAmPm = lastSeg.split(" ");
                    // result array can only have 2 entries
                    aTimeSegments[aTimeSegments.length - 1] = aAmPm[0];
                    sAmPm = " " + aAmPm[1];
                }
                return (aTimeSegments[0] + ":" + aTimeSegments[1] + sAmPm);
            }
        },

        convertDateStringToDate: function(sDateString) {
            // convert the UTC Datestring to the local timezone
            var iStartIndex = sDateString.indexOf("("),
                iEndIndex = sDateString.indexOf(")"),
                sDate = sDateString.substring(iStartIndex + 1, iEndIndex),
                oDate = new Date();
            oDate.setTime(sDate);
            return oDate;
        },

        convertTimestampToDate: function(sTimestamp) {
            // convert the UTC Date to the local timezone
            var oDateCreatedOn = new Date(),
                oDate = null,
                oType = new sap.ui.model.type.Date({
                    source: {
                        pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
                    },
                    pattern: "yyyy,MM,dd",
                    style: "medium"
                });
            oDateCreatedOn = oType.formatValue(sTimestamp, "string");

            oDate = new Date(oDateCreatedOn);
            return oDate;
        },

        convertUTCToLocalDate: function(oDate) {
            var oUtcDate = new Date();
            oUtcDate.setUTCDate(oDate.getDate());
            oUtcDate.setUTCFullYear(oDate.getFullYear());
            oUtcDate.setUTCHours(oDate.getHours());
            oUtcDate.setUTCMonth(oDate.getMonth());
            oUtcDate.setUTCMinutes(oDate.getMinutes());
            oUtcDate.setUTCSeconds(oDate.getSeconds());
            oUtcDate.setUTCMilliseconds(oDate.getMilliseconds());
            return oUtcDate;
        },

        convertLocalDateToUTC: function(oValue) {

            var oDate = null,
                oDateFormat = sap.ca.ui.model.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-dd'T'HH:mm:ss"
                });

            if (oValue instanceof Date) {
                oDate = com.peol.utils.Conversions.revertTimezoneOffset(oValue);

            } else if (typeof oValue === "string") {
                //expects mockdata(json) with format "2013-07-15T00:00:00"
                oDate = oDateFormat.parse(oValue);
            }

            return oDate;

        },


        revertTimezoneOffset: function(oValue) {

            var oDate, UTCDate, oMS, oTimezoneOffset, returnValue;

            if (oValue instanceof Date) {
                oDate = oValue;
                // correction for timezone to be done for date format
                // assumption: system/UI5 already did already some conversion which is 
                // reverted here!
                oMS = oDate.getTime();
                oTimezoneOffset = oDate.getTimezoneOffset() * 60 * 1000;
                oMS = oMS + oTimezoneOffset;
                UTCDate = new Date(oMS);
                returnValue = UTCDate;
            } else {
                // no conversion for other types
                returnValue = oValue;
            }
            return returnValue;
        },

        formatterNotesVisible: function(sCount) {
            var bVisible = false;
            if (sCount) {
                bVisible = true;
            }
            return bVisible;
        },
        formatErrorDialog: function(oError){
			var message = "";
			var messageDetails = "";
			if (oError.response) {
				// initially take status text as a general message
				message = oError.response.statusText;
				var body = oError.response.body;
				var indexValue = body.indexOf("value");
				var indexValueEnd = body.substring(indexValue)
						.indexOf("}");
				if (indexValueEnd > -1) {
					message = body.substring(indexValue + 8,
							indexValue + indexValueEnd - 1);
				}
				var indexErr = body.indexOf("errordetails");
				var indexStart = body.substring(indexErr).indexOf(
						"message");
				var indexEnd = body
						.substring(indexErr + indexStart).indexOf(
								",");
				if (indexEnd > -1) {
					messageDetails = body.substring(indexErr
							+ indexStart + 10, indexErr
							+ indexStart + indexEnd - 1);
				}
			}
									
			var oMessage = {
					message : message,
					details : messageDetails,
					type : sap.ca.ui.message.Type.ERROR
				};
				
				
				  sap.ca.ui.message.showMessageBox({
                       type: oMessage.type,
                       message: oMessage.message,
                       details: oMessage.details
                   });
        }
    };

}());