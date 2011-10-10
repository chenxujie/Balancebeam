/*
 * Balancebeam Widget Tree_Plugins_Xhr 1.0
 *
 * Description : Support xhr data
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/widget/tree/beam.tree.js
 */
(function($){
	$.ui.tree.xhr = {
			//根据数据判断是不是叶子节点
			isLeafByData : function(data){
				var options = this.options;
				//leaf字段不为空，则此优先级最高
				return true ==data[options.leaf];
			},
			//构造子树的容器
			createSubcontainer : function(element,expended/**是否展开**/){
				var id = element.attr(this.nodeId),
					data = this.nodesbase[id][0],
					options = this.options,
					children = data[options.children],
					status = $(">.status",element),
					subcontainer = $("<div class='subcontainer'></div>"),
					self = this;
				//异步获取子结点
				status.addClass("loading");
				//XHR回调方法，用户自己写ajax方法
				options.xhr(function(children){
					status.removeClass("loading");
					//如果返回的子节点为空
					if(!children || !children.length){
						icon.removeClass("collapse");
						icon.addClass("leaf");
						return;
					}
					data[options.children] = children;
					for(var i=0,child;child = children[i];i++){
						subcontainer.append(self._renderNode(child));
					}
					//插入树结点的后边
					element.after(subcontainer);
					//重新调用展开方法
					expended && self.expend(element);
				});
			}	
	};
})(jQuery);