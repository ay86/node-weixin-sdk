/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信小程序开发 API
 * @Since 2019-05-18
 */

const sign = require('./api/sign');
const token = require('./api/token');
const getWXACodeUnlimit = require('./api/create-temp-wxacode');
const decryptData = require('./api/decrypt-data');
const sendSubscribeMsg = require('./api/send-subscribe-message');
const sendTemplateMsg = require('./api/send-template-message');

class WxaSDK {
	constructor(config) {
		this.config = Object.assign({}, config);
	}

	setConfig(config) {
		Object.assign(this.config, config);
	}

	sign = sign;
	token = token;
	getWXACodeUnlimit = getWXACodeUnlimit;

	// 兼容旧版本存在的方法
	getPhone = decryptData;

	decryptData = decryptData;
	sendSubscribeMsg = sendSubscribeMsg;
	sendTemplateMsg = sendTemplateMsg;

	noop() {
		return new Promise(resolve => {
			resolve();
		});
	}
}

module.exports = WxaSDK;
