var vm = new Vue({
	el:'.container',
	data:{
		limitNum:3,
		addressList:[],
		currentAddressIdx:0,
		// 配送方式
		shoppingMethod:1

	},

	filters:{
		// vulau 默认传入 被过滤的值
		formatMoney:function (value) {
			return "￥" + value.toFixed(2);
		}
	},
	computed:{
		filterAdress:function () {
			return this.addressList.slice(0,this.limitNum);
		}
	},
	// vm实例可用时
	mounted:function () {
		// 代码保证 this.$el 在 document 中 (vm实例可用)
		this.$nextTick(function () {
			// 初始化购物车列表
			vm.addressView();
		})
	},
	methods:{
		addressView:function () {
			var _this = this;
			axios.get('data/address.json')
			  .then(function (response) {
			    _this.addressList = response.data.result;
	
			    console.log(_this.addressList);
			  })
			  .catch(function (error) {
			    console.log(error);
			  });

		},
		showAllAdress:function () {
			this.limitNum = this.addressList.length;
		},

		// 点击选中卡片
		selectAddress:function (item) {
			this.currentAddressIdx = this.addressList.indexOf(item);
		},

		// setDefault
		setDefault:function (item) {
			// 其他已经是默认的遍历设为false
			this.addressList.forEach(function (address,index) {
				if (address.isDefault) {
					address.isDefault = false;
				}
			});
			// 再把点击的卡片 默认 设为 true,
			item.isDefault = true;
		}

	}

});


// 全局注册
Vue.filter('money', function (value,type) {
  return "￥" + value + type ;
})
