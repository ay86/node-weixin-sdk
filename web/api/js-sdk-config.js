/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取 JS SDK 的配置（实际上这是公众号开放的接口，但是应用是在网页应用上）
 * @Group gzh
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
			error => reject(error)
		);
	});
};
