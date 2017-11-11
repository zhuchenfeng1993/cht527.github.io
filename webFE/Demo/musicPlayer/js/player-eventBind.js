var audioEle=document.getElementById("myMusic");

var isPlay=false;
var isFirstLoad=true;
var lrcObj = {},lrcObjLen=0;//--保存歌词
/*playBtn.onclick=function () {
	if(!isPlay){
		audioEle.play();
		this.className="rotate";
		if (isFirstLoad) {
			getLrc();
		}
	}else{
		audioEle.pause();
		this.className="";
	}
	isPlay=!isPlay;
};*/

//歌词同步
/*获取歌词*/
function getLrc() {
	$.ajax({
        url:"./music/李玉刚-刚好遇见你.txt",
        dataType:"text",
        success:function(lrc){
  			if (lrc) {
				var lyric = parseLyric(lrc);
            	console.log(lyric[0]);
  			}else{
  				alert("lrc 为空");
  			}
        },
        error:function(e){
           alert(e);
        }
    });
}
	
/* 解析歌词*/
function parseLyric(lrc) {
    var lyrics = lrc.split("\n");
    /*使用换行符拆分歌词为数组，然后遍历每一行。*/
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        /*匹配时间轴匹配 使用正则/[\d:\d((.|\:)\d)]/g
        lrc歌词的时间格式有很多种 比如 [00:02.69]沧浪之歌 [00:02:69]沧浪之歌 [00:02]沧浪之歌
		这个正则可以匹配出所有格式，把歌词text放在 “clause”变量中
		然后循环时间轴，使用正则找出时分秒，将它单位转换为 秒
		最后用时间轴作为键，歌词作为值 放到lrcObj对象中。*/
    	
    	/*将时间轴和歌词都存储在hash表中，这样效率和速度都远超数组。js中object本身就是一个hash表*/
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        //console.log(timeRegExpArr);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        //console.log(clause);
        /*以下for循环处理：不用管2个时间轴一句歌词的情况，有的歌词是这样的:[00:02:69][01:02:69] 我爱你，因为副歌部分很多重复内容，作者将他写在了同一行*/
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
            lrcObjLen++;
           
        }
    }
    return lrcObj;
}
/*3、监听audio播放事件 显示歌词*/
/*audioEle.ontimeupdate = function(e) {
    //遍历所有歌词，看哪句歌词的时间与当然时间吻合
    for (var i in lrcObj) {
        if (this.currentTime > i) {//当前播放的时间
            //显示到页面
            textlrc.innerHTML =lrcObj[i];
        }
    }
};*/