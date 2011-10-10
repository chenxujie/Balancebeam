/*
 * Balancebeam Widget Titlepane 1.0
 *
 * Description : Support flexible container
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/jquery/jquery.ui.core.js
 *		balancebeam/lib/jquery/jquery.ui.widget.js
 *		balancebeam/lib/widget/beam.toolkit.js
 * 		balancebeam/lib/widget/layout/beam.container.js
 */

 (function( $, undefined ) {
	 
 $.widget("ui.titlepane",$.ui.container, {
	options: {
		title : "标题",
		//默认是否打开的
		expanded : true,
		//是否能进行打开和关闭操作
		toggleable : true,
		//页面初始化回调
		onInit : null,
		//打开时的回调
		onExpand : null,
		//关闭时的回调
		onCollapse : null
	},
	render : function(){
		var element = this.element,
			options = this.options,
			head = $("<div class='head'>" +
				"<div class='toggle'></div>" + 
				"<div class='caption'>" + options.title + "</div>" + 
				"<div class='buttons'>"+this.generateButtons() + "</div>" + 
				"</div>"),
			box = $("<div class='box'></div>"),
			node = element[0];
		options.expanded ? $(">.toggle",head).addClass("on") :  box.hide();
		element.addClass("beam-titlepane");
		while(node.hasChildNodes()){
			box.append(node.firstChild);
		}
		element.append(head).append(box);
	},
	//调整展现区域的高度大小
	resize : function(){
		var height = this.options.height,
			element = this.element;
		//如果是百分高度或者固定高度修正容器的高度
		if(height != "auto"){
			element.height(height);
			var h = element.height();
			element.height("auto");
			$(">.box",element).height(h - $(">.head",element).height());
		}
		$.each(this.getChildren(),function(index,child){
			child.resize();
		});
	},
	//生成辅助按钮
	generateButtons : function(){
		return "";
	},
	//绑定事件
	funnelEvents : function(){
		var self = this;
		$(">.head",this.element).click(function(e){
			self.toggle();
		});
	},
	//打开或关闭
	toggle : function(){
		if(this.options.toggleable==false) return;
		var toggle = $(">.head>.toggle",this.element),self = this;
		if(toggle.hasClass("on")){
			toggle.removeClass("on");
			$(">.box",this.element).slideUp("normal",function(){
				self.onCollapse && self.onCollapse();
				//通知父亲
				self.notifyParentResize();
			});
		}
		else{
			toggle.addClass("on");
			$(">.box",this.element).slideDown("normal",function(){
				self.onExpand && self.onExpand();
				//通知父亲
				self.notifyParentResize();
			});
		}
		
	},
	//打开
	expand : function(){
		var toggle = $(">.head>.toggle",this.element);
		if(!toggle.hasClass("on")){
			this.toggle();
		}
	},
	//关闭
	collapse : function(){
		var toggle = $(">.head>.toggle",this.element);
		if(toggle.hasClass("on")){
			this.toggle();
		}
	}
});

})(jQuery);