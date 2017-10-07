$(document).ready(function(e) {
    ImgIputHandler.Init();
});

var ImgIputHandler={
	facePath:[
	    {faceName:"weixiao",facePath:"weixiao.gif"},
		{faceName:"piezui",facePath:"piezui.gif"},
		{faceName:"se",facePath:"se.gif"},
		{faceName:"fadai",facePath:"fadai.gif"},
		{faceName:"deyi",facePath:"deyi.gif"},
		{faceName:"liulei",facePath:"liulei.gif"},
		{faceName:"haixiu",facePath:"haixiu.gif"},
		{faceName:"bizui",facePath:"bizui.gif"},
		{faceName:"daku",facePath:"daku.gif"},
		{faceName:"ganga",facePath:"ganga.gif"},
		{faceName:"fanu",facePath:"fanu.gif"},
		{faceName:"tiaopi",facePath:"tiaopi.gif"},
		{faceName:"ziya",facePath:"ziya.gif"},
		{faceName:"jingya",facePath:"jingya.gif"},
		{faceName:"nanguo",facePath:"nanguo.gif"},
		{faceName:"ku",facePath:"ku.gif"},
		{faceName:"lenghan",facePath:"lenghan.gif"},
		{faceName:"zhuakuang",facePath:"zhuakuang.gif"},
		{faceName:"tu",facePath:"tu.gif"},
		{faceName:"touxiao",facePath:"touxiao.gif"},
	    {faceName:"keai",facePath:"keai.gif"},
		{faceName:"baiyan",facePath:"baiyan.gif"},
		{faceName:"aoman",facePath:"aoman.gif"},
		{faceName:"jie",facePath:"jie.gif"},
		{faceName:"kun",facePath:"kun.gif"},
		{faceName:"jingkong",facePath:"jingkong.gif"},
		{faceName:"liuhan",facePath:"liuhan.gif"},
		{faceName:"hanxiao",facePath:"hanxiao.gif"},
		{faceName:"dabing",facePath:"dabing.gif"},
		{faceName:"fendou",facePath:"fendou.gif"},
		{faceName:"zhouma",facePath:"zhouma.gif"},
		{faceName:"yiwen",facePath:"yiwen.gif"},
		{faceName:"xu",facePath:"xu.gif"},
		{faceName:"yun",facePath:"yun.gif"},
		{faceName:"zhemo",facePath:"zhemo.gif"},
		{faceName:"shuai",facePath:"shuai.gif"},
		{faceName:"kulou",facePath:"kulou.gif"},
		{faceName:"qiaoda",facePath:"qiaoda.gif"},
		{faceName:"zaijian",facePath:"zaijian.gif"},
		{faceName:"cahan",facePath:"cahan.gif"},
		{faceName:"koubi",facePath:"koubi.gif"},
		{faceName:"guzhang",facePath:"guzhang.gif"},
		{faceName:"qiudale",facePath:"qiudale.gif"},
		{faceName:"huaixiao",facePath:"huaixiao.gif"},
		{faceName:"zuohengheng",facePath:"zuohengheng.gif"},
		{faceName:"youhengheng",facePath:"youhengheng.gif"},
		{faceName:"haqian",facePath:"haqian.gif"},
		{faceName:"bishi",facePath:"bishi.gif"},
		{faceName:"weiqu",facePath:"weiqu.gif"},
		{faceName:"kuaikule",facePath:"kuaikule.gif"},
		{faceName:"yinxian",facePath:"yinxian.gif"},
		{faceName:"qinqin",facePath:"qinqin.gif"},
		{faceName:"xia",facePath:"xia.gif"},
		{faceName:"kelian",facePath:"kelian.gif"},
		{faceName:"caidao",facePath:"caidao.gif"},
		{faceName:"xigua",facePath:"xigua.gif"},
		{faceName:"pijiu",facePath:"pijiu.gif"},
		{faceName:"lanqiu",facePath:"lanqiu.gif"},
		{faceName:"pingpang",facePath:"pingpang.gif"},
		{faceName:"yongbao",facePath:"yongbao.gif"},
		{faceName:"woshou",facePath:"woshou.gif"},
	]
	,
	Init:function(){
		var toggleMark=true;
		if($(".faceDiv").children().length==0){
					for(var i=0;i<ImgIputHandler.facePath.length;i++){
						$(".faceDiv").append("<img title=\""+ImgIputHandler.facePath[i].faceName+"\" src=\"../img/face/"+ImgIputHandler.facePath[i].facePath+"\" />");
					}
					
		}
		$(".imgBtn").on("click",function(){
			$(".faceDiv").toggle();
			if (toggleMark) {
				$('#editorContainer').css("marginTop","200px");
				toggleMark=false;
			}else{
				$('#editorContainer').css("marginTop","0px");
				toggleMark=true;

			}
			
				
		});
		$(".faceDiv>img").on("click",function(){
			     var selectMood=$(this).attr("title");
			     $("#mood").val(selectMood);
			     $(".faceDiv").hide();
			     $('#editorContainer').css("marginTop","0px");
			     toggleMark=true;

		});
	},

}