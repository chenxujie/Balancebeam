/*
 * Balancebeam Widget Menu 1.0
 *
 * Description : Support horizontal and vertical drop down menu
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
 
 $.widget("ui.menu", {
	options: {
		dataProvider : [],
		menuBar : {
			width : "auto",
			itemWidth : 70
		},
		doClick : function(data){}
	},
	_create : function(){
		var options = this.options;
		this.menuboxs = {};
		this.menuitems = {};
		this.rootMenuBox = options.menuBar ?
			this.createBarMenuBox(options.dataProvider) :  
			this.createPopMenuBox(options.dataProvider,"") ;
		this.element
			.addClass("beam-menu")
			.append(this.rootMenuBox);
		this._funnelEvents();
	},
	//创建一级导航菜单
	createBarMenuBox : function(dataProvider){
		var html = [];
		html.push("<div class='menu-bar'>");
		html.push("<div class='lholder'></div>");
		html.push("<div class='rholder'></div>");
		html.push("<div class='inner'>");
		for(var i=0,item;item = dataProvider[i];i++){
			if(item.seperator){
				continue;
			}
			html.push("<div class='menu-item");
			html.push(item.disabled?" disabled' disabled=true ":"'");
			html.push(" menuItemId='");
			html.push(item.id);
			html.push("'>");
			html.push("<a class='menu-item-link' href='#' unselectable='on'>");
			html.push("<img class='menu-item-icon ");
			html.push(!item.icon?"hidden":"");
			html.push("' src='");
			html.push(item.icon? item.icon : $.getBlankIcon());
			html.push("'></img>");
			html.push("<span class='menu-item-text'>");
			html.push(item.title);
			html.push("</span>");
			if((item.children || []).length){
				html.push("<span class='menu-item-submenu'></span>");
				this.menuboxs[item.id] = item.children;
			}
			html.push("</a>");
			html.push("</div>");
			this.menuitems[item.id] = item;
		}
		html.push("</div>");
		html.push("</div>");
		var menuBox = $(html.join("")),
			menuBar = this.options.menuBar;
		if(!isNaN(Number(menuBar.width))){
			var width =Number(menuBar.width)-40;
			if(width <=0){ width = 70;}
			menuBox.width(width);
		}
		if(!isNaN(Number(menuBar.itemWidth))){
			$(">.inner>.menu-item",menuBox).width(Number(menuBar.itemWidth));
		}
		this._funnelMenuBoxEvents(menuBox);
		return menuBox;
	},
	//创建弹出子菜单容器
	createPopMenuBox : function(dataProvider,menuBoxId){
		var html = [],
			height = 0;
		html.push("<div class='menu-box'>");
		html.push("<div class='menu-separator-y'></div>");
		for(var i=0,item;item = dataProvider[i];i++){
			if(item.seperator){
				html.push("<div class='menu-separator-x'></div>");
				height+=3;
				continue;
			}
			height+=26;
			html.push("<div class='menu-item");
			html.push(item.disabled?" disabled' disabled=true ":"'");
			html.push(" menuItemId='");
			html.push(item.id);
			html.push("'>");
			html.push("<a class='menu-item-link' href='#' unselectable='on'>");
			html.push("<img class='menu-item-icon' src='");
			html.push(item.icon? item.icon :  $.getBlankIcon());
			html.push("'></img>");
			html.push("<span class='menu-item-text'>");
			html.push(item.title);
			html.push("</span>");
			if((item.children || []).length){
				html.push("<div class='menu-item-submenu'></div>");
				this.menuboxs[item.id] = item.children;
			}
			html.push("</a>");
			html.push("</div>");
			this.menuitems[item.id] = item;
		}
		html.push("</div>");
		var menuBox = $(html.join(""));
		$(".menu-separator-y",menuBox).height(height);
		
		//设置属性和绑定事件
		menuBox.attr("menuBoxId",menuBoxId);
		this._funnelMenuBoxEvents(menuBox);
		return menuBox;
	},
	//绑定子菜单容器事件
	_funnelMenuBoxEvents : function(menuBox){
		function getMenuItem(element){
			var menuItem = element.parents(".menu-item");
			return menuItem.length ? menuItem : null;
		}
		var self = this;
		menuBox.mousedown(function(e){
			e.stopPropagation();
			var menuItem = getMenuItem($(e.target));
			if(null==menuItem){ 
				return;
			}
			var menuItemId = menuItem.attr("menuItemId"),
				data = self.menuitems[menuItemId];
			//菜单节点不可用或者有孩子结点时执行点击操作
			if(menuItem.hasClass("disabled") || $(".menu-item-submenu",menuItem).length){
				return;
			}
			if(data.onClick){
				if(false==data.onClick(data,menuItem)){
					return;
				}
			}
			else if(self.options.onClick){
				if(false==self.options.onClick(data,menuItem)){
					return;
				}
			}
			//关闭所有的菜单
			self.close();
		})
		.mouseover(function(e){
			var menuItem = getMenuItem($(e.target));
			if(null==menuItem || menuItem.hasClass("disabled")){
				return;
			}
			var hoverItem = $(">.hover",menuBox);
			if(hoverItem[0]!=menuItem[0]){
				self.hideSubMenuBox(menuItem.parent());
				menuItem.addClass("hover");
			}
			else{
				return;
			}
			//获取menu的唯一标识
			var menuItemId = menuItem.attr("menuItemId");
			if($(".menu-item-submenu",menuItem).length){
				//获取对应的子菜单容器
				var subMenuBox = $(">[menuBoxId="+menuItemId+"]",self.element);
				//如果没有则创建子菜单容器
				if(0==subMenuBox.length){ 
					var children = self.menuboxs[menuItemId];
					self.element.append(subMenuBox=self.createPopMenuBox(children,menuItemId));
				}
				//定义菜单的位置
				var menuBar = self.options.menuBar, 
					itemoffset = menuItem.offset(),
					elementoffset = self.element.offset(),
					left = itemoffset.left - elementoffset.left +  menuItem.width() +1,
					top = itemoffset.top - elementoffset.top,
					subMenuBoxHeight = subMenuBox.height(),
					subMenuBoxWidth = subMenuBox.width(),
					screenTop = document.body.offsetHeight + document.body.scrollTop,
					screenLeft = document.body.offsetWidth  + document.body.scrollLeft;
				if(menuBar && menuBox==self.rootMenuBox){
					left = itemoffset.left - elementoffset.left;
					top = itemoffset.top + menuItem.height() - elementoffset.top -1;
				}
				else{
					//判断弹出的菜单位置是否在浏览器显示区域内
					if(itemoffset.left + menuItem.width() + subMenuBoxWidth + 10>screenLeft){
						left = itemoffset.left - elementoffset.left - subMenuBoxWidth -7;
					}
					if(itemoffset.top + subMenuBoxHeight + 10>screenTop){
						top = itemoffset.top + menuItem.height()  - elementoffset.top -subMenuBoxHeight -5;
					}
				}
				
				subMenuBox.css({
					left : left + "px",
					top : top + "px",
					visibility : "visible"
				});
			}
		});
	},
	//关闭相关联的子所有菜单
	hideSubMenuBox : function(menuBox){
		var hoverItem = $("div.hover",menuBox);
		hoverItem.removeClass("hover");
		if(0==hoverItem.length || 0==$(".menu-item-submenu",hoverItem).length) return;
		var menuItemId = hoverItem.attr("menuItemId"),
			subMenuBox =  $(">[menuBoxId="+menuItemId+"]",this.element);
		if("visible"==subMenuBox.css("visibility")){
			this.hideSubMenuBox(subMenuBox);
			subMenuBox.css("visibility","hidden");
		}
	},
	//关闭弹出菜单
	close : function(){
		this.hideSubMenuBox(this.rootMenuBox);
		if(!this.options.menuBar){
			this.element.hide();
		}
	},
	//设置某个菜单节点不可用
	setDisabled : function(menuItemId,disabled){
		var menuItem =  $("[menuItemId="+menuItemId+"]",this.element);
		if(0==menuItem.length 
				|| disabled==menuItem.hasClass("disabled")){
			return; 
		}
		var data = this.menuitems[menuItemId];
		if(disabled){
			menuItem.attr("disabled",true);
			menuItem.addClass("disabled");
		}
		else{
			menuItem.attr("disabled",false);
			menuItem.removeClass("disabled");
		}
	},
	//绑定事件
	_funnelEvents : function(){
		var self = this;
		function mousedown(e){
			if("none"!=self.element.css("display")){
				var onClose = self.options.onClose;
				self.close();
				onClose && onClose(e);
			}
		}
		$(document).bind("mousedown",mousedown);
		//销毁菜单
		this.destroy = function(){
			this.element.empty();
			$(document).unbind("mousedown",mousedown);
		}
	}
});

})(jQuery);