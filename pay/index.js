/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信支付
 * @Since 2019-05-18
 */

const path = require('path');
const fs = require('fs');

const paySign = require('./api/sign');
const redPacket = require('./api/red-packet');
const fission = require('./api/fission');
const merchantPay = require('./api/merchant-pay');
const preOrder = require('./api/pre-order');
const refund = require('./api/refund');

class WxPaySDK {
	constructor(config) {
		this.config = config;
		if (this.config.pay.certPath) {
			this.certFile = fs.readFileSync(path.resolve(__dirname, this.config.pay.certPath));
		}
	}

	paySign = paySign;
	redPacket = redPacket;
	fission = fission;
	merchantPay = merchantPay;
	preOrder = preOrder;
	refund = refund;
}

module.exports = WxPaySDK;
