/*---之前登录用的加密算法-暂时不用--*/
var sha1_obj={
		hexcase:0,
		b64pad:"", 
		chrsz:8,
		hex_sha1:function(s){
		    return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
		},

		b64_sha1:function(s) {
		    return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
		},

		str_sha1:function(s) {
		    return binb2str(core_sha1(str2binb(s), s.length * chrsz));
		},

		hex_hmac_sha1:function(key, data) {
		    return binb2hex(core_hmac_sha1(key, data));
		},

		b64_hmac_sha1:function (key, data) {
		    return binb2b64(core_hmac_sha1(key, data));
		},

		str_hmac_sha1:function (key, data) {
		    return binb2str(core_hmac_sha1(key, data));
		},

		
		sha1_vm_test:function() {
		    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
		},

		core_sha1:function (x, len) {
		    /*   append   padding   */
		    x[len >> 5] |= 0x80 << (24 - len % 32);
		    x[((len + 64 >> 9) << 4) + 15] = len;

		    var w = Array(80);
		    var a = 1732584193;
		    var b = -271733879;
		    var c = -1732584194;
		    var d = 271733878;
		    var e = -1009589776;

		    for (var i = 0; i < x.length; i += 16) {
		        var olda = a;
		        var oldb = b;
		        var oldc = c;
		        var oldd = d;
		        var olde = e;

		        for (var j = 0; j < 80; j++) {
		            if (j < 16) w[j] = x[i + j];
		            else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
		            var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
		            e = d;
		            d = c;
		            c = rol(b, 30);
		            b = a;
		            a = t;
		        }

		        a = safe_add(a, olda);
		        b = safe_add(b, oldb);
		        c = safe_add(c, oldc);
		        d = safe_add(d, oldd);
		        e = safe_add(e, olde);
		    }
		    return Array(a, b, c, d, e);

		},


		sha1_ft:function(t, b, c, d) {
		    if (t < 20) return (b & c) | ((~b) & d);
		    if (t < 40) return b ^ c ^ d;
		    if (t < 60) return (b & c) | (b & d) | (c & d);
		    return b ^ c ^ d;
		},


		sha1_kt:function(t) {
		    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
		},


		core_hmac_sha1:function(key, data) {
		    var bkey = str2binb(key);
		    if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

		    var ipad = Array(16),
		        opad = Array(16);
		    for (var i = 0; i < 16; i++) {
		        ipad[i] = bkey[i] ^ 0x36363636;
		        opad[i] = bkey[i] ^ 0x5C5C5C5C;
		    }

		    var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
		    return core_sha1(opad.concat(hash), 512 + 160);
		},


		safe_add:function (x, y) {
		    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		    return (msw << 16) | (lsw & 0xFFFF);
		},


		rol:function (num, cnt) {
		    return (num << cnt) | (num >>> (32 - cnt));
		},


		str2binb:function(str) {
		    var bin = Array();
		    var mask = (1 << chrsz) - 1;
		    for (var i = 0; i < str.length * chrsz; i += chrsz)
		    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
		    return bin;
		},


		binb2str:function(bin) {
		    var str = "";
		    var mask = (1 << chrsz) - 1;
		    for (var i = 0; i < bin.length * 32; i += chrsz)
		    str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
		    return str;
		},


		binb2hex:function(binarray) {
		    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		    var str = "";
		    for (var i = 0; i < binarray.length * 4; i++) {
		        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
		    }
		    return str;
		},


		binb2b64:function(binarray) {
		    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		    var str = "";
		    for (var i = 0; i < binarray.length * 4; i += 3) {
		        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
		        for (var j = 0; j < 4; j++) {
		            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
		            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
		        }
		    }
		    return str;
		}
};
/*----------head text------*/
var headerText={
	NewsTime:1000,
	TextTime:200,
	newsi:0,
	txti:0,
	txttimer:'',
	newstimer:'',
	//newstitle:new Array(),
	newstitle:"看遍世界上所有的美景，经历生命里每一个良辰",
}
var showNewText=function(){
	    var newstr=headerText.newstitle;
		if(headerText.txti>=newstr.length){
			clearInterval(headerText.txttimer);
			clearInterval(headerText.newstimer);
			headerText.newstimer=setInterval(showNewText,headerText.NewsTime);
			headerText.txti=0;
			return;
		}
		clearInterval(headerText.txttimer);
		document.getElementById("headtext").innerHTML=newstr.substring(0,headerText.txti+1);
		headerText.txti++;
		headerText.txttimer=setInterval(showNewText,headerText.TextTime);
}
showNewText();

//-------photo img click-------

