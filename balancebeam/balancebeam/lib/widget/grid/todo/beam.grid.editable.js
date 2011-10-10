/*
 * Balancebeam Widget Grid_Plugin_Editable 1.0
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
 
$.ui.grid.editable = function(grid){
	 this.grid = grid;
	 this._create();
};
$.ui.grid.editable.prototype = {
	_create : function(){
		//TODO
	},
	destroy : function(){
		//TODO
	}
 };
//注入plugin
$.ui.grid.plugins.register("editable",$.ui.grid.editable);

})(jQuery);
