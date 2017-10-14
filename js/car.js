var vm = new Vue({
	el:'#app',
	data:{
		productList:[],
		totalPrice:0,
		checkAll:false,
		delFlag:false,
		currentProduct:null

	},

	filters:{
		// vulau 默认传入 被过滤的值
		formatMoney:function (value) {
			return "￥" + value.toFixed(2);
		}
	},
	// vm实例可用时
	mounted:function () {
		// 代码保证 this.$el 在 document 中 (vm实例可用)
		this.$nextTick(function () {
			// 初始化购物车列表
			vm.cartView();
		})
	},
	methods:{
		// 初始化购物车列表
		cartView:function () {
			var _this = this;
			axios.get('data/cart.json')
			  .then(function (response) {
			    _this.productList = response.data.result.list;
	
			    console.log(_this.productList);
			  })
			  .catch(function (error) {
			    console.log(error);
			  });
		},
		// 单选check
		selectProduct:function (item) {
			// 如果没有该属性，则添加 . 存在则取反(选中/不选中)
			if (typeof item.checked == "undefined") {
				this.$set(item,"checked",true);
			}else{
				item.checked = !item.checked;
			}


			// 判断选中的个数是否为全部   是==》【全选】选中  否==》【全选】不选中
			var selectLength = 0;
			this.productList.forEach(function (item,index) {
				if (item.checked) {
					selectLength++;
				}
			});
			if (this.productList.length == selectLength) {
				this.checkAll = true;
			}else{

				this.checkAll = false;
			}


			// 单选结算总金额
			vm.calcTotalMoney();



		},

		selectAll:function (flag) {
			// 全选按钮状态
			this.checkAll = flag;
			//如果全选 遍历productList 设置选中
			// if (this.checkAll) {
				var _this = this;
				this.productList.forEach(function (item,index) {
					if (typeof item.checked == "undefined") {
						// 设置到data属性上
						_this.$set(item,"checked",_this.checkAll);
					}else{
						item.checked = _this.checkAll;
					}
				});
			// }
			// 
			vm.calcTotalMoney();

		},
		

		// 数量加减
		countChange:function(item,type) {
			if (type == -1) {
				if (item.count <= 1) {
					item.count = 1;
				}else{

					item.count--;
				}
			}else{
				item.count++;
			}
			// vm.cartView();
			vm.calcTotalMoney();
			
		},

		// 总金额
		calcTotalMoney:function () {
			var _this = this;
			this.totalPrice = 0;
			this.productList.forEach(function (item,index) {
				if (item.checked) {
					_this.totalPrice += item.price * item.count;
				}

			});
		},

		// 删除按钮
		deleteComfirm:function (item) {
			//遮罩的显示隐藏
			this.delFlag = true;
			// 当前商品
			this.currentProduct = item;
		},

		// 删除的确认按钮
		deleteProduct:function () {
			var _this = this;
			// 获取当前product的索引
			var index = this.productList.indexOf(this.currentProduct);
			//删除
			this.productList.splice(index,1);
			// 清除遮罩
			this.delFlag = false;
			//重新计算
			vm.calcTotalMoney();



				
		}


	}

});


// 全局注册
Vue.filter('money', function (value,type) {
  return "￥" + value + type ;
})
