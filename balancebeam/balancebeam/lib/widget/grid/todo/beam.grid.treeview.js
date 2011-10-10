/*
 * Balancebeam Widget Grid_Plugin_Treeview 1.0
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
 
$.ui.grid.treeview = function(grid,params){
	 this.grid = grid;
	 this._create(params);
};

$.ui.grid.treeview.prototype = {
	_create : function(params){
		//TODO
	},
	destroy : function(){
		//TODO
	}
 };
//注入plugin
$.ui.grid.plugins.register("treeview",$.ui.grid.draggable);

})(jQuery);
