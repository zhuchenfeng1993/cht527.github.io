
var APP_KEY = 'potatoClock';
function store(key, data) {
    if (arguments.length > 1) {
        return localStorage.setItem(key, JSON.stringify(data));
    } else {
        var storeData = localStorage.getItem(key);
        return (storeData && JSON.parse(storeData)) || []; // 这里一定要设置初始值为 []
    }
}
function Todo(id,text) {
	return {"id":id,"text":text};
}
//----------- 番茄时钟 UI ------------ 
var chtPotatoUI={
    timerClock:function(){

    },
    init:function(){
      this.findDom();
      this.bindEvent();
    },
    
    findDom:function(){
            this.startTask=document.querySelector("#startTask");//开始任务
            this.pauseTask=document.querySelector("#pauseTask");// 暂停任务
            this.innerBoxTimer=document.querySelector("#innerBoxTimer");// 倒计时时钟
            this.timerValue=document.querySelector("#timerValue");// 倒计时时钟数字
            this.restAudio=document.querySelector("#restAudio");// 中间休息 audio
            this.finishAudio=document.querySelector("#finishAudio");// 完成任务 audio
            this.innerBoxTimerLeft=document.querySelector("#innerBoxTimerLeft");
            this.innerBoxTimerRight=document.querySelector("#innerBoxTimerRight");
            this.innerBoxTimerCycleLeft=document.querySelector("#innerBoxTimerCycleLeft");
            this.innerBoxTimerCycleRight=document.querySelector("#innerBoxTimerCycleRight");
    },
     // 模拟 Controller (业务逻辑层)
    bindEvent:function(){
      //---开始 任务----
          this.startTask.addEventListener('click', function (){
              this.start();
          }.bind(this), false);
          //---暂停 任务----
          this.pauseTask.addEventListener('click', function (){
              this.pause();
          }.bind(this), false);
    },
    //----开始任务-----
    start:function () {
        this.timerClockStart();
        this.progressCycle();
    },
    //----暂停任务-----
    pause:function() {
      clearInterval(this.timerClock)
    },
    //----中间休息 提示------
    rest:function(){
        this.restAudio.play();
    }.bind(this),
    //----任务完成 提示------
    finish:function(){
        this.finishAudio.play();
    }.bind(this),
    //----进度条--------
    progressCycle:function(){
      
    },
    timerFormat:function(leftTime){
            var leftsecond = parseInt(leftTime/1000);
            //---day 跟 hour 暂时不用
            var day=Math.floor(leftsecond/(60*60*24)); 
            var hour=Math.floor((leftsecond-day*24*60*60)/3600); 
            var minute=Math.floor((leftsecond-day*24*60*60-hour*3600)/60);
            var second=Math.floor(leftsecond-day*24*60*60-hour*3600-minute*60);  
            minute=minute<10?"0"+minute:minute;
            second=second<10?"0"+second:second; 
            return minute+":"+second;
    },
    //----数字倒计时--环形进度条UI--
    timerClockStart:function(){
        var timeSec=1*60; //秒数
        var leftTime=timeSec*1000;
        var angle=360/timeSec;//每秒转的角度值
        var n=0;m=1; //左右半圆的计数值
        //var leftRotate=0,rightRotate=0;// 左右半圆分别旋转的角度量
        this.timerClock=setInterval(function(){
          this.timerValue.innerHTML=this.timerFormat(leftTime);
          //---触发完成任务 clock 、清除倒计时
          if(leftTime<1000){
            this.finish();
            clearInterval(this.timerClock);
            this.innerBoxTimerLeft.style.zIndex=10;
            this.innerBoxTimerRight.style.zIndex=10;
            this.innerBoxTimerCycleLeft.style.zIndex=0;
            this.innerBoxTimerCycleRight.style.zIndex=0;
            this.innerBoxTimerLeft.style.transform="rotate(0deg)";
            this.innerBoxTimerRight.style.transform="rotate(0deg)";
            swal("Good job", "当前番茄时钟已完成", "success")
            return false;
          };
          //----休息---
          if(leftTime==5*60*1000){
            //---触发休息 clock
            this.rest();
          };
          if(n<=timeSec/2){ //----前半段时间右半圆旋转
              this.innerBoxTimerRight.style.transform="rotate("+angle*n+"deg)";
              n++;
              
          }else{ //--------后半段时间左半圆旋转
              m++;
              this.innerBoxTimerRight.style.zIndex=-10;
              this.innerBoxTimerCycleRight.style.zIndex=20;
              this.innerBoxTimerLeft.style.transform="rotate("+angle*m+"deg)";
              
          }
          leftTime-=1000;
          
        }.bind(this),1000);
    }
   

};
//----------- 任务列表 ------------ 

