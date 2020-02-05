/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取 JS SDK 的配置
 * @Since 2020/2/4
 */

const util = require('../../utils');

module.exports = function (apiList = [''], url = '', debugMode = false) {
	const conf = this.config;
	return new Promise((resolve, reject) => {
		this.getTicket().then(
			ticket => {
				const jsApiConfig = {
					debug    : debugMode,
					appId    : conf.appId,
					timestamp: util.wxTimestamp(),
					nonceStr : util.randomString(),
					jsApiList: apiList
				};
				const _sign = [
					`timestamp=${jsApiConfig.timestamp}`,
					`noncestr=${jsApiConfig.nonceStr}`,
					`jsapi_ticket=${ticket}`,
					`url=${url}`
				].sort().join('&');
				jsApiConfig.signature = util.sha1(_sign);
				resolve(jsApiConfig);
			},
			() => reject()
		);
	});
};
