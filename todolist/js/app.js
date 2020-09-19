var app = new Vue({
	el:'#app',
	data:{
		title:"便签>>>todolist",
		inp_data:'',
		todoData:[],
		ched:false,
		mode:false
		},
	methods:{
		//夜间模式变换
		day_night(){
			this.mode = !this.mode;
			if (this.mode==true){
				document.getElementById("mode").setAttribute("src",'./img/day.png');
			}else{
				document.getElementById("mode").setAttribute("src",'./img/night.png');
			}
		},

		//方法的简洁声明方式ES6，插入数据
		add(){
			var id = this.todoData.length>0?this.todoData[this.todoData.length-1].id+1:1;
			var inp_content = this.inp_data;
			var add_data = {id,inp_content,status:false};
			axios({
				method:'post',
				url:'http://localhost:3000/todolist',
				data:add_data,
			}).then((backdata)=>{
				// var data = backdata.data;
				// var status = backdata.status;
				var {data,status} = backdata;
				if(status == 201){
					this.todoData.push(data);
					this.inp_data = '';
				}
			})
		},
		del(key){
			axios({
				method:'delete',
				url:'http://localhost:3000/todolist/'+this.todoData[key].id,
			}).then((backdata)=>{
				var {status} = backdata;
				if(status == 200){
					this.todoData.splice(key,1);
				}
			})
		},
		selAll(){
			var bool = !this.ched;
			for(let i=0;i<this.todoData.length;i++){
				this.todoData[i].status = bool;
				//循环异步请求服务器性能下降
				/* axios({
					method:'put',
					url:'http://localhost:3000/todolist/'+this.todoData[i].id,
					data:this.todoData[i]
				}).then((backdata)=>{
					if(backdata.status==200){
						console.log(1);
						}	
				}) */
			}
		},
		clear(){
			//固定循环长度，保证整个数组循环到
			var len = this.todoData.length;
			for(let i=0;i<len;i++){
				if(this.todoData[i].status == true){
					axios({
						method:'delete',
						url:'http://localhost:3000/todolist/'+this.todoData[i].id,
					}).then((backdata)=>{
						if(backdata.status==200){
							this.getAll();
						}	
					})
				}
			}
		},
		getAll(){
			axios.get('http://localhost:3000/todolist')
			.then((backdata)=>{
				var { data } = backdata;
				this.todoData = data;
				// console.log(data);
				})
		}
		

	},
	//这个方法会在页面渲染之前运行
	mounted:function(){
		this.getAll();
		}
		
	})