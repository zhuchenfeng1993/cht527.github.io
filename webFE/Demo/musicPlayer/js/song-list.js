
var songList=[],songListLen=0;//---歌曲列表,数量
var songLiEle=[],songLiEleLen=0;//---歌曲li元素DOM集合、数量
var audioEle=document.getElementById("myMusic");//---audio标签
var textLrc=document.getElementById("textLrc");//---歌词外容器
var contentLrc=document.getElementById("contentLrc");//---歌词内容器
var currentIndex=0;//---前播放歌曲的index
var isPlay=false;// ---播放状态
var isFirstLoad=true; //---首次加载歌词状态
var lrcObj = {},lrcObjLen=0,lrcArray=[];//---保存歌词

//---获取歌曲数据--
~~function ajaxGetList() {
	if (window.localStorage.getItem("storeSongList")) {
		songList=JSON.parse(window.localStorage.getItem("storeSongList"));
		songListLen=songList.length;
		renderPlayList(songList);
	}else{
		$.ajax({
		    type: "get",
		    url: "./songList.json",
		    dataType: "json",
		    success: function(data){
		        if(data){
		        	var source=data.songList,len=source.length;
		        	window.localStorage.setItem("storeSongList",JSON.stringify(source));
		        	songList=JSON.parse(window.localStorage.getItem("storeSongList"));
		        	songListLen=songList.length;
		        	renderPlayList(songList);
		        }
		    },
		    error: function(e){
				alert(e);
		    }
		});
	}

}();
//---将数据渲染的页面--
function renderPlayList(data) {
	var playListFragment=document.createDocumentFragment();
	var playListUl=document.getElementById('playListUl');
	data.forEach(function (item,index) {
		var tempLi=document.createElement('li');
		tempLi.setAttribute("data-index",index);
		tempLi.innerHTML='<img src=\"./images/sound.png\" class="sound" />'+item;
		playListFragment.appendChild(tempLi);
	});
	playListUl.appendChild(playListFragment);
	songLiEle=document.querySelectorAll("#playListUl li");
	songLiEleLen=songLiEle.length;

}
//---监听列表点击事件---
$("#playListUl").on("dblclick","li",function(e) {
	e.preventDefault();
	lrcObj = {};//清空歌词对象
	contentLrc.style.right=0;
	var currentLi=e.target;
	currentIndex=currentLi.getAttribute('data-index');
	//--双击列表播放时 UI 变化
	changeSongListUI(currentIndex);
	
	//---获取当前歌曲信息
	var currentSongInfo=currentLi.childNodes[1].textContent.split(" ")[0];
	
	//---唱片机动画
	playerAnimation("play",currentIndex);

	//---播放音乐
	playMusic(currentSongInfo);

	//---获取歌词
	if (isFirstLoad) {//
		getLrc(currentSongInfo);
	}else{

	}

});
//---双击列表播放时 UI 变化
function changeSongListUI(currentIndex) {
	for(var i =0;i<songLiEleLen;i++) {
		songLiEle[i].childNodes[0].style.display="none";
		songLiEle[i].style.backgroundColor="";
	}
	//--找到当前元素 显示图标
	songLiEle[currentIndex].childNodes[0].style.display="inline";
	songLiEle[currentIndex].style.backgroundColor="#A57CB4";
}
//---播放时动画---
function playerAnimation(action,index) {
	if (action=="play") {
		document.querySelector(".player-switch-body").style.transform="rotate(21deg)";
		document.querySelector(".player-disc").className="player-disc playerRotate";
		document.querySelector("#songCover").src="./images/songCover/"+index+".jpg";
	}
}
//---播放音乐---
function playMusic(info) {
	console.log(info);
	audioEle.src="./music/"+info+".mp3";
	if(!isPlay){
		audioEle.play();
	}else{
		audioEle.pause();
	}
	isPlay=!isPlay;
}

/*获取歌词*/
function getLrc(info) {
	$.ajax({
        url:"./musiclyric/"+info+".txt",
        dataType:"text",
        success:function(lrc){
  			if (lrc) {
  				//lyricText = parseLyric(lrc);
  				//以下设置歌词滚动效果
				lyricTemplate = parseLyric(lrc);
				contentLrc.innerHTML=lyricTemplate;
            	//console.log(lyric);
  			}else{
  				alert("歌词为空");
  			}
        },
        error:function(e){
           console.log(e);
        }
    });
}
	
/* 解析歌词*/
function parseLyric(lrc) {
    var lyrics = lrc.split("\n");
    var lrcTemplate="";//歌词模板
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
            lrcArray.push(time);//--保存歌词时间 到lrcArray
            lrcObj[time] = clause;//--保存歌词 到lrcObj
            lrcObjLen++;
            lrcTemplate+='<p id='+time+'>'+clause+'</p>';//设置歌词滚动效果
        }
    }
    
    //return lrcObj;
    return lrcTemplate;//设置歌词滚动效果
}
/*监听audio播放事件 显示歌词*/

var n=0;//显示歌词行数

//var textLrcFragment=document.createDocumentFragment();//歌词内容
audioEle.ontimeupdate = function(e) {
	var curTime=~~(this.currentTime);
    //遍历所有歌词，看哪句歌词的时间与当然时间吻合
   /* for (var i in lrcObj) {
        if (~~(this.currentTime) == i) {//当前播放的时间
            //1、单句显示到页面
            //textLrc.innerHTML=lrcObj[i];//单句显示只需要这一句
        }    
    }*/
    // 歌词滚动显示
        var pEle=document.getElementsByTagName('p');
        //以下是改变颜色
        /*for (var i = 0,pLen=pEle.length; i <pLen; i++) {
           pEle[i].style.color="#fff";
        }
        if (document.getElementById(i)) {
           	document.getElementById(i).style.color="#DBBCDE";
        }*/
        if (document.getElementById(curTime)&&pEle[n]) {
           	if (curTime==pEle[n].id) {
				contentLrc.style.right=-46*n+"px";
				n++;
			}
        }
		
        
};

/*监听audio播放结束事件 */
audioEle.onended = function() {
	contentLrc.style.right=0;
	isPlay=!isPlay;
    if(currentIndex<songListLen-1){
		currentIndex++;
    }else{
    	currentIndex=0;
    }
    var nextLi=songLiEle[currentIndex];
	changeSongListUI(currentIndex);
	//---获取下一首歌曲信息
	var nextSongInfo=nextLi.childNodes[1].textContent.split(" ")[0];
	//---唱片机动画
	playerAnimation("play",currentIndex);
	//---播放音乐
	playMusic(nextSongInfo);

	//---获取歌词
	if (isFirstLoad) {//
		getLrc(nextSongInfo);
	}else{

	}
};