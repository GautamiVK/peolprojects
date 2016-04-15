jQuery.sap.declare("com.peol.customtile.common.TileManager");
jQuery.sap.require("com.peol.customtile.common.Formatter");
com.peol.customtile.common.TileManager = {
	updateVariables : function() {

	},

	updateCustomTileApproveLeave : function(view) {
		that = this;
		var CustomTileApproveLeave = view.byId("costOfDelvTile");
		var model=sap.ui.getCore().getModel("leaveApprovalModel");
		model.read("/LeaveRequestCollection?$filter=RequesterNumber eq '" + EMPLOYEE_ID + "' and SessionID eq '" + SESSION_ID + "'",null,[],false,function(o,r){
			that.updateNumericKpiTile(CustomTileApproveLeave, o.results.length, "green", "");
		},function(o,r){
			
		});
	},
	updateCustomTileApproveResumption : function(view) {
		that = this;
		var CustomTileApproveResumption = view.byId("leaveRequestResump");
		var model=sap.ui.getCore().getModel("leaveResumptionModel");
		model.read("/LeaveRequestCollection?$filter=RequesterNumber eq '" + EMPLOYEE_ID + "' and SessionID eq '" + SESSION_ID + "'",null,[],false,function(o,r){
			that.updateNumericKpiTile(CustomTileApproveResumption, o.results.length, "green", "");
		},function(o,r){
			
		});
	},
	settingState : function(thatTile) {
		thatTile.setState("Loaded");
	},
	updateFailedTile : function(tile) {
		tile.setState("Failed");
		setTimeout(function() {
			tile.rerender();
		}, 0);
	},
	updateNumericKpiTile : function(tile, value, color, trendImage) {
		if (value == null) {
			value = 0;
		}
		tile.setValue(value);
		tile.setColor(color);
		tile.setTrendImage(trendImage);
		tile.setState("Loaded");
		setTimeout(function() {
			tile.rerender();
		}, 0);
	}
}