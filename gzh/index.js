/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号开发 API
 * @Since 2018/4/21
 */

const sign = require('./api/sign');
const token = require('./api/token');
const userInfo = require('./api/user-info');
const createTempQr = require('./api/create-temp-qrcode');
const createQr = require('./api/create-qrcode');
const getQrImg = require('./api/get-qrcode-image');
const putMaterial = require('./api/put-material');
const xml = require('./api/xml');
const send = require('./api/send');

class GzhSDK {
	constructor(config) {
		this.config = Object.assign({}, config);
	}

	setConfig(config) {
		Object.assign(this.config, config);
	}

	sign = sign;
	token = token;
	userInfo = userInfo;
	createTempQr = createTempQr;
	createQr = createQr;
	getQrImg = getQrImg;
	putMaterial = putMaterial;
	xml = xml;
	send = send;

	noop() {
		return new Promise(resolve => {
			resolve();
		});
	}
}

module.exports = GzhSDK;
