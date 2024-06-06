/**
 * @Author AngusYoung <angusyoung@mrxcool.com>
 * @Description 微信公众号接收数据并解析
 * @Since 2024/6/6
 */

const util = require('../../utils');

module.exports = (req) => {
	return new Promise((resolve, reject) => {
		let data = '';
		req.on('data', chuck => {
			data += chuck;
		});
		req.on('end', () => {
			if (data.substring(0, 5) === '<xml>') {
				util.xmlParser(data, {trim: true, explicitArray: false}, (err, xmlResult) => {
					if (err) {
						return reject(err);
					}
					resolve(xmlResult.xml);
				});
			}
			else {
				resolve(JSON.parse(data));
			}
		});
		req.on('error', () => {
			reject();
		});
	});
}