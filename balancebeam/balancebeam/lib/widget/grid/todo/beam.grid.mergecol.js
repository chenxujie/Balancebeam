/*
 * Balancebeam Widget Grid_Plugin_Mergecol 1.0
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
 
$.ui.grid.mergecol = function(grid,params){
	 this.grid = grid;
	 this._create(params);
};

$.ui.grid.mergecol.prototype = {
	_create : function(params){
		//TODO
	},
	destroy : function(){
		//TODO
	}
 };
//注入plugin
$.ui.grid.plugins.register("mergecol",$.ui.grid.draggable);

})(jQuery);
