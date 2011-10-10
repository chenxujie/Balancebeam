/*
 * Balancebeam Widget Grid_Plugin_Draggable 1.0
 *
 * Description : Support drag head for exchange columns
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 * 		balancebeam/lib/widget/grid/beam.grid.js
 */

(function( $, undefined ) {
 
$.ui.grid.draggable = function(grid){
	 this.grid = grid;
	 this._create();
};
//draggable原型定义
$.ui.grid.draggable.prototype = {
	//bind event
	_create : function(){
		var self = this,
			grid = this.grid,
			headersNode = grid.headersNode;
		if(grid.options.layout[0].length>1) return;
		headersNode.bind("mousedown.grid-draggable",function(e){
			var oTarget = $(e.target);
			if(null==oTarget.attr("idx")){
				return;
			}
			//判断列是否能拖动
			var oColumnMarkup = grid.getColumnMarkup(oTarget);
			if(false==oColumnMarkup.column.draggable){
				return;
			}
			if(null==e.layerX){
				e.layerX = e.offsetX;
				e.layerY = e.offsetY;
			} 
			var clientX = e.clientX,
				clientY = e.clientY,
				oTargetLeft = oTarget.offset().left,
				headersNodeLeft = grid.headersNode.offset().left,
				oLeft = oTargetLeft - headersNodeLeft + e.layerX + 13 ,
				oTop =e.layerY + 20,		
				ozIndex = grid.headersNode.css("zIndex"),
				dragNode = self.dragNode =
				$("<span class='drag-proxy'><label></label></span>")
					.css({
						display : "none",
						left : oLeft+ "px",
						top : oTop + "px"
					})
					.appendTo(grid.headersNode);
			$(">label",dragNode).html(oColumnMarkup.column.title);
			//创建定位图标
			self.moveTopNode = $("<div class='move-top'></div>").appendTo(grid.headersNode);
			self.moveBottomNode = $("<div class='move-bottom'></div>").appendTo(grid.headersNode);
			grid.headersNode.css("zIndex",5);
			//鼠标移动事件
			function mousemove(e){
				if(null==e.layerX){
					e.layerX = e.offsetX;
					e.layerY = e.offsetY;
				} 
				dragNode.css({
					display : "block",
					left : (oLeft +e.clientX -clientX)+ "px",
					top : (oTop + e.clientY-clientY)+ "px"
				});
				var nTarget = $(e.target),
					nTargetLeft = nTarget.offset().left,
					nTargetWidth = nTarget.width(),
					halfWidth = nTargetWidth/2;
				if( null==nTarget.attr("idx") 
						|| oTarget[0]==nTarget[0]
						|| (nTargetLeft+nTargetWidth + 1 == oTargetLeft  && e.layerX>halfWidth) 
						|| (oTarget.width()+oTargetLeft + 1 == nTargetLeft && e.layerX < halfWidth)
						|| grid.getColumnMarkup(nTarget).column.noswap){
					self.dropNo();
					return false;
				}
				self.dropYes(e);
				$.stopEvent(e);
		        return false;
			}
			function mouseup(e){
				grid.headersNode.css("zIndex",ozIndex);
				if(null==e.layerX){
					e.layerX = e.offsetX;
					e.layerY = e.offsetY;
				} 
				if(dragNode.hasClass("on")){
					var target = $(e.target),
						width = target.width(),
						nColumnMarkup = grid.getColumnMarkup(target),
						newIndex =nColumnMarkup.idx + (e.layerX > width/2 ? 1 : 0 );
						self.exchangePosition(
								oColumnMarkup.idx,
								oColumnMarkup.layoutIndex,
								newIndex,
								nColumnMarkup.layoutIndex
						);
						self.dragNode.remove();
				}
				else{ //动画销毁
					if("block"==self.dragNode.css("display")){
						self.dragNode.animate({
								left :  (oTargetLeft - headersNodeLeft) + "px",
								top :  "0px",
								opacity : 'toggle'
							},300,function(){
							self.dragNode.remove();
						});
					}
					else{
						self.dragNode.remove();
					}
				}
				self.moveTopNode.remove();
				self.moveBottomNode.remove();
				$(document).unbind("mousemove",mousemove);
				$(document).unbind("mouseup",mouseup);
			}
			$(document).bind("mousemove",mousemove);
			$(document).bind("mouseup",mouseup);
			
			setTimeout(function(){
				dragNode && dragNode.css("display","block");
			},600);
		});
	},
	dropNo : function(){
		var dragNode = this.dragNode,
			moveTopNode = this.moveTopNode,
			moveBottomNode = this.moveBottomNode;
		if(dragNode.hasClass("on")){
			dragNode.removeClass("on");
		}
		moveTopNode.css("display","none");
		moveBottomNode.css("display","none");
	},
	dropYes : function(e){
		var dragNode = this.dragNode,
			moveTopNode = this.moveTopNode,
			moveBottomNode = this.moveBottomNode,
			target = $(e.target),
			width = target.width(),
			left = target.offset().left - this.grid.headersNode.offset().left;
		!dragNode.hasClass("on") && dragNode.addClass("on");

		if(e.layerX > width/2){
			left+=width+1;
		}	
		moveTopNode.css({
			display : "block",
			left : left +"px"
		});
		moveBottomNode.css({
			display : "block",
			left : left + "px"
		});
	},
	/**
	 * 更改列显示位置
	 * @param oIndex 
	 * @param oViewIndex
	 * @param nIndex
	 * @param nViewIndex
	 */
	exchangePosition : function(oIndex,oLayoutIndex,nIndex,nLayoutIndex){
		var grid = this.grid,
			layout = grid.options.layout;
		function getRealPosition(index,columns){
			var vIndex = 0;
			for(var i=0,column;column=columns[i];i++){
				if(column.hidden) continue;
				if(index==vIndex){
					return i;
				}
				vIndex++;
			}
			return columns.length;
		}
		if(oLayoutIndex==nLayoutIndex){
			var columns = layout[nLayoutIndex][0];
			oIndex = getRealPosition(oIndex,columns);
			nIndex = getRealPosition(nIndex,columns);
			var column = columns[oIndex];
			if(oIndex>nIndex){
				columns.splice(oIndex,1);
				columns.splice(nIndex,0,column);
			}
			else{
				columns.splice(nIndex,0,column);
				columns.splice(oIndex,1);
			}
			
		}
		else{
			if(layout.length-1==oLayoutIndex 
					&& 1== grid.normalView.columns.length){
				alert("至少存在一个可见非锁定列。");
				return; 
			}
			
			var columns = layout[oLayoutIndex][0];
			oIndex = getRealPosition(oIndex,columns);
			var column = columns[oIndex];
			columns.splice(oIndex,1);
			columns = layout[nLayoutIndex][0]
			nIndex = getRealPosition(nIndex,columns);
			columns.splice(nIndex,0,column);
			if(0==layout[oLayoutIndex][0].length){
				layout.splice(oLayoutIndex,1);
			}
		}
		grid.refresh();
	},
	destroy : function(){
		var headersNode = this.grid.headersNode;
		headersNode.unbind("mousedown.grid-draggable");
	}
 };
//注入plugin
$.ui.grid.plugins.register("draggable",$.ui.grid.draggable);

})(jQuery);
