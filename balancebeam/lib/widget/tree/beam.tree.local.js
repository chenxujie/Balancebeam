/*
 * Balancebeam Widget Tree_Plugins_Local 1.0
 *
 * Description : Support local data
 * Copyright 2011
 * License : MIT
 * Author : yangzz
 * Mail : balancebeam@163.com
 *
 * Depends:
 *		balancebeam/lib/widget/tree/beam.tree.js
 */
(function($){
	$.ui.tree.local = {
			//根据数据判断是不是叶子节点
			isLeafByData : function(data){
				var options = this.options,
					children = data[options.children];
				//leaf字段不为空，则此优先级最高
				return null!=data[options.leaf]  ? data[options.leaf] : (!children || !children.length);
			},
			//构造子树的容器
			createSubcontainer : function(element,expended/**是否展开**/){
				var id = element.attr(this.nodeId),
					data = this.nodesbase[id][0],
					options = this.options,
					children = data[options.children],
					subcontainer = $("<div class='subcontainer'></div>");
				//创建子节点
				for(var i=0,child;child = children[i];i++){
					subcontainer.append(this._renderNode(child));
				}
				//插入树结点的后边
				element.after(subcontainer);
				//重新调用展开方法
				expended && this.expend(element);
			}
	};
})(jQuery);