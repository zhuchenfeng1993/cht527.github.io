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
 $(".photoimg").on('click',function(){
 	var id=$(this).attr('id');
 	var targetId=id.split('_')[1];
 	//bgmPlay(targetId)
 	var Id='myaudio_'+musicMark;
	var oAudio = document.getElementById(Id); 
	if(oAudio.paused){
	    oAudio.play();
	}else{
	    oAudio.pause();
	}
 })
/* function bgmPlay(musicMark){
 	var music_file="include/music/"+musicMark+".mp3";
 	if (window.HTMLAudioElement) {
		try {
			var targetId='myaudio_'+musicMark;
			var oAudio = document.getElementById(targetId); 
			oAudio.src = music_file;
			if(oAudio.paused){
	            oAudio.play();
	        }else{
	            oAudio.pause();
	        }
		}catch (e) {
						               
			if(window.console && console.error("Error:" + e));
		}
	}  
 }*/

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
			$("#nav_container").toggle();
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