/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 签名
 * @Since 2024/10/16
 */

const crypto = require('node:crypto');
const {wxTimestamp, randomString} = require('../../../utils');

module.exports = function(api, method = 'POST', body = '') {
	const conf = this.config;
	const data = [method];
	const timestamp = wxTimestamp();
	const nonce = randomString();
	try {
		data.push(api);
		data.push(timestamp);
		data.push(nonce);
		data.push(body ? JSON.stringify(body) : '');
		const source = data.join('\n') + '\n';
		// 使用商户私钥对待签名串进行SHA256 with RSA签名
		const sign = crypto.createSign('RSA-SHA256');
		sign.update(source);
		const signature = sign.sign(this.privateKey, 'base64');
		return Promise.resolve({
			'Content-Type' : 'application/json',
			'Accept'       : 'application/json',
			'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${ conf.pay.mchId }",nonce_str="${ nonce }",serial_no="${ conf.pay.serialNo }",timestamp="${ timestamp }",signature="${ signature }"`
		});
	}
	catch (e) {
		return Promise.reject(e);
	}
}