/**
 * @Author AngusYoung <angusyoung@mrxcool.com>
 * @Description 微信公众号接收数据并解析
 * @Since 2024/6/6
 */

const util = require('../../utils');

function parseXml(data) {
	if (data.substring(0, 5) === '<xml>') {
		return new Promise((resolve, reject) => {
			util.xmlParser(data, {trim: true, explicitArray: false}, (err, xmlResult) => {
				if (err) {
					return reject(err);
				}
				resolve(xmlResult.xml);
			});
		})
	}
	else {
		return JSON.parse(data);
	}
}

module.exports = function(req) {
	const sdk = this;
	return new Promise((resolve, reject) => {
		async function checkData(data) {
			// 如果是加密的数据先验证
			if ('Encrypt' in data) {
				// 验证签名
				const token = sdk.config.token;
				const arr = [token, req.query.timestamp, req.query.nonce, data.Encrypt];
				const checkStr = arr.sort().join('');
				if (req.query['msg_signature'] !== util.sha1(checkStr)) {
					return reject({errcode: 40178, errmsg: '签名错误'});
				}
				// 解密
				const [err, result] = sdk.decrypt(data.Encrypt);
				if (err) {
					reject(err);
				}
				else {
					resolve(await parseXml(result.content));
				}
			}
			else {
				// 非加密模式直接返回
				resolve(data);
			}
		}

		if (Object.keys(req.body).length) {
			return checkData(req.body);
		}
		let data = '';
		req.on('data', chuck => {
			data += chuck;
		});
		req.on('end', async () => {
			checkData(await parseXml(data));
		});
		req.on('error', () => {
			reject();
		});
	});
}