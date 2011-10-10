/*
 * Balancebeam Widget Dialog 1.0
 *
 * Description : Support open modal Dialog
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
 
var dialogzIndex = 100;
function getzIndex(){
	var c = dialogzIndex;
	dialogzIndex +=2;
	return c;
}
	 
 $.widget("ui.dialog", {
	options: {
		//标题
		title : "对话窗口",
		//最小宽度
		minWidth : 200,
		//宽度
		width : 500,
		//最小高度
		minHeight : 100,
		//高度
		height : 300,
		//请求地址
		href : null,
		//传递参数
		parameters : null,
		//是否使用iframe加载页面
		iframe : false,
		//根据内容自适应大小
		suitable : false,
		//拖拽
		draggable : true,
		//改变大小
		resizable : true,
		//模态窗口
		modal : true,
		//打开后重新加载
		reload : false,
		//异步加载
		xhr : null,
		//打开窗口的位置
		position : {
			left : "50px",
			top : "50px"
		}
	},
	_create : function(){
		this._render();
		this._funnelEvents();
	},
	//构造notice的展现结构
	_render : function() {
		this.zIndex = getzIndex();
		var element = this.element,
			options = this.options,
			node = element[0],
			fragment = document.createDocumentFragment();
		while(node.hasChildNodes()){
			fragment.appendChild(node.firstChild);
		}
		element.addClass("beam-dialog");
		element.css("zIndex",this.zIndex+1);
		var html = ["<div class='resize'></div>"];
		html.push("<div class='tb'>");
		html.push("<div class='tbr'>" );
		html.push("<div class='tbc'></div>" );
		html.push("</div>");
		html.push("</div>");
		html.push("<div class='cb'>");
		html.push("<div class='cbl'></div>" );
		html.push("<div class='cbr'></div>" );
		html.push("<div class='cbc'>" );
		html.push("<div class='head'>");
		html.push("<div class='close'></div>");
		html.push(options.title);
		html.push("</div>");
		html.push("<div class='box'>");
		html.push("<div class='content'>");
		html.push("</div>");
		html.push("</div>");
		html.push("</div>");
		html.push("</div>");
		html.push("<div class='bb'>");
		html.push("<div class='bbr'>" );
		html.push("<div class='bbc'></div>" );
		html.push("</div>");
		html.push("</div>");
		element.html(html.join(""));
		$(">.cb>.cbc>.box>.content",element).append(fragment);
		this._setResizeoffset(options.width,options.height);
		this._renderMask();
	},
	//创建遮挡层
	_renderMask : function(){
		if(this.options.modal){
			this.mask = $("<div class='beam-dialog-mask'></div>");
			this.mask.css("zIndex",this.zIndex);
			this.mask.appendTo('body');
		}
	},
	//设置拖动层得宽高
	_setResizeoffset : function(width,height){
		var resizeElement = $(">.resize",this.element),
			options = this.options;
		resizeElement.width(Math.max(width,options.minWidth));
		resizeElement.height(Math.max(height,options.minHeight));
	},
	//设置显示内容的宽和高
	setContentoffset : function(width,height){
		this._setResizeoffset(width+12,height+33);
		this._fdwh();
	},
	//设置高度和宽度 fitDialogWidth&Height
	_fdwh : function(){
		var element = this.element,
			position = this.options.position,
			resizeElement = $(">.resize",element),
			width = parseInt(resizeElement.css("width"),10),
			height = parseInt(resizeElement.css("height"),10),
			top = parseInt(resizeElement.css("top"),10),
			left = parseInt(resizeElement.css("left"),10);
		resizeElement.css("top","0px");
		resizeElement.css("left","0px");
		element.css("top",(parseInt(element.css("top"),10)+ top) +"px");
		element.css("left",(parseInt(element.css("left"),10)+ left) +"px");
		element.width(width);
		element.height(height);
		$(">.cb",element).height(height-10);
		$(">.cb>.cbc>.box",element).height(height-33);
	},
	//绑定事件
	_funnelEvents : function(){
		var self = this,
			options = this.options,
			element = this.element;
		$(">.cb>.cbc>.head>.close",element).click(function(e){
			self.hide();
		});
		//拖拽窗口
		if(options.draggable && $.fn.draggable){
			$(">.cb>.cbc>.head",element).addClass("draggable");
			element.draggable({
				cancel: ">.cb>.cbc>.head>.close",
				handle : ">.cb>.cbc>.head",
				start: function(event, ui) {
					$(">.cb>.cbc>.head>.close",element).hide();
					$(">.cb>.cbc>.box>.content",element).hide();
					element.css("opacity",0.7);
				},
				stop: function(event,ui) {
					$(">.cb>.cbc>.head>.close",element).show();
					$(">.cb>.cbc>.box>.content",element).show();
					element.css("opacity",1);
			}});
		}
		//如果自适应宽高没有reisize的功能
		if (!options.suitable && 
				options.resizable && 
				$.fn.resizable) {
			var resizeElement = $(">.resize",element);
			resizeElement.resizable({
				handles: "n,e,s,w,se,sw,ne,nw",
				minWidth : options.minWidth,
				minHeight : options.minHeight,
				start : function(event,ui){
					resizeElement.css("visibility","visible");
				},
				stop : function(event,ui){
					resizeElement.css("visibility","hidden");
					self._fdwh();
				}
			});
		}
	},
	//加载数据
	load : function(){
		var options = this.options,
			href = options.href,
			iframe = options.iframe,
			self = this;
		//是否需要重新加载页面
		if(!options.reload){
			if(this._hasInit){
				return;
			}
		}
		//设置固定宽高活百分比
		if(!options.suitable){ 
			this._fdwh();
		}
		//如果请求页面的地址不为空
		if(href!=null){
			var content = $(">.cb>.cbc>.box>.content",this.element),
				loading = $("<div class='loading'></div>");
			if(iframe){
				var iframeElement = $(">iframe",content);
				if(!iframeElement.length){
					content.empty();
					iframeElement = $("<iframe frameBorder='0'></iframe>");
					iframeElement.bind("load",function(){
						if(iframeElement.loaded) return;
						iframeElement.loaded = true;
						$(">.loading",content).remove();
						self.suitableoffset();
					});
					iframeElement.bind("readystatechange",function(e){
						if(this.readyState == "complete" || this.readyState == "loaded"){
							if(iframeElement.loaded) return;
							iframeElement.loaded = true;
							$(">.loading",content).remove();
							self.suitableoffset();
						}
					});
					content.append(iframeElement);
				}
				content.append(loading);
				//TODO 支持form方式post提交数据
				iframeElement.attr("src",href);
			}
			else{
				content.empty();
				content.append(loading);
				$.ajax({
					url : href,
					dataType : "html",
					data : $.getParameters(options.parameters),
					success : function(html){
						content.empty();
						content.html(html);
						self.suitableoffset();
					}
				});
			}
			return;
		}
		else if(options.xhr!=null){
			var content = $(">.cb>.cbc>.box>.content",this.element);
			options.xhr(function(node){
				content.empty();
				content.append(node || document.createTextNode("&nbsp;"));
			});
		}
		//当前页面内容调整offset
		this.suitableoffset();
	},
	//自适应内容高度和宽度
	suitableoffset : function(){
		var options = this.options;
		if(options.suitable){
			var content = $(">.cb>.cbc>.box>.content",this.element), width =0  ,height = 0;
			try{
				if(options.iframe){
					var iframeElement = $(">iframe",content)[0];
						var children = $(iframeElement.contentWindow.document.body).children();
						$.each(children,function(index,child){
							child = $(child);
							width = Math.max(width,child.width());
							height += child.height();
						});
				}
				else{
					content.css({
						width : "auto",
						height : "auto",
						overflow : "hidden"
					});
					width = content.width();
					height = content.height();
					content.css({
						width : "100%",
						height : "100%",
						overflow : "visible"
					});
				}
				this.setContentoffset(width,height);
			}catch(e){
				this._fdwh();
			}
		}
		if(!this._hasInit){
			var position = options.position,
				element = this.element,
				width = element.width(),
				height = element.height();
			if("center" == position.left){
				var w = $(document.documentElement).width();
				this.element.css("left",Math.floor((w - width)/2)+"px");
			}
			else{
				this.element.css("left",position.left);
			}
			if("center" == position.top){
				var h = $(document.documentElement).height();
				this.element.css("top",Math.floor((h - height)/2)+"px");
			}
			else{
				this.element.css("top",position.top);
			}
			this._hasInit = true;
		}
	},
	//显示窗口
	show : function(){
		if(this.options.modal){
			this.mask.show();
		}
		//显示窗口
		this.element.show();
		//加载页面
		this.load();
	},
	//隐藏窗口
	hide : function(){
		if(this.options.modal){
			this.mask.hide();
		}
		this.element.hide();
	}
});
})(jQuery);