
function mapArticleList(dataList){
	$.map(dataList,function(value,index,array){
			var itemTemplate=
			'<section class="list">'+ 
				'<h3>'+value.title+'</h3>'+
				'<p style="margin: 10px auto;">原文出自:'+value.author+'</p>'+
				'<div class="container">'+
			   				'<div class="row" id="change_rowwidth">'+
			      				'<div class="col-md-6">'+
									'<div style="margin-top:10px;font-size:15px;line-height:25px;text-overflow:ellipsis">'+value.description+'</div>'+
									'<div style="margin-top:5px">'+
										'<p>'+
											'<a class="more" href="javascript:" id='+value.id+'>阅读全文&nbsp;>>></a>'+
										'</p>'+
									'</div>'+
				  				'</div>'+
				  				'<div class="col-md-5">'+
				  					'<img class="article_img" src="./img/article_img/'+value.id+'.png" />'+
				  				'</div>'+
							'</div>'+
				'</div>'+	
				'<hr class="divider">'+
			'</section>';

			$("#article_items_contianer").append(itemTemplate)
		})
}

//-------分页展现UI------
function showPages(page,total){
	var str='<li data-page='+page+'><a href="javascript:">'+page+'</a></li>';
	for (var i = 1; i <=3; i++) {
		if (page-i>1) {
			str='<li><a href="javascript:">'+(page-i)+'</a></li>'+str;
		}
		if (page+i<total) {
			str=str+'<li><a href="javascript:">'+(page+i)+'</a></li>';
		}
	}
	if (page==1) {
		str='<li>'+
		'<a href="javascript:" aria-label="previous" style="cursor:default;color:#aaa;">'+
			'<span aria-hidden="true" class="previous">&laquo;上一页</span>'+
		'</a>'+
		'</li>'+str;
	}
	if (page==total) {
		str=str+
		'<li>'+
			'<a href="javascript:" aria-label="next" style="cursor:default;color:#aaa;">'+
			    '<span aria-hidden="true" class="next">下一页&raquo;</span>'+
			'</a>'+
		'</li>';
	}
	if (page-4>1) {
		str='<li><a href="javascript:">...</a></li>'+str;
	}
	if (page>1) {
		str='<li>'+
		'<a href="javascript:" aria-label="previous">'+
			'<span aria-hidden="true" class="previous">&laquo;上一页</span>'+
		'</a>'+
		'</li>'+'<li><a href="javascript:">'+1+'</a></li>'+str;
	}
	if (page+4<total) {
		str=str+'<li><a href="javascript:">...</a></li>';
	}
	if (page<total) {
		str=str+'<li><a href="javascript:">'+total+'</a></li>'+
		'<li>'+
			'<a href="javascript:" aria-label="next">'+
			    '<span aria-hidden="true" class="next">下一页&raquo;</span>'+
			'</a>'+
		'</li>';
	}

	return str;
	
};
//----点击分页监听----
$('#pagination_ul').on('click','a',function(){
	var thisPage=parseInt($(this).text());
	if (thisPage<list_config.pageCount+1) { // 点击具体页码
		list_config.curPage=thisPage;
		doPagination(thisPage,list_config.pageCount);
	}else{ //--上一页,下一页分页
		if ($(this).children().eq(0).attr('class')=='previous') {
			if (list_config.curPage==1) {
				return;
			}else{
				thisPage=list_config.curPage-1;
				doPagination(thisPage,list_config.pageCount);
			}
		}else{
			if (list_config.curPage==list_config.pageCount) {
				return;
			}else{
				thisPage=list_config.curPage+1;
				doPagination(thisPage,list_config.pageCount);
			}
		}
	}

	
});
//---分页操作---
function doPagination(thisPage,pageCount){
	var thisPagination=showPages(thisPage,list_config.pageCount);
	$('#pagination_ul').children().remove();
	$('#pagination_ul').append(thisPagination);
	$('li[data-page='+thisPage+']').addClass('active');
	var start=(thisPage-1)*list_config.pageSize,end=thisPage*list_config.pageSize;
	var articleData=articleList.slice(start,end);
	curList=articleData;//当前页面的5条数据
	$("#article_items_contianer").children().remove();
	mapArticleList(articleData);
	$("html, body").animate({scrollTop:0},400);
}
//---初始化分页---

	(function getArticleListData(){
		$.ajax({
			method: "GET",
			url: "./data_source/article/articleList.json",
			dataType:"json"
		}).done(function(data) {
			list_config.articleList=data.articleList.reverse(); //逆序输出
			list_config.total=list_config.articleList.length;
			list_config.pageCount=Math.ceil(list_config.total/list_config.pageSize);
			var articleListCopy=list_config.articleList;
			var init_articleData=articleListCopy.slice(0,5);
			list_config.curList=init_articleData;//当前页面的5条数据
			//console.log(articleList.length);
			mapArticleList(init_articleData);	
			var pagination=showPages(list_config.curPage,list_config.pageCount);
			$('#pagination_ul').append(pagination);
			$('li[data-page='+list_config.curPage+']').addClass('active');	
		}).fail(function(){
		    swal('请求接口失败','error','error')
		});
	})();
	
(function(){
	var $backToTopEle=$('<img class="backToTop" src="/img/backtop.png" />').appendTo($("body")).click(function(){
		$("html, body").animate({scrollTop:0},400);
	}),
	$backToTopFun=function(){
		var st=$(document).scrollTop(),
		winh=$(window).height();
		(st>0)?$backToTopEle.show():$backToTopEle.hide();
		if(!window.XMLHttpRequest){
			$backToTopEle.css("top",st+winh-166);
		}
	};
	$(window).on("scroll",$backToTopFun);
	$(function(){$backToTopFun();});
})();



//----阅读原文-事件绑定--
$('#article_items_contianer').on('click','.more',function(){
	var thisId=$(this).attr('id');
	var targetUrl=window.btoa(window.encodeURIComponent("article_show.html?target='+Date.parse(new Date())+'_'+value.id+'_'+value.title+'_'+value.author"))
	$.each(list_config.curList,function(index,value){
		if (value.id==thisId) {
			var targetUrl='target='+Date.parse(new Date())+'_'+value.id+'_'+value.title+'_'+value.author;
			var targetUrl_encode=window.btoa(window.encodeURIComponent(targetUrl));
			window.location.href='article_show.html?'+targetUrl_encode;
			return false;
		}
	})

})