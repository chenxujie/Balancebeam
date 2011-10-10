/*
 * Balancebeam Widget Grid_Plugin_Group 1.0
 *
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 * 		balancebeam/lib/widget/grid/beam.grid.js
 */

(function( $, undefined ) {
 
$.ui.grid.group = function(grid,params){
	 this.grid = grid;
	 this._create(params);
};

$.ui.grid.draggable.prototype = {
	_create : function(params){
		//TODO
	},
	destroy : function(){
		//TODO
	}
 };
//注入plugin
$.ui.grid.plugins.register("group",$.ui.grid.group);

})(jQuery);
