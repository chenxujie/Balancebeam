/*
 * Balancebeam Widget Grid_View 1.0
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
 
$.ui.grid.view = function(grid,layout,noscroll){
	 this.grid = grid;
	 this.layout = layout;
	 this.columns = [];
	 for(var i=0;layout[i];i++){
		 for(var j=0,column;column=layout[i][j];j++){
			 !column.multiTitle &&  this.columns.push(column);
		 }
	 }
	 this.noscroll = noscroll;
	 this._create();
 }
$.ui.grid.view.prototype = {
	 //创建view视图
	_create : function(){
		this.headerNode = $("<div class='header'></div>");
		this.grid.headersNode.append(this.headerNode);	
		this.contentNode =  $("<div class='content'></div>");
		if(this.noscroll){
			this.headerNode.addClass("locked");
			this.contentNode.addClass("locked");
		}
		this.viewportNode = $("<div class='viewport'></div>");
		this.contentNode.append(this.viewportNode);
		this.lockedRowViewportNode = $("<div class='viewport locked'></div>");
		this.contentNode.append(this.lockedRowViewportNode);
		if("bottom"==this.grid.runtime.lockedRowPosition){
			this.viewportNode.css("top","0px");
			this.lockedRowViewportNode.css("bottom","0px");
			this.lockedRowViewportNode.addClass("bottom");
		}
		else{
			this.viewportNode.css("bottom","0px");
			this.lockedRowViewportNode.css("top","0px");
			this.lockedRowViewportNode.addClass("top");
		}
		if(!this.grid.runtime.lockedRowDataProvider.length){
			this.lockedRowViewportNode.hide();
		}
		
		this.grid.contentsNode.append(this.contentNode);	
		this.resetViewport();
		//初始化viewport参数
		this.renderHeader();		
	},
	resetViewport : function(){
		this.viewport = {
				beginRowIndex : 0,
				beginColumnIndex : 0,
				endRowEdge : false,
				endColumnEdge : false
			};
	},
	//渲染表头
	renderHeader : function(){
		var html = [];
		html.push("<table  cellspacing='0' cellpadding='0' style='width:");
		html.push(this.getHeaderWidth());		
		html.push(";'>");
		html.push(this.getHeaderTableColgroup());
		html.push("<tbody>");
		
		for(var i=0,idx=0,columns;columns = this.layout[i];i++){
			html.push("<tr");
			if(this.layout.length-1 == i){
				html.push(" class='splitter'");
			}
			html.push(">");
			for(var j=0,l=columns.length-1,column;column = columns[j];j++){
				html.push("<th");
				if(column.colspan){
					html.push(" colspan='");
					html.push(column.colspan);
					html.push("'");
				}
				else if(column.rowspan){
					html.push(" rowspan='");
					html.push(column.rowspan);
					html.push("'");
				}
				html.push(">");
				html.push("<div class='th ");
				html.push(j==l ? "splitter " :"");
				html.push(column.multiTitle ? "multi'" : ("' idx="+idx++));
				html.push(">");
				if(column.formatHeader){
					html.push(column.formatHeader());
				}
				else{
					html.push(column.title);
				}
				html.push("</div>");
				html.push("</th>");				
			}
			html.push("</tr>");
		}
		html.push("</tbody>");
		html.push("</table>");
		html.push("</div>");
		this.headerNode.html(html.join(""));	
		this.grid.publish("renderHeader",[this]);
	},
	getHeaderWidth : function(){
		return (this.noscroll || !this.grid.options.percentage )? this.getHeaderTableWidth()+"px" : "100%";
	},
	//获取表头Colgroup信息
	getHeaderTableColgroup : function(){
		var unit = (this.noscroll || !this.grid.options.percentage ) ? "px" : "",
			html = ["<colgroup>"];
		for(var i=0,column;column = this.columns[i];i++){
			html.push("<col style='width:");
			html.push(column.width || this.grid.options.columnWidth);
			html.push(unit);
			html.push("'>");
		}
		html.push("</colgroup>");	
		return html.join("");
	},
	//获取表头的宽度
	getHeaderTableWidth : function(){
		var width = 0;
		for(var i=0,column;column = this.columns[i];i++){
			width += column.width || this.grid.options.columnWidth;			
		}
		return width;
	},
	renderContent : function(){
		this.renderViewport();
		this.renderLockedRowViewport();
		this.positionHeader();
	},
	positionHeader : function(){
		//调整表头的位置
		if(this.noscroll){ 
			return;
		}
		if(this.viewport.endColumnEdge){
			$(">table",this.headerNode).css({
				"left" : "auto",
				"right" : "0px"
			});
		}
		else{
			$(">table",this.headerNode).css({
				"left" : -this.getScrollLeft() + "px",
				"right" : "auto"
			});
		}
	},
	//渲染可视表格内容
	renderViewport : function(){
		var options = this.grid.options,
			dataProvider = this.grid.runtime.dataProvider,
			viewport = this.viewport,
			b = 0,
			html = [];
		if(!dataProvider.length){
			return;
		}
		if("top"==this.grid.runtime.lockedRowPosition){
			b = this.grid.runtime.lockedRowDataProvider.length %2;
		}
		html.push("<table  cellspacing='0' cellpadding='0' style='width:");
		html.push((this.noscroll || !options.percentage )? this.getViewportTableWidth()+"px" : "100%");	
		html.push(";");
		viewport.endRowEdge && html.push("bottom:0;");		
		viewport.endColumnEdge && html.push("right:0;");		
		html.push("'>");
		html.push(this.getViewportTableColgroup());
		html.push("<tbody>");
		for(var i=0,row;i<viewport.visibleRows;i++){
			html.push("<tr");
			html.push((b+i)%2 ? " class='odd'" : "");
			html.push(">");
			row = dataProvider[viewport.beginRowIndex + i]["d"];
			for(var j=0,column,l=viewport.visibleColumns-1,filedIndex;j<=l;j++){
				column =  this.columns[viewport.beginColumnIndex + j];
				filedIndex = column["filedIndex"];
				html.push("<td>");
				html.push("<div class='td ");
				html.push(j==l ? "splitter " :"");
				html.push("'>");
				if(column.format){
					if(null!=filedIndex){
						html.push(column.format(viewport.beginRowIndex+i,row[filedIndex])); 
					}
					else{
						html.push(column.format(viewport.beginRowIndex+i));
					}
				}
				else if(null!=filedIndex){
					html.push(row[filedIndex]);
				}	
				html.push("</div>");
				html.push("</td>");
			}
			html.push("</tr>");
		}
		html.push("</tbody>");
		html.push("</table>");
		this.viewportNode.html(html.join(""));
		
	},
	//渲染锁定行视图
	renderLockedRowViewport : function(){
		var options = this.grid.options,
			lockedRowDataProvider = this.grid.runtime.lockedRowDataProvider,
			viewport = this.viewport,
			b= 0,
			html = [];
		if(!lockedRowDataProvider.length) {
			return;
		}
		var splitter = lockedRowDataProvider.length -1;
		if("bottom"==this.grid.runtime.lockedRowPosition){
			b = viewport.visibleRows %2;
			splitter = 0;
		}
		html.push("<table cellspacing='0' cellpadding='0' style='width:");
		html.push((this.noscroll || !options.percentage )? this.getViewportTableWidth()+"px" : "100%");	
		html.push(";");
		viewport.endColumnEdge && html.push("right:0;");		
		html.push("'>");
		html.push(this.getViewportTableColgroup());
		html.push("<tbody>");
		for(var i=0,row;lockedRowDataProvider[i];i++){
			row = lockedRowDataProvider[i]["d"];
			html.push("<tr class='");
			html.push((b+i)%2 ? "odd " : "");
			if(splitter==i){
				html.push("splitter");
			}
			html.push("'>");
			for(var j=0,column,l=viewport.visibleColumns-1,filedIndex;j<=l;j++){
				column =  this.columns[viewport.beginColumnIndex + j];
				filedIndex = column["filedIndex"];
				html.push("<td>");
				html.push("<div class='td ");
				html.push(j==l ? "splitter " :"");
				html.push("'>");
				if(column.lockedRowFormat){
					if(null!=filedIndex){
						html.push(column.lockedRowFormat(i,row[filedIndex])); 
					}
					else{
						html.push(column.lockedRowFormat(i));
					}
				}
				else if(null!=filedIndex){
					html.push(row[filedIndex]);
				}	
				html.push("</div>");
				html.push("</td>");
			}
			html.push("</tr>");
		}
		html.push("</tbody>");
		html.push("</table>");
		this.lockedRowViewportNode.html(html.join(""));		
	},
	//渲染可视表格Colgroup
	getViewportTableColgroup : function(){
		var viewport = this.viewport,
			unit = (this.noscroll || !this.grid.options.percentage ) ? "px" : "",
			html = ["<colgroup>"];
		for(var i=0,column; i< viewport.visibleColumns;i++){
			column =  this.columns[viewport.beginColumnIndex + i];
			html.push("<col style='width:");
			html.push(column.width || this.grid.options.columnWidth);
			html.push(unit);
			html.push("'>");
		}
		html.push("</colgroup>");	
		return html.join("");
	},
	//渲染可视表格的宽度
	getViewportTableWidth : function(){
		var viewport = this.viewport,
			width = 0;
		for(var i=0,column; i< viewport.visibleColumns;i++){
			column =  this.columns[viewport.beginColumnIndex + i];			
			width += column.width || this.grid.options.columnWidth;
		}
		return width;
	},
	setLeftPosition : function(leftPosition){
		this.headerNode.css("left",leftPosition+"px");
		this.contentNode.css("left",leftPosition+"px");
	},
	setHeaderNodeHeight : function(height){
		this.headerNode.height(height);
	},
	//左边滚动的宽度
	getScrollLeft : function(){
		var w = 0;
		for(var i=0,column;i<this.viewport.beginColumnIndex;i++){
			column = this.columns[i];
			w += column.width || this.grid.options.columnWidth;			
		}
		return w;
	},
	//调整大小
	resize : function(width,height){
		var viewport = this.viewport,
			grid = this.grid,
			options = grid.options,
			scrollerOffset = grid.scrollerOffset,
			lockedRowHeight = grid.runtime.lockedRowDataProvider.length * options.rowHeight;
		//先计算锁定行高
		this.lockedRowViewportNode.height(lockedRowHeight);
		height = height - lockedRowHeight;
		lockedRowHeight>0 && height--;
		this.headerNode.css("visibility","visible");
		this.contentNode.css("visibility","visible");
		if(width<= scrollerOffset){
			this.headerNode.css("visibility","hidden");
			this.contentNode.css("visibility","hidden");
			width = this.getHeaderTableWidth() + scrollerOffset+1;
		}
		height = height< scrollerOffset ? scrollerOffset : height+1;
		viewport.width = width;
		viewport.height = height;
		viewport.yscroller = false;
		viewport.xscroller = false;
		//先计算高度
		var rowCount = grid.runtime.dataProvider.length,
			rowHeight = options.rowHeight,
			rowsHeight = rowCount * rowHeight;
		viewport.rowCount = rowCount;
		viewport.rowHeight = rowHeight;
		viewport.rowsHeight = rowsHeight;
		//如果是锁定视图则不计算高度
		if(!this.noscroll && rowsHeight > height){
			viewport.yscroller = true;
			viewport.width = width - scrollerOffset;
		}
		//如果锁定视图或百分比表格
		viewport.visibleColumns = this.columns.length;
		if(!this.noscroll && !grid.options.percentage){
			//计算是否应该有横向滚动条
			var headerTableWidth = this.getHeaderTableWidth();
			viewport.headerTableWidth = headerTableWidth;
			//如果表头的宽度大于容器的宽度
			if(headerTableWidth > width){
				viewport.xscroller = true;
				var beginColumnIndex = viewport.beginColumnIndex,
					visibleTableWidth = 0;
				viewport.visibleColumns = 0;
				for(var i=beginColumnIndex,column;column = this.columns[i];i++){
					visibleTableWidth+=column.width || grid.options.columnWidth;
					viewport.visibleColumns ++;
					if(visibleTableWidth >= width){
						break;
					}
				}
				//判断beginColumnIndex的合法性
				for(;visibleTableWidth < width;){
					viewport.endColumnEdge = true;
					viewport.beginColumnIndex--;
					visibleTableWidth += this.columns[viewport.beginColumnIndex].width || grid.options.columnWidth;
					viewport.visibleColumns ++;
					if(0==viewport.beginColumnIndex) break;
				}
				viewport.height = height -scrollerOffset;
				//如果此时的还存在纵向滚动条的场景
				if(!viewport.yscroller){
					if(rowsHeight + scrollerOffset > viewport.height){
						//如果grid是自动的撑高度
						if(grid.options.autoHeight){
							viewport.height  = height;
							grid.element.height(parseInt(grid.element.css("height"),10)+scrollerOffset);
							grid.contentsNode.height(parseInt(grid.contentsNode.css("height"),10)+scrollerOffset);
						}
						else{
							viewport.yscroller = true;
							viewport.width = width - scrollerOffset;
						}
					}
				}
			}
			else{
				if(viewport.yscroller){
					if(headerTableWidth + scrollerOffset > width){
						//如果grid是自动的撑宽度
						if("auto"==grid.options.width){
							viewport.width  = width;
							grid.element.width(parseInt(grid.element.css("width"),10)+scrollerOffset);
						}
						else{
							viewport.xscroller = true;
							viewport.height = height - scrollerOffset;
						}
					}
					else{
						viewport.endColumnEdge = false;
					}
				}
				else{
					viewport.endColumnEdge = false;
				}
			}
		}
		//非锁定视图再设置应该显示多少条记录
		if(!this.noscroll){
			//设置表头外层容器的宽度
			$(">.headers>.placeholder",grid.element).remove();
			if(viewport.yscroller){
				var placeholder = $("<div class='placeholder'></div>");
				$(">.headers",grid.element).append(placeholder);
			}
			this.headerNode.width(viewport.width);
			viewport.visibleRows = Math.min(Math.ceil(viewport.height / rowHeight),rowCount);
			//考虑当前的beginColumnIndex的合法性，可视的记录小于visibleRows，重新确定beginColumnIndex
			if(viewport.beginColumnIndex + viewport.visibleRows > rowCount){
				viewport.beginColumnIndex = rowCount - viewport.visibleRows;
				viewport.endRowEdge = true;
			}
			//设置Viewport容器和滚动条的宽高
			viewport.contentHeight = viewport.height + lockedRowHeight;
			this.viewportNode.height(viewport.height);
			this.contentNode.css({
				"width": viewport.width+"px",
				"height" : viewport.contentHeight +"px"
			});
		}
		else{
			var w = grid.element.width();
			if(width>w) {
				width = w-scrollerOffset;
			}
			this.headerNode.width(width);
			this.contentNode.width(width);
		}	
		this.positionHeader();
	},
	destroy : function(){
		this.headerNode.remove();
		this.contentNode.remove();
	}
 } 
})(jQuery);
