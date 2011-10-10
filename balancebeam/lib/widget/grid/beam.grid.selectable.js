/*
 * Balancebeam Widget Grid_Plugin_Selectable 1.0
 *
 * Description : Support for multiple-choice
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 * 		balancebeam/lib/widget/grid/beam.grid.js
 */

(function($, undefined ) {
 
$.ui.grid.selectable = function(grid,params){
	 this.grid = grid;
	 this._create(params);
};
//selectable原型定义
$.ui.grid.selectable.prototype = {
	//bind event
	_create : function(params){
		var self = this,
			grid = this.grid,
			id = grid.element.attr("id");
		grid.subscribe("select.grid-selectable",this,"select");
		grid.subscribe("selectAll.grid-selectable",this,"selectAll");
		var column =this.column= {
			width : 28,
			resizable:false,
			sortable: false,
			dropmenu:false,
			draggable:false,
			noswap:true,
			format : function(inRowIndex){
				var html = [],
					checked = !!grid.runtime.dataProvider[inRowIndex]["s"] && "checked" || "";
				html.push("<input type='checkbox' class='checklogic' ");
				html.push(checked);
				html.push(" rowIndex=");
				html.push(inRowIndex);
				html.push(" bbEvents='click:select'");
				html.push(">");
				return html.join("");
			},
			lockedRowFormat : function(inRowIndex){
				var html = [],
					checked = !!grid.runtime.lockedRowDataProvider[inRowIndex]["s"] && "checked" || "";
				html.push("<input type='checkbox' class='checklogic' lockedView=true ");
				html.push(checked);
				html.push(" rowIndex=");
				html.push(inRowIndex);
				html.push(" bbEvents='click:select'");
				html.push(">");
				return html.join("");
			},
			formatHeader:function(){
				var html = [],
					checked = column.checkedAll ?  "checked" : "";
				html.push("<input type='checkbox' class='checklogic' ");
				html.push(checked);
				html.push(" bbEvents='click:selectAll'");
				html.push(">");
				return html.join("");
			}
		};
		grid.runtime.playout.push(column);
	},	
	select : function(e){
		var target = $(e.target),
			rowIndex = Number(target.attr("rowIndex"));
		if(target.attr("lockedView")){
			this.grid.runtime.lockedRowDataProvider[rowIndex]["s"]  = target[0].checked;
		}
		else{
			this.grid.runtime.dataProvider[rowIndex]["s"]  = target[0].checked;
		}
	},
	selectAll : function(e){
		var target = $(e.target),
			checked = target[0].checked,
			dataProvider = this.grid.runtime.dataProvider;
		this.column.checkedAll = checked;
		for(var i=0,d;d = dataProvider[i];i++){
			d["s"] = checked;
		}
		dataProvider = this.grid.runtime.lockedRowDataProvider;
		for(var i=0,d;d = dataProvider[i];i++){
			d["s"] = checked;
		}
		this.grid.resize();
	},
	destroy : function(){
		this.grid.unsubscribe("select.grid-selectable");
		this.grid.unsubscribe("selectAll.grid-selectable");
	}
 };
//注入plugin
$.ui.grid.plugins.register("selectable",$.ui.grid.selectable);

})(jQuery);