var chtPotatoList={
  	init:function () {
  		this.todos = store(APP_KEY);
  		this.findDom();
  		this.bindEvent();
  		this.render(); // 初始化渲染
  	},
  	findDom:function(){
          this.todoList = document.querySelector("#todoList");//列表
          this.todoListItem = document.querySelector(".todoItem");//列表项
          this.addTask=document.querySelector("#addTask");//添加任务
          this.innerBoxTask=document.querySelector("#innerBoxTask");// 任务名称

    },
     // 模拟 Controller (业务逻辑层)
    bindEvent:function(){
        //---添加 新任务
        this.addTask.addEventListener('click', function (){
            this.addItem();
        }.bind(this), false);
        //---删除 任务----
        $("#todoList").on('click','.del-content',function(e){  // 事件委托，优化性能
           e.preventDefault();
           var targetIndex=e.target.getAttribute('data-index');
           var targetContent=e.target.getAttribute('data-content');
           this.delItem(targetIndex,targetContent);
        }.bind(this));
         //---添加当前任务----
        $("#todoList").on('click','.item-content',function(e){  // 事件委托，优化性能
           e.preventDefault();
           var targetContent=e.target.innerHTML;
           this.innerBoxTask.innerHTML="在"+this.timeFormater()+"完成"+targetContent+"，加油^_^";
        }.bind(this));
        
    },
    // 这里勉强抽象成一个视图吧!!!
    view:function() {
          var fragment = document.createDocumentFragment();   // 减少回流次数
          fragment = '';
  
          for (var i = 0; i < this.todos.length; i++) { // 一次性DOM节点生成
            fragment += '<li class="todoItem"><span class="item-icon"></span><span class="item-content">'+
                        this.todos[i].text+'</span><span data-content='+this.todos[i].text+' data-index='+i+' class="del-content">×</span></li>';
      
          }
          this.todoList.innerHTML = fragment;
    },
    timeFormater:function () {
      var startTime=new Date();
      var start_hh=startTime.getHours(),start_mm=startTime.getMinutes(); 
      start_hh=start_hh>=10?start_hh:"0"+start_hh;  
      start_mm=start_mm>=10?start_mm:"0"+start_mm;  
      var dur=25*60*1000;//25分钟
      var endTime=new Date(startTime.getTime()+dur),end_hh=endTime.getHours(),end_mm=endTime.getMinutes();                
      end_hh=end_hh>=10?end_hh:"0"+end_hh;  
      end_mm=end_mm>=10?end_mm:"0"+end_mm;
      
      return start_hh+":"+start_mm+" - "+end_hh+":"+end_mm;
    },
  
        // render()函数作为一个订阅者的回调函数，数据的变化会反馈到模型 store
        // 换句话说：视图通过观察者模式，观察模型 store，当模型发生改变，触发视图更新
    render:function() {
          this.view();
          /**
           * 按照 MVC 原则这里本不应该出现下面的代码的
           * 因为业务逻辑关系（我本地存储使用的是同一个key值，再次写入数据会覆盖原来的数据，），
           * 所以必须通知模型 M 保存数据， V 层处理了不该它处理的逻辑，导致 M 与 V 耦合
           *
           * 解决办法是：将其抽象出来编写一个 视图助手 helper
           */
          store(APP_KEY, this.todos);
    },
    
    //----添加任务-----
    addItem:function() {
      swal({   
        title: "新建任务",   
        text: "输入任务名称:",   
        type: "input",   
        showCancelButton: true,   
        closeOnConfirm: false,   
        animation: "slide-from-top",   
        inputPlaceholder: "" 
      },function(inputValue){   
        if (inputValue === false){
            return false;
        } 
        if (inputValue === "") {
            swal.showInputError("请输入任务名称!");
            return false;
        }      
        var id = Number(new Date());
        var addTodo = new Todo(id, inputValue);
        this.todos.push(addTodo); // 模型发生改变
        this.render(); // 当模型发生改变，触发视图更新
        swal("添加成功", "任务名称: " + inputValue, "success");
      }.bind(this)
      );
      
    },
   
    delItem:function(index,content) {
      swal({   
        title: "确定删除?",   
        text: content,   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "确定",   
        closeOnConfirm: false 
      }, 
      function(){   
          this.todos.splice(index, 1);
          this.render();
          swal(content+"已从列表中删除", "success"); 
      }.bind(this)
      );
     
    }

};
chtPotatoList.init();
chtPotatoUI.init();