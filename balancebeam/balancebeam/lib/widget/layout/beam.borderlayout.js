/*
 * Balancebeam Widget BorderLayout 1.0
 *
 * Description : Support position layout
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
	 
 $.widget("ui.borderlayout",$.ui.container, {
	options: {
		//默认高度
		height : "100%",
		//北向区域
		northRegion : null,
		//南向区域
		southRegion : null,
		//西向区域
 		westRegion : null,
 		//动向区域
 		eastRegion : null,
 		//中间区域
 		centerRegion : {
 			 title: 'Center',
             href : null,
             toolbar : false,
             xhr : null
 		}
	},
	//渲染layout容器
	render : function(){
		var element = this.element,
			options = this.options,
			fragment = document.createDocumentFragment();
		//设置borderlayout的样式定义
		element.addClass("beam-borderlayout");
		//渲染北向容器
		this._renderNorthRegion(fragment);
		var viewport = $("<div class='viewport'></div>"),
			viewportFragment = document.createDocumentFragment();
		//渲染西向容器
		this._renderWestRegion(viewportFragment);
		//渲染中间容器
		this._renderCenterRegion(viewportFragment);
		//渲染东向容器
		this._renderEastRegion(viewportFragment);
		viewport.append(viewportFragment);
		fragment.appendChild(viewport[0]);
		//渲染南向容器
		this._renderSouthRegion(fragment);
		
		element.append(fragment);
	},
	_renderNorthRegion : function(fragment){
		var options = this.options,
			northRegion = options.northRegion;
		if(!northRegion){
			return;
		}
		northRegion.title = northRegion.title || "North";
		//不支持百分比高度
		northRegion.height = northRegion.height || 100;
		
		var html = ["<div class='region-north'>"];
		html.push("<div class='head'>");
		//添加关闭和打开按钮
		html.push("<div class='toggle'></div>");
		//添加标题
		html.push("<div class='caption'>");
		html.push(northRegion.title);
		html.push("</div>");
		html.push("</div>");
		//添加内容容器
		html.push("<div class='box'></div>");
		html.push("</div>");
		//创建北向结点
		var element = $(html.join("")),
			head = $(">.head",element),
			box = $(">.box",element);
		if(northRegion.collapsible){
			$(">.head>.toggle",element).css("display","block");
		}
		//不显示工具栏
		if(false==northRegion.toolbar){
			$(">.head",element).css("display","none");
			//设置内容高度为
			box.height(northRegion.height-2);
		}
		else{
			//设置内容高度为
			box.height(northRegion.height-27);
		}		
		fragment.appendChild(element[0]);
		//加载数据
		this.load(box,northRegion);
		//增加北向分隔线
		var splitter = $("<div class='splitter-north'><div class='toggle'></div></div>");
		if(!northRegion.split){
			$(">.toggle",splitter).css("display","none");
		}
		fragment.appendChild(splitter[0]);
	},
	_renderSouthRegion : function(fragment){
		var options = this.options,
			southRegion = options.southRegion;
		if(!southRegion){
			return;
		}
		southRegion.title = southRegion.title || "South";
		//不支持百分比高度
		southRegion.height = southRegion.height || 100;
		
		var html = ["<div class='region-south'>"];
		html.push("<div class='head'>");
		//添加关闭和打开按钮
		html.push("<div class='toggle'></div>");
		//添加标题
		html.push("<div class='caption'>");
		html.push(southRegion.title);
		html.push("</div>");
		html.push("</div>");
		//添加内容容器
		html.push("<div class='box'></div>");
		html.push("</div>");
		//创建北向结点
		var element = $(html.join("")),
			head = $(">.head",element),
			box = $(">.box",element);
		
		if(southRegion.collapsible){
			$(">.head>.toggle",element).css("display","block");
		}
		//不显示工具栏
		if(false==southRegion.toolbar){
			$(">.head",element).css("display","none");
			//设置内容高度为
			box.height(southRegion.height-2);
		}
		else{
			box.height(southRegion.height-27);
		}
		fragment.appendChild(element[0]);
		//加载数据
		this.load(box,southRegion);
		//创建分隔线
		var splitter = $("<div class='splitter-south'><div class='toggle'></div></div>");
		if(!southRegion.split){
			$(">.toggle",splitter).css("display","none");
		}
		fragment.appendChild(splitter[0]);
	},
	_renderWestRegion : function(fragment){
		var options = this.options,
			westRegion = options.westRegion;
		if(!westRegion){
			return;
		}
		westRegion.title = westRegion.title || "West";
		//不支持百分比宽度
		westRegion.width = westRegion.width || 100;
		var html = ["<div class='region-west'>"];
		html.push("<div class='head'>");
		//添加关闭和打开按钮
		html.push("<div class='toggle'></div>");
		//添加标题
		html.push("<div class='caption'>");
		html.push(westRegion.title);
		html.push("</div>");
		html.push("</div>");
		//添加内容容器
		html.push("<div class='box'></div>");
		//隐藏的
		html.push("<div class='placeholder'>");
		html.push("<div class='toggle'></div>");
		html.push("<div class='surface'>左侧导航</div>");
		html.push("</div>");
		html.push("</div>");
		var element = $(html.join("")),
			head = $(">.head",element),
			box = $(">.box",element);
		
		if(westRegion.collapsible){
			$(">.head>.toggle",element).css("display","block");
		}
		//西向容器工具栏是否显示
		if(false==westRegion.toolbar){
			$(">.head",element).css("display","none");
		}
		element.width(westRegion.width);
		fragment.appendChild(element[0]);
		//加载数据
		this.load(box,westRegion);
		//创建分隔线
		var splitter = $("<div class='splitter-west'><div class='toggle'></div></div>");
		if(!westRegion.split){
			$(">.toggle",splitter).css("display","none");
		}
		fragment.appendChild(splitter[0]);
	},
	_renderEastRegion : function(fragment){
		var options = this.options,
			eastRegion = options.eastRegion;
		if(!eastRegion){
			return;
		}
		eastRegion.title = eastRegion.title || "East";
		//不支持百分比宽度
		eastRegion.width = eastRegion.width || 100;
		
		var html = ["<div class='region-east'>"];
		html.push("<div class='head'>");
		//添加关闭和打开按钮
		html.push("<div class='toggle'></div>");
		//添加标题
		html.push("<div class='caption'>");
		html.push(eastRegion.title);
		html.push("</div>");
		html.push("</div>");
		//添加内容容器
		html.push("<div class='box'></div>");
		//隐藏的
		html.push("<div class='placeholder'>");
		html.push("<div class='toggle'></div>");
		html.push("<div class='surface'>右侧导航</div>");
		html.push("</div>");
		html.push("</div>");
		var element = $(html.join("")),
			head = $(">.head",element),
			box = $(">.box",element);
		
		if(eastRegion.collapsible){
			$(">.head>.toggle",element).css("display","block");
		}
		//不显示工具栏
		if(false==eastRegion.toolbar){
			$(">.head",element).css("display","none");
		}
		element.width(eastRegion.width);
		fragment.appendChild(element[0]);
		//加载数据
		this.load(box,eastRegion);
		var splitter = $("<div class='splitter-east'><div class='toggle'></div></div>");
		if(!eastRegion.split){
			$(">.toggle",splitter).css("display","none");
		}
		fragment.appendChild(splitter[0]);
	},
	_renderCenterRegion : function(fragment){
		var options = this.options,
			centerRegion = options.centerRegion;
		centerRegion.title = centerRegion.title || "Center";
		var html = ["<div class='region-center'>"];
		html.push("<div class='head'>");
		//添加标题
		html.push("<div class='caption'>");
		html.push(centerRegion.title);
		html.push("</div>");
		html.push("</div>");
		//添加内容容器
		html.push("<div class='box'></div>");
		html.push("</div>");
		var element = $(html.join("")),
			box = $(">.box",element);
		//不显示工具栏
		if(false==centerRegion.toolbar){
			$(">.head",element).css("display","none");
		}
		fragment.appendChild(element[0]);
		//加载数据
		this.load(box,centerRegion);
	},
	//加载容器数据
	load : function(box,data){
		var	href = data.href,
			xhr = data.xhr;
		if(href){
			if(/^#/.test(href)){
				box.append($(href));
			}
			else{
				$.ajax({
					url : href,
					data : $.getParameters(region.parameters),
					success : function(html){
						box.html(html);
					}
				});
			}
		}
		else if(xhr){ //自定的方法
			xhr(function(node){
				box.append(node || document.createTextNode("&nbsp;"));
			});
		}
	},
	
	//绑定事件
	funnelEvents : function(){
		var self = this,
			element = this.element;
		element.click(function(evt){
			var target = evt.target;
			if($(target).hasClass("toggle")){
				switch(target){
					case $(">.region-north>.head>.toggle",element)[0] : 
					case $(">.splitter-north>.toggle",element)[0] : 
						self.toggleNorth();
						break;
					case $(">.region-south>.head>.toggle",element)[0] : 
					case $(">.splitter-south>.toggle",element)[0] : 
						self.toggleSouth();
						break;
					case $(">.viewport>.region-west>.head>.toggle",element)[0] :
					case $(">.viewport>.splitter-west>.toggle",element)[0] :
					case $(">.viewport>.region-west>.placeholder>.toggle",element)[0] :
						self.toggleWest();
						break;
					case $(">.viewport>.region-east>.head>.toggle",element)[0] :
					case $(">.viewport>.splitter-east>.toggle",element)[0] :
					case $(">.viewport>.region-east>.placeholder>.toggle",element)[0] :
						self.toggleEast();
						break;
				};
			}
		});
	},
	toggleNorth : function(){
		var element = this.element,
			self = this,
			northRegionToggle = $(">.region-north>.head>.toggle",element);
			northSplitterToggle = $(">.splitter-north>.toggle",element);
		if(northRegionToggle.length){
			var height = false==this.options.northRegion.toolbar ? 0 : 26;
			if(northRegionToggle.hasClass("off")){
				northRegionToggle.removeClass("off");
				northSplitterToggle.removeClass("off");
				height = this.options.northRegion.height;
			}
			else{
				northRegionToggle.addClass("off");
				northSplitterToggle.addClass("off");
			}
			$(">.region-north",element).height(height);
			self.resize();
		}
	},
	toggleSouth : function(){
		var element = this.element,
			self = this,
			southRegionToggle = $(">.region-south>.head>.toggle",element);
			southSplitterToggle = $(">.splitter-south>.toggle",element);
		if(southRegionToggle.length){
			var height = false==this.options.southRegion.toolbar ? 0 : 26;
			if(southRegionToggle.hasClass("off")){
				southRegionToggle.removeClass("off");
				southSplitterToggle.removeClass("off");
				height = this.options.southRegion.height;
			}
			else{
				southRegionToggle.addClass("off");
				southSplitterToggle.addClass("off");
			}
			$(">.region-south",element).height(height);
			self.resize();
		}
	},
	toggleWest : function(){
		var element = this.element,
			westRegionToggle = $(">.viewport>.region-west>.head>.toggle",element);
			westSplitterToggle = $(">.viewport>.splitter-west>.toggle",element);
		if(westRegionToggle.length){
			var toolbar = false!=this.options.westRegion.toolbar, 
				width = toolbar ? 26 : 0,
				westRegion = $(">.viewport>.region-west",element);
			if(westRegionToggle.hasClass("off")){
				westRegionToggle.removeClass("off");
				westSplitterToggle.removeClass("off");
				width = this.options.westRegion.width;
				if(toolbar){
					$(">.head",westRegion).show();
					$(">.placeholder",westRegion).hide();
				}
				$(">.box",westRegion).show();
			}
			else{
				westRegionToggle.addClass("off");
				westSplitterToggle.addClass("off");
				if(toolbar){
					$(">.head",westRegion).hide();
					$(">.placeholder",westRegion).show();
				}
				$(">.box",westRegion).hide();
			}
			westRegion.width(width);
			this.resize();
		}		
	},
	toggleEast : function(){
		var element = this.element,
			eastRegionToggle = $(">.viewport>.region-east>.head>.toggle",element);
			eastSplitterToggle = $(">.viewport>.splitter-east>.toggle",element);
		if(eastRegionToggle.length){
			var toolbar = false!=this.options.eastRegion.toolbar, 
				width = toolbar ? 26 : 0,
				eastRegion = $(">.viewport>.region-east",element);
			if(eastRegionToggle.hasClass("off")){
				eastRegionToggle.removeClass("off");
				eastSplitterToggle.removeClass("off");
				width = this.options.eastRegion.width;
				if(toolbar){
					$(">.head",eastRegion).show();
					$(">.placeholder",eastRegion).hide();
				}
				$(">.box",eastRegion).show();
			}
			else{
				eastRegionToggle.addClass("off");
				eastSplitterToggle.addClass("off");
				if(toolbar){
					$(">.head",eastRegion).hide();
					$(">.placeholder",eastRegion).show();
				}
				$(">.box",eastRegion).hide();
			}
			eastRegion.width(width);
			this.resize();
		}		
	},
	//调整展现区域的高度大小
	resize : function(wr){
		var element = this.element,
			options = this.options,
			width = element.width() - 10,
			height = element.height(),
			viewportHeight = height - 10,
			topPosition = 5;			
		//先计算北向容器
		var northRegion = $(">.region-north",element);
		if(northRegion.length){
			northRegion.width(width);
			var h = parseInt(northRegion.css("height"),10);
			topPosition += h;
			viewportHeight -= h;
			var northSplitter = $(">.splitter-north",element);
			if(northSplitter.length){
				northSplitter.width(width);
				northSplitter.css("top",topPosition);
				topPosition += 5;
				viewportHeight -=5;
			}
		}
		//计算南向容器
		var southRegion = $(">.region-south",element);
		if(southRegion.length){
			southRegion.width(width);
			var h = parseInt(southRegion.css("height"),10);
			southRegion.css("top",(height - h-5)+"px");
			viewportHeight -= h;
			var southSplitter = $(">.splitter-south",element);
			if(southSplitter.length){
				southSplitter.width(width);
				southSplitter.css("top",(height - h-10)+"px");
				viewportHeight -=5;
			}
		}
		//计算viewport的宽高和位置
		if(viewportHeight<=0){
			viewportHeight = 27;
		}
		var viewport = $(">.viewport",element);
		viewport.width(width);
		viewport.height(viewportHeight);
		viewport.css("top",topPosition);
		var leftPostion = 0,
			centerRegionWidth=width;
		//计算西向容器
		var westRegion = $(">.viewport>.region-west",element);
		if(westRegion.length){
			$(">.box",westRegion).height(viewportHeight-(false==options.westRegion.toolbar?2:27));
			var w = parseInt(westRegion.css("width"),10);
			leftPostion +=w;
			centerRegionWidth -= w;
			westRegion.height(viewportHeight);
			$(">.placeholder",westRegion).height(viewportHeight-2);
			var westSplitter = $(">.splitter-west",viewport);
			if(westSplitter.length){
				westSplitter.css("left",leftPostion);
				leftPostion +=5;
				centerRegionWidth -= 5;
			}
		}
		//计算右向容器
		var eastRegion = $(">.viewport>.region-east",element);
		if(eastRegion.length){
			$(">.box",eastRegion).height(viewportHeight-(false==options.eastRegion.toolbar?2:27));
			var w = parseInt(eastRegion.css("width"),10);
			eastRegion.css("left",width-w);
			centerRegionWidth -= w;
			eastRegion.height(viewportHeight);
			$(">.placeholder",eastRegion).height(viewportHeight-2);
			var eastSplitter = $(">.splitter-east",viewport);
			if(eastSplitter.length){
				eastSplitter.height(viewportHeight);
				eastSplitter.css("left",width-w-5);
				centerRegionWidth -= 5;
			}
		}
		//计算中间容器
		if(centerRegionWidth<0){
			centerRegionWidth = 0;
		}
		var centerRegion = $(">.viewport>.region-center",element);
		centerRegion.height(viewportHeight);
		$(">.box",centerRegion).height(viewportHeight-(false==options.centerRegion.toolbar?2:27));
		centerRegion.css("left",leftPostion);
		centerRegion.width(centerRegionWidth);
		//调整子容器
		$.each(this.getChildren(),function(index,child){
			child.resize(wr);
		});
	}
});

})(jQuery);