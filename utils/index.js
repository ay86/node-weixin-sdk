/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description Utils
 * @Since 2020/2/3
 */

const crypto = require('crypto');
const xml2js = require('xml2js');
const Lru = require('lru-cache');

const cache = new Lru({
	max   : 5000,
	maxAge: 1000 * 60 * 60 * 2 // 2h
});

const WXBizDataCrypt = require('./WXBizDataCrypt');
const xmlBuilder = new xml2js.Builder({headless: true, rootName: 'xml', cdata: true});
const xmlParser = xml2js.parseString;

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

module.exports = {
	cache,
	xmlBuilder,
	xmlParser,
	sha1,
	md5,
	WXBizDataCrypt,
	randomString,
	orderNum,
	wxTimestamp,
	toCent(amount) {
		return Math.round(amount * 100); // 微信支付的金额由元转为分
	}
};
