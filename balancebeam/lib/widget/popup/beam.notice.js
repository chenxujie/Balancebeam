/*
 * Balancebeam Widget Notice 1.0
 *
 * Description : Support prompt window
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/jquery/jquery.ui.core.js
 *		balancebeam/lib/jquery/jquery.ui.widget.js
 *		balancebeam/lib/widget/beam.toolkit.js
 */
 
 (function( $, undefined ) {
 
 $.widget("ui.notice", {
	options: {
		//标题
		title : "信息提示",
		//宽度
		width : 218,
		//高度
		height : 200,
		//话题个数
		topics : 5,
		//自动关闭
		autoCollapse : true, 
		//延迟毫秒数
		delayms : 5000
	},
	_create : function(){
		this._render();
		this._funnelEvents();
	},
	//构造notice的展现结构
	_render : function() {
		var element = this.element;
		element.addClass("beam-notice");
		var html = ["<div class='head'>"];
		html.push("<div class='toggle'></div>");
		html.push("<div class='caption'>"+this.options.title+"</div>");
		html.push("</div>");
		html.push("<div class='box'><ul></ul></div>");
		element.html(html.join(""));
		element.children(".box").css("height", (this.option.height-28) + "px");
	},
	//绑定事件
	_funnelEvents : function(){
		var self = this;
		$(">.head>.toggle",this.element).click(function(evt){
			var element = $(this);
			element.hasClass("on") ? self.hide() : self.show();
		});
	},
	//显示通知窗口
	show : function(){
		var options = this.options,
			element = this.element;
		//如果是自动关闭
		if(options.autoCollapse){
			var self = this;
			clearTimeout(this.handle);
			this.handle = setTimeout(function(){
				self.hide();
			},options.delayms);
		}
		//停止动画
		element.stop();
		var toggle = $(">.head>.toggle",element);
		if(toggle.hasClass("on")){
			return;
		}
		element.animate({    
		    width : options.width + "px",   
			height : options.height + "px"
		},600) ;
		toggle.addClass("on");
	},
	//隐藏通知窗口
	hide : function(){
		var element = this.element;
		clearTimeout(this.handle);
		var toggle = $(">.head>.toggle",element);
		if(!toggle.hasClass("on")){
			return;
		}
		element.stop();
		element.animate({    
		    width: "100px",   
			height:  "28px"
		},600)  ;
		toggle.removeClass("on");
	},
	//添加一个话题
	add : function(html){
		this.show();
		var element = this.element;
		var topics = $(">.box>ul>li",element);
		//对于最后一条topic进行删除操作
		if(topics.length >= this.options.topics){
			$(topics.get(this.options.topics-1)).remove();
		}
		var topic = $("<li>"+html+"</li>");
		topic.prependTo($(">.box>ul",element));
		topic.animate({height: 'toggle',opacity: 'toggle'}, { duration: "slow" }); 
	},
	//删除指定的话题
	remove : function(index){
		$(">.box>ul>li",this.element).get(index).remove();
	}
});

})(jQuery);