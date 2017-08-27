
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

var chtPotato={
	init:function () {
		this.todos = store(ADD_KEY);
		this.findDom();
		this.bindEvent();
		this.render(); // 初始化渲染
	},
	findDom:function(argument){
        this.todoList = document.querySelector("#todoList");//列表
        this.todoListItem = document.querySelector(".todoItem");//列表项
        this.addTask=document.querySelector("#addTask");//添加任务
        this.delTask=document.querySelector(".delTask");//删除任务
        this.startTask=document.querySelector("#startTask");//开始任务
        this.pauseTask=document.querySelector("#pauseTask");// 暂停任务
    },
     // 模拟 Controller (业务逻辑层)
    bindEvent:function(argument){
        this.addTask.addEventListener('click', function (){
            this.addItem();
        }, false);
 
        this.delTask.addEventListener('click', function(e){  // 事件委托，优化性能
           this.delItem(item);
        }, false);
        this.startTask.addEventListener('click', function (){
            this.start();
        }, false);
        this.pauseTask.addEventListener('click', function (){
            this.pause();
        }, false);
    },
    // 这里勉强抽象成一个视图吧!!!
    view:function() {
          var fragment = document.createDocumentFragment();   // 减少回流次数
          fragment = '';
  
          for (var i = 0; i < this.todos.length; i++) { // 一次性DOM节点生成
            fragment += '<li class="todoItem">'+this.todos[i].text+'</li>';
          }
          this.todoList.innerHTML = fragment;
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
          store(ADD_KEY, this.todos);
    },
  
    getItemIndex:function(item) {
        var itemIndex;
        if (item.target.tagName.toLowerCase() === 'li') {
           var arr = Array.prototype.slice.call(this.todoListItem);
           var index = arr.indexOf(item.target);
           return itemIndex=index;
        }
    },
 	start:function (argument) {
 		
 	},
 	pause:function() {

 	},
    addItem:function(e) {
         var id = Number(new Date());
         var text = this.contentBox.value;
         var addTodo = new Todo(id, text);
         this.todos.unshift(addTodo); // 模型发生改变
         this.render(); // 当模型发生改变，触发视图更新
    },
 
    delItem:function(item) {
         var index = this.getItemIndex(item);
         this.todos.splice(index, 1);
         this.render();
    }

};
chtPotato.init();
