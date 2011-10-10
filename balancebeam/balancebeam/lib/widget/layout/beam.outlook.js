/*
 * Balancebeam Widget Outlook 1.0
 *
 * Description : Support Outlook style menu
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
 
 $.widget("ui.outlook", $.ui.container,{
	options: {
		 //唯一标识字段
		id : "id", 
		//标题字段
		title : "title", 
		//选择字段
		selected : "selected", 
		 //参数字段
		parameters : "parameters",
		//图标字段
		icon : "icon", 
		//连接地址
		href : "href", 
		//菜单表头高度
		headHeight : 26,  
		//数据源
		dataProvider : [], 
		 //异步获取数据方法
		xhr : null
	},
	render : function() {
		//创建展现节点
		var element = this.element,
			fragment = document.createDocumentFragment(),
			options = this.options,
			dataProvider = options.dataProvider,
			selectedMenu = null,
			self = this;
		element.addClass("beam-outlook");
		//隐藏子节点
		element.children().hide();
		$.each(dataProvider,function(index,menu){
			var element = $("<div class='menu'></div>");
			element.append($("<div class='head'>"+self.getMenuIcon(menu)+"<div class='caption'>"+menu[options.title]+"</div></div>"))
				.append($("<div class='box'></div>"))
				.attr("menuIndex",index);
			
			menu[options.id] && element.attr("id",menu[options.id]);
			fragment.appendChild(element[0]);
			if(menu[options.selected] || !selectedMenu){
				selectedMenu = element;
			}
		});
		//选中展开指定节点
		selectedMenu.addClass("on");
		element.prepend(fragment);
		this.load(selectedMenu);
	},
	//菜单项的图标标识
	getMenuIcon : function(menu){
		var icon = this.options.icon;
		return "<div class='icon " + (icon || "") + "'></div>";
	},
	//绑定事件
	funnelEvents : function(){
		var self = this;
		this.element.click(function(e){
			var element = $(e.target);
			while(element[0]!=this){
				if(element.hasClass("head")){
					if(element.parent().parent()[0]==this){
						self.toggle(element.parent());
						break;
					}
				}
				element = element.parent();
			}
		});
	},
	//展开某个菜单项
	toggle : function(element){
		if(element.hasClass("on")) return;
		var selectedMenu = $(">.on",this.element),
			ni = $(">.box",element),
			oi = $(">.box",selectedMenu);
		selectedMenu.removeClass("on");
		element.addClass("on");
		this.load(element);
		this.resize();
		var self = this, 
			h = this.boxHeight,
			step = 40;
		(function(){
		   var func = arguments.callee;
		   if((h = h - step)<1){
		   		oi.height(0);
		   		ni.height(self.boxHeight);
		   		return ;
		   }
		   oi.height(h);
		   ni.height(self.boxHeight-h);
		   setTimeout(function(){
				func();
			},1);
		})();
	},
	//调整展现区域的高度大小
	resize : function(){ 
		//及时的设置高度
		if(this.isPercentHeight() || this.boxHeight==null){
			var options = this.options,
			height = this.element.height(),
			dataProvider = options.dataProvider;
			this.boxHeight = (height- options.headHeight * dataProvider.length-2) ;
		}
		var element = $(">.on>.box",this.element);
		element.height(this.boxHeight);
		//调整子容器
		$.each(this.getChildren(element),function(index,child){
			child.resize();
		});
	},
	//显示某菜单项
	showMenu : function(id){
		this.toggle($("#".concat(id)));
	},
	//初始化指定项中的内容
	load : function(element){
		var options = this.options, 
			dataProvider = options.dataProvider,
			menuIndex = element.attr("menuIndex"),
			menu = dataProvider[menuIndex],
			box = $(">.box",element);
		if(box.children().length) return;
		var href = menu[options.href];
		if(href==null){
			options.xhr && 
				options.xhr(function(node){
				box.append(node || document.createTextNode("&nbsp;"));
			});
		}
		else if(href.indexOf("#")==0){
			var node = $(href);
			box.append(node);
			node.css("display","block");
		}
		else if(href.indexOf("javascript:")==0){
			var result = /\(\S*\)/.test(href)?  eval(href) : window[href.replace(/(^javascript:)|(;$)/g,"")].call(window,menu);
			result = result || document.createTextNode("&nbsp;");
			box.append(result);
		}
		else{
			//显示进度条
			$.mask.showBoxLoading(box);
			var parameters = $.getParameters(menu[options.parameters]);
			$.ajax({
				url : href,
				data : parameters,
				success : function(html){
					$.mask.hideBoxLoading();
					box.html(html);
				}
			});
		}
	}
 });
 
 })(jQuery);