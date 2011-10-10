/*
 * Balancebeam Widget Container 1.0
 *
 * Description : Support percentage width and height
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/jquery/jquery.ui.core.js
 *		balancebeam/lib/jquery/jquery.ui.widget.js
 *		balancebeam/lib/widget/beam.js
 */

 (function( $, undefined ) {
 //容器管理器	
 var layoutManager = new function(){
 	var containers = [];
 	//添加一个新容器
 	this.push = function(layout){
 		containers.push(layout);
 	};
 	//移除指定的容器
 	this.pop = function(layout){
 		for(var i=containers.length-1;i>=0;i--){
 			if(containers[i] == layout){
 				return containers.splice(i,1)[0];
 			}
 		}
 		return null;
 	};
 	//获取直接父容器
 	this.getParent = function(layout){
 		var element = layout.element.parent();
 		while(element.length && !element.is("body")){
 			if(element.hasClass("beam-container")){
 				var widget = $.data(element[0],element.attr("widgetName"));
 				if(widget){
 					return widget;
 				}
 			}
 			element = element.parent();
 		}
 		return null;
 	};
 	//获取直接子容器
 	this.getChildren = function(layout){
 		var children = [];
 		for(var i=0,widget;widget = containers[i];i++){
 			if(layout == widget.getParent()){
 				children.push(widget);
 			}
 		}
 		return children;
 	};
// 	//初始化完毕后执行最外层容器的resize方法
// 	$(function(){
// 		setTimeout(function(){
// 			$.each(containers,function(index,layout){
// 				//如果是最外层容器
// 				if(null==layout.getParent()){
// 					layout.resize();
// 				}
// 			});
// 		},0);
// 	});
 }();	
 
 $.widget("ui.container", {
	options: {
		//宽度
		width : "100%",
		//高度
		height : "auto",
		//上边距
		marginTop : 0,
		//下边距
		marginBottom : 0
	},
	_create : function(){
		this._render();
		this._funnelEvents();
	},
	_render : function() {
		var element = this.element,
			options = this.options;
		 //容器的唯一标识
		element.addClass("beam-container").css({
			width : options.width,
			height : options.height,
			marginTop : options.marginTop + "px",
			marginBottom : options.marginBottom + "px"
		})
		.attr("widgetName",this.widgetName); //给容器增加组件类型的属性
		
		layoutManager.push(this);
		this.render();
	},
	//overwrite
	render : function(){
		//子容器其他节点渲染
	},
	//绑定事件
	_funnelEvents : function(){
		if(null==this.getParent()){ //只有外层容器需要监听window的onresize方法
			var self = this;
			$(window).bind("resize."+this.element.attr("id"),function(){
				clearTimeout(self.durhandle); //防止IE同时执行两遍resize操作
				self.durhandle = setTimeout(function(){
					self.resize(true);
				},0);
			});
		}
		this.funnelEvents();
	},
	//overwrite
	funnelEvents : function(){
		//子容器的其他事件绑定
	},
	//获取直接父容器
	getParent : function(){
		return layoutManager.getParent(this);
	},
	//获取直接子容器
	getChildren : function(element){
		var children =  layoutManager.getChildren(this);
		if(null==element){
			return children;
		}
		var result = [];
		$.each(children,function(index,child){
			if(jQuery.contains(element,child.element)){
				result.push(child);
			}
		});
		return result;
	},
	//是不是百分比高度容器
	isPercentHeight  : function(){
		return String(this.options.height).indexOf("%")>0;
	},
	//销毁与window事件绑定
	destroy : function(){
		if(null==this.getParent()){
			$(window).unbind("resize."+this.element.attr("id"));
		}
	},
	//调整子容器,子类复写改方法
	resize : function(/**是否由window触发的resize **/wr){
		$.each(this.getChildren(),function(index,child){
			child.resize(wr);
		});
	},
	//调整自身，通知到父容器
	notifyParentResize : function(){
		var parent = this.getParent();
		if(parent){
			parent.notifyParentResize(this);
		}
	}
});

})(jQuery);