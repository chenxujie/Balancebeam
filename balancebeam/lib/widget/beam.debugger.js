/*
 * Balancebeam Debugger 1.0
 *
 * Description : Support debug Javascript
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/jquery.js
 */
(function($){
var debugNodes = [];	
var popup = null;

function executeScript(){
	var value = $("div.operation textarea",popup).val();
	if(value=="") return;
	var showFunction = $("input:checkbox",popup).attr("checked");
	try{
		var json = eval("("+value+")");
		if(json==null) return;
		var instance = new debugging(json,showFunction);
		popup.children(".exhibition").append(instance.create());
	}catch(e){
		alert(e.message);
	}
}
function isEmpty(o){
	switch(typeof(o)){
		case "array" :
			return 0==o.length;
		case "object" : 
			for(var name in o){
				return false
			}
		default :
			return true;
	}
}
function clearScript(){
	$("div.exhibition",popup).html("");
	debugNodes.splice(0,debugNodes.length);
}
function queryKey(){
	var key = $("div.operation textarea",popup).val();
	if(key=="" || !debugNodes.length) return;
	var result = debugNodes[0].search(key);
	var showFunction = $("input:checkbox",popup).attr("checked");
	var instance = new debugging(result,showFunction);
	popup.children(".exhibition").append(instance.create());
}
function queryValue(){
	var value = $("div.operation textarea",popup).val();
	if(value=="" || !debugNodes.length) return;
	var result = debugNodes[0].search(value,true);
	var showFunction = $("input:checkbox",popup).attr("checked");
	var instance = new debugging(result,showFunction);
	popup.children(".exhibition").append(instance.create());
}
function closeDebugger(){
	popup.hide();
}
$.debug = function(json){
	if(popup==null && (popup= $("<div class='beam-debugger'></div>"))){ 
		popup.html("<div class='operation'>" +
				"<textarea></textarea>" +
				"<div class='close' title='关闭调试器' event='closeDebugger()'>×</div>" +
				"<div class='instruction'>" +
					"<div class='static'>" +
						"<label>说明：</label>" + 
						"<span class='basic object'>&nbsp;</span>对象" + 
						"<span class='basic array'>&nbsp;</span>数组" + 
						"<span class='basic string'>&nbsp;</span>字符串" +
						"<span class='basic number'>&nbsp;</span>数值" + 
						"<span class='basic boolean'>&nbsp;</span>布尔" +
						"<span class='basic function'>&nbsp;</span>方法" + 
						"(&nbsp;<input type='checkbox' name='showFunction'>显示&nbsp;)" +
					"</div>" +
					"<div class='button'>" +
						"<button event='executeScript()'>执行脚本</button>" +
						"<button event='clearScript()'>清空脚本</button>" +
						"<button event='queryKey()'>&nbsp;键查询&nbsp;</button>" +
						"<button event='queryValue()'>&nbsp;值查询&nbsp;</button>" +
					"</div>" +
				"</div>" +
				"</div>" +
				"<div class='exhibition'></div>");
		if($.fn.draggable){
			popup.draggable({handle : ">.operation"});
		}
		popup.children(".operation")
			.click(function(evt){
				var target = $(evt.target);
				var op = target.attr("event");
				if(op==null) return;
				eval("("+op+")");
		});
		popup.appendTo("body");
	}
	popup.css({
		top : "50px",
		left : "50px",
		display : "block"
	});
	if(json==null) return;
	var instance = new debugging(json);
	popup.children(".exhibition").append(instance.create());
};	
function debugging(json,showFunction){
	if(typeof(json)=="string"){
		try{
			json = eval("("+json+")");
		}catch(e){
			json = {"非json格式数据" : json};
		}
	}
	this.json = json;
	this.showFunction = showFunction;
};
debugging.prototype = {
	create : function(){
		var div =$("<div class='json'></div>");
		var ul =$("<ul class='tree'></ul>");
		this.render("数据结构：",this.json,ul);
		div.append(ul);
		$("<div class='close'>×</div>")
			.click(function(evt){
				var node = $(this).parent(),
					nodes = node.parent().children();
				debugNodes.splice(nodes.index(node),1);
				node.remove();
			})
			.appendTo(div);
		debugNodes.push(this);
		return div;
	},
	getJson : function(){
		return this.json;
	},
	/**
	 * @summary:
	 * 		渲染json树方法
	 * @param:
	 * 		{String} label 节点名称
	 * @param: 
	 * 		{Object} json json对象
	 * @param:
	 * 		{Object} ul 父节点HTMLUlElement对象
 	 */
	render :  function(label,json,ul){ 
		var type = typeof(json);
		if(type=="object" || type=="array"){		
			var li = $("<li></li>");
			if(!isEmpty(json)){
				var self = this;
				$("<span class='plus bullet'>&nbsp;</span>")
					.click(function(evt){
						var element = $(this),
							subElement = element.parent().children("ul");
						if(!subElement.length){
							subElement = $("<ul></ul>");
							for(var key  in json){
								try{
									self.render(key,json[key],subElement);
								}catch(e){}
							}
							li.append(subElement);
						}
						if(element.hasClass("minus")){
							element.removeClass("minus")
								.addClass("plus");
							subElement.hide();
						}
						else{
							element.removeClass("plus")
								.addClass("minus");
							subElement.show();
						}
					})
					.appendTo(li);			
			}
			li.append($("<span class='basic'>&nbsp;</span>")
				.addClass(typeof(json)=="array"?"array" : "object"))
				.append($("<span class='text'>"+label+"</span>"))
				.appendTo(ul);
		}
		else{
			var className = "basic ",text = "";
			switch(type){
				case "string" :
					className+="string";
					text = "'"+ json +"'";
					break;
				case "number":
					className+="number";
					text =  json ;
					break;
				case "boolean" :
					className+="boolean";
					text =  json ;
					break;
				case "function" :
					className+="function";
					text = json.toString();
					text = text.substring(0,text.indexOf("{"));
					if(!this.showFunction){ return ;}
					break;
				default : 
					if(label.indexOf("on")==0){ 
						className+="function";
						text = "Function";
						if(!this.showFunction){ return ;}
					}
					else{
						className+="null";
						text = "null";
					}
					break;
			}
			$("<li></li>")
				.append($("<span class='"+className+"'>&nbsp;</span>"))
				.append($("<span class='text'>"+label +" : " +"<span CONTENTEDITABLE>"+text+"</span>"+"</span>"))
				.appendTo(ul);
		}
	},
	search : function(key,kv){
		var values = [],stack =[],json =this.getJson();
		this._search(key,json,stack,values,kv);
		return values;
	},
	_search : function(key,json,stack,values,kv){
		if(json==null) return;
		var type = typeof(json);
		if(type!="array" && type!="object"){
			if(json === key){
				values.push(json);
			}
			return;
		}
		for(var i=0;i<stack.length;i++){
			if(stack[i] == json) return;
		}
		stack.push(json);
		if(type=="object"){
			for(var name in json){
				try{
					if(kv){
						if(String(json[name]) == String(key)){
							values.push(json);
						}
					}
					else{
						if(name == key){ 
							values.push(json[name]);
						}
					}
					this._search(key,json[name],stack,values,kv);
				}catch(e){}
			}
		}
		else{
			for(var i=0;i<json.length;i++){
				if(kv){
					if(json[i] === key){
						values.push(json);
					}
				}
				this._search(key,json[i],stack,values,kv);
			}
		}
	}
};
})(jQuery);
