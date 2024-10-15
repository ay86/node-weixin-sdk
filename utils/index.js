/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Utils
 * @Since 2020/2/3
 */

const crypto = require('node:crypto');
const xml2js = require('xml2js');
const {LRUCache: Lru} = require('lru-cache');

const cache = new Lru({
	max   : 5000,
	maxAge: 1000 * 60 * 60 * 2 // 2h
});

const WXBizDataCrypt = require('./WXBizDataCrypt');
const xmlBuilder = new xml2js.Builder({headless: true, rootName: 'xml', cdata: true});
const xmlParser = xml2js.parseString;

function PKCS7Padding(sData, sKey) {
	const deCipher = crypto.createDecipheriv('aes-256-ecb', sKey, "");
	// deCipher.setAutoPadding(true);
	return deCipher.update(sData, 'base64', 'utf8') + deCipher.final('utf8');
}

function sha1(source) {
	return crypto.createHash('sha1')
			.update(source, 'utf-8').digest('hex');
}

function md5(sResult) {
	return crypto.createHash('md5')
			.update(sResult).digest('hex').toUpperCase();
}

function randomString(nLen = 30) {
	const nNumber = Math.random();
	const sNumber = nNumber.toString().replace('.', '') + new Date().getTime();
	const aResult = [];
	for (let _i = 0; _i < sNumber.length; _i++) {
		let nCode = sNumber.substr(_i, 1) - 0;
		if (_i % 2 === 0) {
			aResult.push(nCode);
		}
		else {
			aResult.push(String.fromCharCode(65 + nCode));
		}
	}
	return aResult.join('').substr(0, nLen);
}

function orderNum() {
	return new Date().getTime() + Math.random().toString().substr(3, 4);
}

function wxTimestamp() {
	return Math.round(new Date().getTime() / 1000).toString();
}

function v3Sign(api, body) {
	const data = ['POST'];
	const timestamp = wxTimestamp();
	const nonce = randomString();
	data.push(api);
	data.push(timestamp);
	data.push(nonce);
	data.push(JSON.stringify(body));
	const source = data.join('\n') + '\n';
	// 使用商户私钥对待签名串进行SHA256 with RSA签名
	const sign = crypto.createSign('RSA-SHA256');
	sign.update(source);
	const signature = sign.sign(this.privateKey, 'base64');
	return {
		'timestamp': timestamp,
		'nonce'    : nonce,
		'sign'     : signature
	};
}

module.exports = {
	cache,
	xmlBuilder,
	xmlParser,
	v3Sign,
	sha1,
	md5,
	PKCS7Padding,
	WXBizDataCrypt,
	randomString,
	orderNum,
	wxTimestamp,
	toCent(amount) {
		return Math.round(amount * 100); // 微信支付的金额由元转为分
	}
};
