
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

var targetMusicMark=0;
$.ajax({
	method: "GET",
	url: targetUrl,
	dataType:"json"
}).done(function(data) {
	var articleContent=data.articleContent;
	$.each(articleContent,function(index,value){
		if (targetId==value.id) {
			$('#article_content').append(value.content);
			targetMusicMark=value.article_music;
			bgmPlay(targetMusicMark);
			return false;
		}
	})
}).fail(function(){
	swal('请求接口失败','error','error')
});


//------------------music player------------------------
function bgmPlay(targetMusicMark){
	if(targetMusicMark=='1'){
		music_file="include/music/"+targetId+".mp3";
	}else{
		music_file="include/music/default.mp3";
	}

	if (window.HTMLAudioElement) {
		try {
			var oAudio = document.getElementById('myaudio'); 
			oAudio.src = music_file;
		}catch (e) {
						               
			if(window.console && console.error("Error:" + e));
		}
	}  

}
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