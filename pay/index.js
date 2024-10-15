/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信支付
 * @Since 2019-05-18
 */

const fs = require('node:fs');

const paySign = require('./api/sign');
const redPacket = require('./api/red-packet');
const fission = require('./api/fission');
const merchantPay = require('./api/merchant-pay');
const preOrder = require('./api/pre-order');
const refund = require('./api/refund');
const native = require('./api/v3/native');
const notify = require('./api/notify');
const refundNotify = require('./api/refund-notify');

class WxPaySDK {
	constructor(config) {
		this.config = Object.assign({}, config);
		this.loadCert();
	}

	setConfig(config) {
		Object.assign(this.config, config);
		this.loadCert();
	}

	loadCert() {
		if (this.config.pay.certPath) {
			this.certFile = fs.readFileSync(this.config.pay.certPath);
		}
		if (this.config.pay.privatePath) {
			this.privateKey = fs.readFileSync(this.config.pay.privatePath);
		}
	}

	paySign = paySign;
	redPacket = redPacket;
	fission = fission;
	merchantPay = merchantPay;
	preOrder = preOrder;
	refund = refund;
	native = native;
	notify = notify;
	refundNotify = refundNotify;
}

module.exports = WxPaySDK;
