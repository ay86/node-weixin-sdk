/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信小程序开发 API
 * @Since 2019-05-18
 */

const sign = require('./api/sign');
const token = require('./api/token');
const getWXACodeUnlimit = require('./api/create-temp-wxacode');
const getPhone = require('./api/get-phone');
const sendSubscribeMsg = require('./api/send-subscribe-message');
const sendTemplateMsg = require('./api/send-template-message');

class WxaSDK {
	constructor(config) {
		this.config = config;
	}

	sign = sign;
	token = token;
	getWXACodeUnlimit = getWXACodeUnlimit;
	getPhone = getPhone;
	sendSubscribeMsg = sendSubscribeMsg;
	sendTemplateMsg = sendTemplateMsg;

	noop() {
		return new Promise(resolve => {
			resolve();
		});
	}
}

module.exports = WxaSDK;
