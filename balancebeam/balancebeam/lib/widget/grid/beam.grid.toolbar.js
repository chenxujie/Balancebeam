/*
 * Balancebeam Widget Grid_Plugin_Toolbar 1.0
 *
 * Description : Support the hidden columns
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 * 		balancebeam/lib/widget/grid/beam.grid.js
 * 		balancebeam/lib/widget/menu/beam.menu.js
 */

(function( $, undefined ) {
 
$.ui.grid.toolbar = function(grid,params){
	 this.grid = grid;
	 this._create(params);
};
//draggable原型定义
$.ui.grid.toolbar.prototype = {
	//bind event
	_create : function(params){
		this.filedIndex = params.filedIndex || 0;
		var self = this,
			grid = this.grid,
			html = [];
		html.push("<div class='toolbar'>");
		html.push("<div class='menu-btn'>更多功能</div>");
		html.push("<div class='query'>");
		html.push("<input type='text'>");
		html.push("</div>");
		html.push("</div>");
		grid.element.prepend(this.toolbarNode = $(html.join("")));
		this.toolbarNode.bind("click.grid-toolbar",function(e){
			var target = $(e.target);
			if(target.hasClass("menu-btn")){
				var popMenu = self.createPopMenu();
				popMenu.show();
			}
		});
		var handle;
		$("input",this.toolbarNode).keyup(function(e){
			var value = $(this).val();
			clearTimeout(handle);
			handle = setTimeout(function(){
				self.doQuery(value);
			},50);
		});
	},
	doQuery : function(value){
		var grid = this.grid,
			runtime = grid.runtime,
			reg = new RegExp(value,"ig");
		runtime.dataProvider = runtime.dataProvider.concat(runtime.filterProvider);
		runtime.filterProvider = [];
		for(var dataProvider = runtime.dataProvider, i=dataProvider.length-1,d;i>=0;i--){
			var row = dataProvider[i],
				v = row["d"][this.filedIndex];
			if(!v.match(reg)){
				runtime.filterProvider.push(row);
				dataProvider.splice(i,1);
			}
		}
		grid.resize();
	},
	createPopMenu : function(){
		this.popMenu && this.popMenu.remove();
		var incoPath = $.getContextPath()+"balancebeam/themes/default/images/",
			popMenu = $("<div style='dropmenu'></div>"),
			columns = this.columns = [],
			children = [],
			self = this,
			grid = this.grid,
			layout = this.grid.options.layout,
			columnIndex = 0;
		for(var i=0,vl;vl=layout[i];i++){
			for(var j=0,cls;cls = vl[j];j++){
				for(var k=0,cl;cl = cls[k];k++){
					columns.push(cl);
					children.push({
						id : String(columnIndex),
						normal : layout.length - 1 == i,
						column : true,
						title : cl.title || "",
						icon : incoPath+(cl.hidden ? "grid-menu-unchecked.gif" : "grid-menu-checked.gif")
					});
					columnIndex++;
				}
			}
			if(0==i && layout.length>1){
				children.push({
					seperator : true  
				});
			}
		};
		popMenu.menu({
			menuBar : false,
			dataProvider : [
			       {	
			    	    id:"columns",
			    	    title:"展现列",
			    	    icon:incoPath+"grid-menu-columns.gif",
			    	    children : children
			       },
			       {
			    	   seperator : true  
			       },
			       {
			    	   id : "export",
			    	   title : "导出",
			    	   icon : incoPath+"grid-menu-export.png"
			       },
			       {
			    	   id : "print",
			    	   title : "打印",
			    	   icon : incoPath+"grid-menu-printer.png"
			       },
			       {
			    	   seperator : true  
			       },
			       {
			    	   id : "save",
			    	   title : "保存个性化",
			    	   icon : incoPath+"grid-menu-save.png"
			       }
			],
			onClick : function(data,menuItem){
				if(data.column){
					var column = columns[Number(data.id)];
					column.hidden = !!!column.hidden;
					if(self.checkColumnsHidden()){
						column.hidden = !column.hidden;
						alert("至少存在一个可见非锁定列。");
					}
					else{
						$(".menu-item-icon",menuItem).attr("src",incoPath + (column.hidden ? "grid-menu-unchecked.gif" : "grid-menu-checked.gif"));
						grid.refresh();
					}
					return false;
				}
			}
		});
		this.toolbarNode.append(popMenu);
		this.popMenu = popMenu;
		return popMenu;
	},
	checkColumnsHidden : function(){
		var layout = this.grid.options.layout,
			columns = layout[layout.length-1][0];
		for(var i=0,column;column = columns[i];i++){
			if(!column.hidden) return false;
		}
		return true;
	},
	destroy : function(){
		 this.popMenu && this.popMenu.remove();
	}
 };
//注入plugin
$.ui.grid.plugins.register("toolbar",$.ui.grid.toolbar);

})(jQuery);
