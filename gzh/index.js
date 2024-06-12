/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号开发 API
 * @Since 2018/4/21
 */

const sign = require('./api/sign');
const token = require('./api/token');
const receive = require('./api/receive');
const userInfo = require('./api/user-info');
const createTempQr = require('./api/create-temp-qrcode');
const createQr = require('./api/create-qrcode');
const getQrImg = require('./api/get-qrcode-image');
const putMaterial = require('./api/put-material');
const xml = require('./api/xml');
const send = require('./api/send');
const sendTemplateMsg = require('./api/send-template-message');
const {decrypt, encrypt} = require('./api/crypt-data');
const encryptMsg = require('./api/encrypt-msg');

class GzhSDK {
	constructor(config) {
		this.config = Object.assign({}, config);
	}

	setConfig(config) {
		Object.assign(this.config, config);
	}

	sign = sign;
	token = token;
	receive = receive;
	userInfo = userInfo;
	createTempQr = createTempQr;
	createQr = createQr;
	getQrImg = getQrImg;
	putMaterial = putMaterial;
	xml = xml;
	send = send;
	sendTemplateMsg = sendTemplateMsg;
	decrypt = decrypt;
	encrypt = encrypt;
	encryptMsg = encryptMsg;

	noop() {
		return new Promise(resolve => {
			resolve();
		});
	}
}

module.exports = GzhSDK;
