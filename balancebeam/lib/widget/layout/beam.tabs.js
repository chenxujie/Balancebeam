/*
 * Balancebeam Widget Tab 1.0
 *
 * Description : Support Tabbing navigator
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
 
 $.widget("ui.tabs", $.ui.container,{
	options: {
		title : "title",
		selected : "selected",
		parameters : "parameters",
		icon : "icon",
		href : "href",
		iframe : false,
		dataProvider : []
	},
	render : function() {
		var element = this.element,
			options = this.options;
		element.addClass("beam-tabs");
		//隐藏原始子节点
		element.children().hide();
		this.boxs = [];
		var head = $("<div class='head'></div>"),
			menus = $("<ul></ul>"),
			fragment = document.createDocumentFragment(),
			self = this,
			selectedMenu = null;
		//构建所有菜单项
		$.each(options.dataProvider,function(index,menu){
			var element = self.createMenu(menu);
			menus.append(element);
			if(menu[options.selected] || !selectedMenu){
				selectedMenu = element;
			}
		});
		head.append(menus);
		fragment.appendChild(head[0]);
		var boxs = $("<div class='boxs'></div>");
		fragment.appendChild(boxs[0]);
		this.element.prepend(fragment);
		selectedMenu.addClass("on");
		this.showBox(selectedMenu.index());
	},
	//创建菜单项
	createMenu : function(data){
		var options = this.options;
		return $("<li><a href='javascript:void(0);'><span>"+data[options.title]+"</span></a></li>");
	},
	//绑定事件
	funnelEvents : function(){
		var self = this;
		this.element.click(function(e){
			var element = $(e.target);
			while(element[0]!=this){
				if(element.is("li")){
					self.toggle(element);
					break;
				}
				element = element.parent();
			}
		});
	},
	//切换tab操作
	toggle : function(element){
		var selectedMenu = $(">.head>ul>li.on",this.element);
		if(selectedMenu[0]==element[0]) return;
		//如果选中的不为空
		if(selectedMenu.length){
			selectedMenu.removeClass("on");
			this.hideBox(selectedMenu.index());
		}
		element.addClass("on");
		this.showBox(element.index());
		this.resize();
	},
	//隐藏指定内容
	hideBox : function(index){
		var box = this.boxs[index],
			options = this.options;
		if(box.hasClass("static-page")){
			box.hide();
			return;
		}
		//重新加载
		if(options.reloading){
			delete this.boxs[menuIndex];
			box.remove();
		}
		else{
			box.hide();
		}
	},
	//显示指定内容
	showBox : function(index){
		var box = this.boxs[index];
		if(box!=null){
			box.show();
			return;
		}
		var options = this.options;
			element = this.element,
			menu = options.dataProvider[index],
			href = menu[options.href];
			self = this,
			box = $("<div class='box'></div>");
			$(">.boxs",element).append(box);
			this.boxs[index] = box;
			if(href==null){
				options.xhr && 
					options.xhr(function(node){
					box.append(node || document.createTextNode("&nbsp;"));
				});
			}
			else if(href.indexOf("#")==0){
				var node = $(href);
				box.append(node);
				node.show();
			}
			else if(href.indexOf("javascript:")==0){
				var result = /\(\S*\)/.test(href)?  eval(href) : window[href.replace(/(^javascript:)|(;$)/g,"")].call(window,menu);
				result = result || document.createTextNode("&nbsp;");
				box.append(result);
			}
			else{
				var parameters = $.getParameters(menu[options.parameters]);
				//如果使用的是iframe
				if(options.iframe){
					var iframe = $("<iframe frameborder=0 frameSpacing=0 width='100%' height='100%'></iframe>"),
						data = [];
					for(var key in parameters){
						data.push(key+"="+parameters[key]);
					}
					iframe.attr("src", href +(href.lastIndexOf("?")>0 ? "&" : "?" )+data.join("&"));
					box.append(iframe);
					return;
				}
				//显示进度条
				$.mask.showBoxLoading(box);
				$.ajax({
					url : href,
					data : parameters,
					success : function(html){
						$.mask.hideBoxLoading();
						box.html(html);
					}
				});
		}
	},
	//调整展现区域的高度大小
	resize : function(){
		if(this.isPercentHeight() || this.boxHeight==null){
			var options = this.options,
				element = this.element,
				height = element.height() - $(">.head",element).height() -1;
			//及时的设置高度
			$(">.boxs",element).height(height);
		}
		var box = this.boxs[$(">.head>ul>li.on",this.element).index()];
		//调整子容器
		$.each(this.getChildren(box),function(index,child){
			child.resize();
		});
	}
 });
 
})(jQuery);
