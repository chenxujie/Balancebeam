var incoPath = $.getContextPath()+"balancebeam/themes/default/images/",
	 dataProvider = [
			{
				id : "liaoning",
				title : "辽宁",
				icon : incoPath + "grid-menu-asc.gif",
				disabledIcon : incoPath + "grid-menu-asc.gif",
				children : [
				     { id:"shenyang",title:"沈阳",children:[
							{ id:"sy-heping",title:"和平区"},
							{ id:"sy-shenhe",title:"沈河区",href : "http://www.163.com"},
							{ id:"sy-tiexi",title:"铁西区",href : "http://www.sohu.com"},
							{ id:"sy-huanggu",title:"皇姑区"},
							{ id:"sy-yuhong",title:"于洪区"},
							{ id:"sy-dadong",title:"大东区"},
							{ id:"sy-hunnan",title:"浑南"}
                      ]},
				     { id:"dalian",title:"大连",disabled:true,children :[
                     		{ id:"dl-zhongshan",title:"中山区"},
                     		{ id:"dl-xiguang",title:"西岗区"},
                     		{ id:"dl-shahekou",title:"沙河口区"},
                     		{ id:"dl-ganjingzi",title:"甘井子区"}
                     ]},
				     { seperator:true },
				     { id:"anshan",title:"鞍山",children:[
                    		{ id:"as-tiedong",title:"铁东区"},
                    		{ id:"as-tiexi",title:"铁西区"},
                    		{ id:"as-lishan",title:"立山区"},
                    		{ id:"as-qianshan",title:"千山区"}
                    ]},
				     { seperator:true },
				     { id:"fushun",title:"抚顺",icon : incoPath + "grid-menu-lock.gif"},
				     { id:"benxi",title:"本溪"},
				     { id:"dandong",title:"丹东"},
				     { id:"jinzhou",title:"锦州",disabled:true},
				     { id:"yingkou",title:"营口",disabled:true},
				     { id:"liaoyang",title:"辽阳"},
				     { seperator:true },
				     { id:"tieling",title:"铁岭"},
				     { id:"fuxin",title:"阜新"},
				     { id:"chaoyang",title:"朝阳"},
				]
			},
			{
				id : "guangdong",
				title : "广东",
				children : [
				            	{ id:"guangzhou",title:"广州"},
				            	{ id:"shezhen",title:"深圳"},
				            	{ id:"foshan",title:"佛山"}
				            ]
			},
			{
				id : "shandong",
				title : "山东",
				children : [
				            	{ id:"jinnan",title:"济南"},
				            	{ id:"qingdao",title:"青岛"},
				            	{ id:"yantai",title:"烟台"}
				            ]
			},
			{
				id : "beijing",
				title : "北京",
				onClick : function(){
					alert("自定义方法：北京");
				}
			},
			{
				id : "shanghai",
				title : "上海",
				href : "http://www.baidu.com",
				icon : incoPath + "grid-menu-unlock.gif"
			}
	   ];
