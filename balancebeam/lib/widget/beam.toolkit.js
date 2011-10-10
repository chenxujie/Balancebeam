/*
 * Balancebeam Toolkit 1.0
 *
 * Description : Various tools
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/jquery.js
 */
 (function($){

//获取应用的上下文路径 	
$.getContextPath = function(){
	/**
	 * ip address such as :
	 * http://192.168.1.1/framework/balancbeam/lib/jquery.js
	 * http://192.168.1.1/balancbeam/lib/jquery.js
	 * http://www.balancebeam.cc/framework/balancbeam/lib/jquery.js
	 * http://www.balancebeam.cc/balancbeam/lib/jquery.js
	 */
	var head = document.getElementsByTagName("head")[0],
		scripts = head.getElementsByTagName("script");
	for(var i=0,script,src,matcher;script=scripts[i];i++){
		if((src = script.src) && (matcher = src.match(/\/jquery[^\/]*\.js$/i))){
			var contextPath = "";
			//采用的是相对路径
			if(!/(^\/)|(^http)/.test(script.getAttribute("src"))){
				contextPath = src.substring(0,src.lastIndexOf("/")+1) + "../../";
			}
			else{
				src = src.substring(0,src.indexOf("/balancebeam/lib"));
				contextPath = src +"/";
			}
			return ($.getContextPath= function(){
				return contextPath;
			})();
		}
	}
	throw new Error("miss jQuery lib,can not to analysis application context path.");
};
$.mask = new function(){
	var pageMask = null;
	//显示页面遮挡层
	this.showPageMask = function(zIndex){
		pageMask = pageMask || $("<div class='beam-pagemask'></div>").appendTo('body'); 
		zIndex && pageMask.css("zIndex",zIndex);
		pageMask.show();
	};
	//隐藏页面遮挡层
	this.hidePageMask = function(){
		pageMask && pageMask.hide();
	}
	
	var ajaxMask = null;
	//显示ajax请求遮挡层
	this.showAjaxMask = function(){
		if(!ajaxMask){
			var html = ["<div class='beam-ajaxmask'>"];
			html.push("<div class='mask'></div>");
			html.push("<div class='detail'>");
			html.push("<div class='shift'>");
			html.push("<label>正在加载请稍候...</label>");
			html.push("</div>");
			html.push("</div>");
			html.push("</div>");
			ajaxMask = $(html.join("")).appendTo('body'); 
		}
		ajaxMask.show();
	}
	//隐藏ajax请求遮挡层
	this.hideAjaxMask = function(){
		ajaxMask && ajaxMask.hide();
	}
	//显示容器的进度条
	var boxLoading = null;
	this.showBoxLoading = function(box){
		if(!boxLoading){
			boxLoading = $("<div class='beam-boxloading'></div>");
		}
		boxLoading.appendTo(box); 
		boxLoading.show();
	}
	this.hideBoxLoading = function(){
		if(boxLoading){
			boxLoading.remove(); 
			boxLoading.hide();
		}
	}
}();
//停止冒泡
$.stopEvent = function(e){
	e.stopPropagation(); 
	e.preventDefault();
};
//转换模板，返回transformer
$.transformTemplate = function(templateString){
	/**
	 * var template = "<div class='#{className}'><lable>#{content}</label></div>";
	 * var transform = $.transformTemplate(template);
	 * var html = transform({className : "welcome",content:"hello world."});  
	 * 
	 * 		or
	 * var template = "<div class='#{0}'><lable>#{1}</label></div>";
	 * var transform = $.transformTemplate(template);
	 * var html = transform([ "welcome","hello world."]);  
	 */
	var str = templateString, 
		expression = /#\{[<>a-zA-Z0-9]+\}/,
		substitute =  /(#\{)|(\})/g,
		markup = [],
		mapping =[]
		r = null;
	while(r = str.match(expression)){
		var index = r.index;
		if(index!=0){
			markup.push(str.substring(0,index));
		}
		mapping.push([markup.length,r[0].replace(substitute,"")]);
		markup.push(r[0]);
		str = str.substring(index+r[0].length);
	}
	str!="" && markup.push(str);
	return function(data){
			var html = [];
			for(var i=0,map;map =mapping[i];i++){
				var index = map[0],
			  	name = map[1],
			  	value = data[name]!=null ? String(data[name]) : "&nbsp;";
				markup[index] = value;
			}	
			html.push(markup.join(""));
			return html.join("");
		}
};
//获取幂级父节点
$.getPowerParent = function(node,power){
	while(power--){
		node = node.parentNode;
	}
	return node;
}
//获取最外层top帧
$.getTop = function(){
	var win = window.opener || window;
	try{
		win.top.navigator;
		return win.top;
	}catch(e){
		try{
			do{
				var pwin = win.parent;
				pwin.navigator;
				win = pwin;
			}while(win);
		}catch(e1){
			return win;
		}
	}
}
//把数组转换成对象
$.array2obj = function(array){
	var obj = {};
	for(var i = array.length -1; i>=0;i--){
		obj[array[i]] = 1;
	}
	return obj;
}
//获取参数，如果有回调方法则执行
$.getParameters = function(parameters){
	var data = {};
	for(var name in parameters){
		data[name] =  jQuery.isFunction(parameters[name]) ? parameters[name]() : parameters[name];
	}
	return data;
}
$.getBlankIcon = function(){
	return "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
}
 	
 })(jQuery);