var e=["生命中，有些人来了又去，有些人去而复返，有些人近在咫尺，有些人远在天涯，有些人擦身而过，有些人一路同行。\n无论如何，终免不了曲终人散的伤感。远在天涯的朋友：或许已是遥远得无法问候，但还是谢谢您曾经的结伴同行。","前端路上，一路有你。编辑你的正能量，快乐工作，努力生活~","此刻，我认真的微笑了，不带酸涩，不带惆怅，只是腼腆、淡然的微笑，那些刻有我成长符号的隐隐岁月，在不知不觉中幻化点点的自信，铺洒在我前进的道路上绽放星芒。","有些时候，简简单单也是一种幸福。的确，安于平淡安详，也是一种修养、一种享受。\n只是有些时候，平淡而不厌烦的生活已经很难在我们身上出现了。现实的状况往往让我们觉得物是人非，于是便有了烦恼，有了抱怨。","你的生命必须是留有缝隙，那样阳光才是能照进来。\n人生的最大的魅力不是成功，而是责任；生命惟因其短，故是应把它化入人类最壮丽的文明史中以获得永恒；生命也是唯因其短，更是要加倍珍惜每刻青春。","【人生感悟】有的时候，真的觉得人生最大的遗憾就是，放弃了不该放弃的，而固执地去坚持不该坚持的。\n生活有苦有甜，才叫完整；爱情有闹有和，才叫情趣；心情有悲有喜，才叫体会；日子有阴有晴，才叫自然；联系时有时无，才叫珍贵。","不要总在过去的回忆里缠绵，昨天的太阳，晒不干今天的衣裳。没有人可以赢得世界，但是大部分人都是输给了自己。最厌烦的感觉不是成为陌生人、而是逐渐陌生的态度。","人生的路只有经历过，才知道有短有长；时光如水，我们无法阻止岁月的脚步，很多人，逐渐淡出了我们的视线，懂得了什么叫过客，很多事，已经不再属于我们的精彩，知道了这就叫过往。","【人生感悟】人生是一程单向旅行，不可后退。走到生命的哪一个阶段，都该喜欢那一段时光，完成那一阶段该完成的职责，顺生而行，不沉迷过去，不狂热地期待着未来，生命理当如此。","有人说：“我若是灯，我就要用我的光明来照彻黑暗。”我不配做一盏明灯。那么就让我做一块木柴罢。我愿意把我从太阳那里受到的热放散出来，我愿意把自己烧得粉身碎骨给人间添一点点温暖。"];
$(".js_fly").click(function() {
    return $(".js_fly_message").val(e[Math.floor(10 * Math.random())]),
    $(".js_fly_wind, .js_fly_plane").fadeIn(200),
    !1
})
$(".js_fly_close").click(function() {
    $(".js_fly_wind").fadeOut(200)
})
$(".js_fly_comment").click(function() {
    $(this).toggleClass("choose_active")
})
$(".js_fly_send").click(function() {
    //var e = "1288460501986050384";
    if ($(".js_fly_comment").hasClass("choose_active")) {
    	setTimeout(function() {
        	$(".js_fly_plane").removeClass("front"),
        	$(".js_fly_container").removeClass("beginning"),
        	$(".js_fly_curvable").addClass("curved"),
	        setTimeout(function() {
	            $(".js_fly_container").addClass("hover"),
	            setTimeout(function() {
	                $(".js_fly_container").addClass("fly_away_first"),
	                setTimeout(function() {
	                    $(".js_fly_container").addClass("fly_away"),
	                    setTimeout(function() {
	                        $(".js_fly_plane").addClass("front"),
	                        $(".js_fly_container").removeClass("fly_away fly_away_first hover").addClass("beginning"),
	                        $(".js_fly_curvable").removeClass("curved"),
	                        $(".js_fly_wind").hide()
	                    },
	                    3e3)
	                },
	                600)
	            },
	            2e3)
	        },
	        2800)
    	},
    	200)
    }
})


 //---监听展开pianoList 展开、收起
 $("#piano_items_contianer").on("click",'.show-hide-piano',function(){
        if($(this).attr("title")=="展开"){
            $(this).children().eq(0).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            $(this).attr("title","收起")
        }else{
            $(this).children().eq(0).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            $(this).attr("title","展开")
        }
        $(this).parent().next().toggle(800);
 })

/*----钢琴弹奏事件绑定----*/

$("#piano-container,#piano-back").on("click",function(){
		if (window.blog.is_loadpiano) {
			$("#container").toggle();
        	$("#pianoList").toggle(800);
		}else{
			getPianoData();
		}
       
});

function getPianoData(){
	$.ajax({
		method: "GET",
		url: "./data_source/piano.json",
		dataType:"json"
	}).done(function(data) {

		$.map(data.pianoList,function(value,index,array){
			var itemTemplate=
			'<section class="piano-items">'+ 
                  '<h3 style="display:inline-block;width:5%">'+value.id+'</h3>'+
                  '<h3 style="display:inline-block;width:75%">'+value.title+'</h3>'+
                  '<h3 style="display:inline-block;width:10%">'+
                  	'<span class="show-hide-piano" title="展开"><i class="fa fa-chevron-down"></i></span>'+
                  '</h3>'+
                  '<img class="piano-content-img" src="./img/piano/'+value.id+'.png" style="display:none" alt="" />'+
              '</section>';
			$("#piano_items_contianer").append(itemTemplate);

		});
		$("#nav_container").toggle();
        $("#pianoList").toggle(800);
        window.blog.is_loadpiano=!window.blog.is_loadpiano;
		     		
	}).fail(function(){
		swal('请求接口失败','error','error')
	});
}