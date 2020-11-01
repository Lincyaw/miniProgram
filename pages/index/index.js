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
			{
				query:"fds",
				value:"sd"
			}
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
		wx.getStorageSync({
			key: 'list',
			success(res) {
				console.log(res.data)
				this.setData({
					list: res.data
				})
			}
		})

		this.setData({
			slideButtons: [{
				text: '普通',
				src: '/page/weui/cell/icon_love.svg', // icon的路径
			}, {
				text: '普通',
				extClass: 'test',
				src: '/page/weui/cell/icon_star.svg', // icon的路径
			}, {
				type: 'warn',
				text: '警示',
				extClass: 'test',
				src: '/page/weui/cell/icon_del.svg', // icon的路径
			}],
		});
	},
	/**
	   * 生命周期函数--监听页面显示
	   */
	onShow: function () {
		const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
		console.log(location);
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
		console.log('slide button tap', e.detail)
	},
})
