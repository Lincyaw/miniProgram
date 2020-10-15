// pages/webservice/search-form/search-form.js
import { CDN_PATH, WEBSERVICE_APPID } from '../../config/appConfig';

Page({

	/**
   * 页面的初始数据
   */
	data: {
		keyword: '',
		modes: [
			{ text: '周边', value: 0 }
		],
		modeIndex: 0,
		cityName: '',
		location: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		centerPoint: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		southwest: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		northeast: {
			latitude: 40.040415,
			longitude: 116.273511
		},
		radius: 1000,
		animation: false,
		dialogShow: false,
		link: 'https://developers.weixin.qq.com/community/servicemarket/detail/00002c301c0ac83ddc996d8ca56015'
	},

	onInputChange(event) {
		const { value } = event.detail;
		this.setData({
			keyword: value
		});
	},

	onSelectMode(event) {
		const { index } = event.currentTarget.dataset;
		if (index === this.data.modeIndex) {
			return;
		}
		this.setData({
			modeIndex: index
		});
	},
	onLoad() {
		// 获取用户坐标
		wx.getLocation({
			type: 'gcj02',
			success: (res) => {
				const { latitude, longitude } = res;
				this.setData({
					location: {
						latitude,
						longitude
					}
				});
			}
		});
	},
	onInputCityChange(event) {
		const { value } = event.detail;
		this.setData({
			cityName: value
		});
	},

	onInputRadiusChange(event) {
		const { value } = event.detail;
		this.setData({
			radius: value
		});
	},

	// 监听视野变化
	onChangeRegion(event) {
		if (event.type === 'end' && event.causedBy === 'drag') {
			const mapCtx = wx.createMapContext('map', this);
			mapCtx.getCenterLocation({
				success: res => {
					const latitude = res.latitude.toFixed(6);
					const longitude = res.longitude.toFixed(6);
					this.setData({
						animation: true,
						centerPoint: {
							latitude,
							longitude
						}
					});
				}
			});
		}
	},

	onChangeMapRegion(event) {
		if (event.type === 'end' && (event.causedBy === 'drag' || event.causedBy === 'scale')) {
			this._getMapReigin();
		}
	},

	_getMapReigin() {
		const mapCtx = wx.createMapContext('rectangle-map', this);
		mapCtx.getRegion({
			success: res => {
				const { southwest, northeast } = res;
				this.setData({
					southwest: {
						latitude: southwest.latitude.toFixed(6),
						longitude: southwest.longitude.toFixed(6),
					},
					northeast: {
						latitude: northeast.latitude.toFixed(6),
						longitude: northeast.longitude.toFixed(6),
					}
				});
			},
			fail: err => {
				console.log(err);
			}
		});
	},

	onMarkerAnimationend() {
		this.setData({
			animation: false
		});
	},

	onRun() {
		// 获取用户坐标
		wx.getLocation({
			type: 'gcj02',
			success: (res) => {
				const { latitude, longitude } = res;
				this.setData({
					location: {
						latitude,
						longitude
					}
				});
			}
		});

		if (!this.data.keyword.trim()) {
			this._showToast('请输入关键词');
			return;
		}
		// if (this.data.modeIndex === 0 && !this.data.cityName.trim()) {
		// 	this._showToast('请输入城市名称');
		// 	return;
		// }
		if (this.data.modeIndex === 0 && !this.data.radius) {
			this._showToast('请输入搜索半径');
			return;
		}

		let boundary = '';

		// if (this.data.modeIndex === 0) {
		// 	boundary = `region(${this.data.cityName.trim()})`;
		// }

		if (this.data.modeIndex === 0) {
			boundary = `nearby(${this.data.centerPoint.latitude},${this.data.centerPoint.longitude},${this.data.radius})`;
		}

		// if (this.data.modeIndex === 2) {
		// 	boundary = `rectangle(${this.data.southwest.latitude},${this.data.southwest.longitude},${this.data.northeast.latitude},${this.data.northeast.longitude})`;
		// }
		// wx.navigateTo({
		// 	url: `../search-result/search-result?keyword=${this.data.keyword}&boundary=${boundary}`
		// });

		const data = {
			keyword: this.data.keyword,
			boundary: boundary
		};
		wx.serviceMarket.invokeService({
			service: WEBSERVICE_APPID,
			api: 'poiSearch',
			data: data
		}).then(res => {
			console.log(res);
			const result = (typeof res.data) === 'string' ? JSON.parse(res.data) : res.data;
			const markers = []; //设置marker
			const includePoints = []; //设置包含点
			for (let i = 0; i < result.data.length; i++) {
				markers.push({
					id: i,
					latitude: result.data[i].location.lat,
					longitude: result.data[i].location.lng,
					iconPath: `${CDN_PATH}/Marker1_Activated@3x.png`,
					width: 34,
					height: 34
				});
				includePoints.push({
					latitude: result.data[i].location.lat,
					longitude: result.data[i].location.lng,
				});
			}
			this.setData({
				markers: markers,
				includePoints: includePoints,
				resultJson: [{
					name: 'pre',
					children: [{
						type: 'text',
						text: (typeof res.data) === 'string' ? res.data : JSON.stringify(res.data, null, '\t')
					}]
				}],
				pois: result.data
			});
			console.log(this.data.pois);
			console.log(res.data.data);
			
		}).catch(err => {
			console.error(err);
		});
	},

	_showToast(title) {
		wx.showToast({
			title,
			icon: 'none',
			duration: 1500,
			mask: false
		});
	},
	onDialogClose() {
		this.setData({
			dialogShow: false
		});
	},
	onWatchDoc() {
		this.setData({
			dialogShow: true
		});
	},
	/**
   * 用户点击右上角分享
   */
	onShareAppMessage: function () {

	}
});
