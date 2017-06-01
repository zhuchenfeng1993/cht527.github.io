
//----------------------添加十点读书文章-------------------------------------------
$("#insert_article").click(function() {
        if($("#article_name").val()==""||$("#article_author").val()==""||$('input[name="article_music"]:checked').val()==""||$("#description").val()==""||$("#content").val()==""){
           swal("请将信息填写完整");
        }else{
            $.ajax({
                type:'post',
                dataType:'text', 
                url:'/admin/article_add_handle.php',//请求数据的地址
                data:{title:$("#article_name").val(), author:$("#article_author").val(),article_music:$('input[name="article_music"]:checked').val(),description:$("#description").val(),content:$("#content").val()},
                success:function(data){
                    console.log(data);
                    console.log(typeof(data));
                    if(data=="1"){
                        swal("添加成功","","success");
                        window.location.href='../article_list.ds';
                    }else{
                        swal("添加失败", "", "error");
                    }
                     
                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(XMLHttpRequest.status);
                                alert(XMLHttpRequest.readyState);
                                alert(textStatus);
                }, 
                    
            });
        } 
   
 })
//-----添加技术文章
$("#insert_webFe").click(function() {
        if($("#webfe_name").val()==""||$("#webfe_author").val()==""||$('input[name="article_classify"]:checked').val()==""||$(".laydate-icon").val()==""||$("#webfe_content").val()==""){
           swal("请将信息填写完整");
        }else{
            $.ajax({
                type:'post',
                dataType:'text', 
                url:'/admin/webFE_add_handle.php',//请求数据的地址
                data:{title:$("#webfe_name").val(), author:$("#webfe_author").val(),article_classify:$('input[name="article_classify"]:checked').val(),date:$(".laydate-icon").val(),content:$("#webfe_content").val()},
                success:function(data){
                    console.log(data);
                    if(data=="1"){
                        swal("添加成功","","success");
                        window.location.href='../webFE/';
                    }else{
                        swal("添加失败", "", "error");
                    }
                     
                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(XMLHttpRequest.status);
                                alert(XMLHttpRequest.readyState);
                                alert(textStatus);
                }, 
                    
            });
        } 
   
 })
//--------------------------------修改文章---------------------------------------------------
$("#modify_webfe").click(function() {
       
            $.ajax({
                type:'post',
                dataType:'text', 
                url:'/admin/article_modify_handle.php',//请求数据的地址
                data:{title:$("#webFe_title").val(),content:$("#modify_content").val()},
                success:function(data){
                    console.log(data);
                    console.log(typeof(data));
                   if(data=="1"){
                        swal("修改成功","","success");
                        window.location.href='../webFE/';
                    }else{
                        swal("修改失败", "", "error");
                    }
                     
                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(XMLHttpRequest.status);
                                alert(XMLHttpRequest.readyState);
                                alert(textStatus);
                }, 
                    
            });
           
})
//--------------------------------写日记------------------------------------------------------
$("#insert_diary").click(function() {
        if($("#diary_date").val()==""||$("#mood").val()==""||$("#diary_content").val()==""){
             swal("请将信息填写完整");
        }else{
            $.ajax({
                type:'post',
                dataType:'text', 
                url:'/admin/diary_add_handle.php',//请求数据的地址
                data:{title:$("#diary_date").val(), mood:$("#mood").val(),content:$("#diary_content").val()},
                success:function(data){
                    console.log(data);
                    console.log(typeof(data));
                     if(data=="1"){
                        swal("日记录入成功","","success");
                        window.location.href='../diary/';
                    }else{
                        swal("日记录入失败", "", "error");
                    }
                     
                },

                error: function(XMLHttpRequest, textStatus, errorThrown) {
                                alert(XMLHttpRequest.status);
                                alert(XMLHttpRequest.readyState);
                                alert(textStatus);
                }, 
                    
            });
        } 
   
 })
//--------------------------------退出登录----------------------------------------------------
$("#exitnow").click(function(){
        var exit=setTimeout(function(){
        $("#exitModal").hide();
        window.location.href='/admin/logout.ds';
        },1000);
});
