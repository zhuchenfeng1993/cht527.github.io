
navObj.addHandler(document.getElementById("li_diary"), "click", show_prompt);
document.getElementsByTagName('title')[0].innerHTML=targetTitle;
document.getElementById('article_title').innerHTML=targetTitle;
document.getElementById('article_author').innerHTML='原文出自:&nbsp;&nbsp;'+targetAuthor;

var targetGroupNum=Math.ceil(parseInt(targetId)/10);
var targetUrl="";
switch(targetGroupNum){
	case 1:
	  targetUrl="./data_source/article/articleContent_1.json";
	  break;
	case 2:
	  targetUrl="./data_source/article/articleContent_2.json";
	  break;
	case 3:
	  targetUrl="./data_source/article/articleContent_3.json";
	  break;
	case 4:
	  targetUrl="./data_source/article/articleContent_4.json";
	  break;
	case 5:
	  targetUrl="./data_source/article/articleContent_5.json";
	  break;
	default:
  
}
$.ajax({
	method: "GET",
	url: targetUrl,
	dataType:"json"
}).done(function(data) {
	var articleContent=data.articleContent;
	$.each(articleContent,function(index,value){
		if (targetId==value.id) {
			$('#article_content').append(value.content);
			return false;
		}
	})
}).fail(function(){
	swal('请求接口失败','error','error')
});