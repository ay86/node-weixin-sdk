/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信网页开发 API
 * @Since 2019/11/18
 */

const redirect = require('./api/redirect');
const token = require('./api/token');
const checkToken = require('./api/check-token');
const userInfo = require('./api/user-info');
const getTicket = require('./api/get-ticket');
const jsSdkConfig = require('./api/js-sdk-config');

class WebSDK {
	constructor(config) {
		this.config = Object.assign({}, config);
	}

	setConfig(config) {
		Object.assign(this.config, config);
	}

	redirect = redirect;
	token = token;
	checkToken = checkToken;
	userInfo = userInfo;
	getTicket = getTicket;
	jsSdkConfig = jsSdkConfig;
}

module.exports = WebSDK;
