//index.js
//获取应用实例

const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
Page({
	data: {
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		focus: false,
		inputValue: '',
		lists: [
		]
	},
	getLocation: function () {
		const key = '3R2BZ-ODFCU-ECUVQ-2M6NN-762TJ-NPF4U'; //使用在腾讯位置服务申请的key
		const referer = '位置闹钟'; //调用插件的app的名称
		const location = JSON.stringify({
			latitude: 39.89631551,
			longitude: 116.323459711
		});
		const category = '生活服务,娱乐休闲';

		wx.navigateTo({
			url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&category=${category}`
		});
	},
	onLoad: function () {
		var userData = (wx.getStorageSync('datas'));
		console.log(userData);

		this.setData({
			lists: userData
		})

		this.setData({
			slideButtons:
				[
					// 	{
					// 	text: '普通',
					// 	src: '/page/weui/cell/icon_love.svg', // icon的路径
					// }, {
					// 	text: '普通',
					// 	extClass: 'test',
					// 	src: '/page/weui/cell/icon_star.svg', // icon的路径
					// }, 
					{
						type: 'warn',
						text: '删除',
						extClass: 'test',
						src: '/page/weui/cell/icon_del.svg', // icon的路径
					}],
		});
	},
	/**
	   * 生命周期函数--监听页面显示
	   */
	onShow: function () {
		// this.onLoad();
		console.log("onshow开始了!")
		var userData = (wx.getStorageSync('datas'));
		console.log("onshow", userData);

		this.setData({
			lists: userData
		});
		// this.onLoad();
		console.log("onshow结束了!")
		this.compareLocation();
	},
	onHide: function () {
		var userData = (wx.getStorageSync('datas'));
		console.log(userData);

		this.setData({
			lists: userData
		})
	},
	new: function () {
		// wx.navigateTo({
		// 	url: '../add-new/addnew'
		// })

		wx.navigateTo({
			url: '../search-form/search-form'
		})
	},
	slideButtonTap(e) {
		var userData = (wx.getStorageSync('datas'));
		console.log(userData);

		this.setData({
			lists: userData
		})
		if (e) {
			var temp = this.data.lists;
			temp.splice(e.target.dataset.index, 1);
			wx.setStorageSync('datas', temp)
			console.log("temp", temp);
			console.log('slide button tap', e)
		}
		// wx.startPullDownRefresh();
		this.onLoad();


	},
	compareLocation() {
		var latitude;
		var longitude;
		wx.getLocation({
			type: 'wgs84',
			success(res) {
				latitude = res.latitude
				longitude = res.longitude
				wx.setStorageSync('lat',latitude);
				wx.setStorageSync('lng',longitude);
				// this.setData('lat',latitude);
				// this.setData('lng',longitude);
				// console.log(latitude, "   ", longitude);
			}
		});
		var list = this.data.lists;
		if (list) {
			list.forEach(element => {
				var pois = element.pois;
				pois.forEach(e => {
					// console.log(e);
					var lat = e.location.lat;
					var lng = e.location.lng;
					var latitude  = wx.getStorageSync('lat');
					var longitude  = wx.getStorageSync('lng');
					// console.log(lat, lng);
					this.getDistance(lat,lng,latitude,longitude);
				});
				// console.log(element);

			});
		} else {
			console.log("数组是空的");
		}

	},
	getDistance(lat1, lng1, lat2, lng2) {
		var radLat1 = this.Rad(lat1);
		var radLat2 = this.Rad(lat2);
		console.log(lat1, lng1, lat2, lng2)
		var a = radLat1 - radLat2;
		var b = this.Rad(lng1) - this.Rad(lng2);
		var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		// console.log("s = ",s)
		s = s * 6378.137;
		s = Math.round(s * 10000) / 10000;
		// console.log("s = ",s)
		s = s.toFixed(1) + 'km';
		console.log('经纬度计算的距离:' + s);
		return s;
	},
	Rad(d) {
		return d * Math.PI / 180.0;
	}
})
