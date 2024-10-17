/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 下载微信支付平台证书
 * @Since 2024/10/17
 */

const fs = require('node:fs');
const axios = require('axios');
const utils = require('../../../utils');

module.exports = async function(distPath) {
	const conf = this.config;
	const apiPath = '/v3/certificates';
	const url = this.apiDomain + apiPath;
	const signHeader = await this.signHeader(apiPath, 'GET', '');
	return new Promise((resolve, reject) => {
		if (!distPath || !fs.existsSync(distPath)) {
			return reject({errcode: 400, errmsg: '证书存放目标无效'});
		}
		const stats = fs.statSync(distPath);
		if (!stats.isDirectory()) {
			return reject({errcode: 400, errmsg: '证书存放目标不是有效目录'});
		}
		axios.get(url, {
			headers: {
				...signHeader
			}
		}).then(
				({data}) => {
					let certs = [];
					if (data.data && data.data.length > 0) {
						certs = data.data.map(item => {
							const {encrypt_certificate, ...cert} = item;
							const filename = distPath + '/' + item.serial_no + '.pem';
							Object.assign(cert, {filename});
							// 如果证书文件已存在则不进行处理
							if (fs.existsSync(filename)) {
								return cert;
							}
							// 解密数据
							const {ciphertext, nonce, algorithm, associated_data} = item.encrypt_certificate;
							let certData = '';
							if (algorithm === 'AEAD_AES_256_GCM') {
								// 使用 AEAD_AES_256_GCM 解密
								certData = utils.aes256gcmDecrypt(ciphertext, conf.pay.mchKeyV3, nonce, associated_data);
							}
							// 保存证书到本地目标目录
							fs.writeFileSync(filename, certData);
							return cert;
						});
					}
					resolve(certs);
				}
		).catch(
				error => {
					if (error.response) {
						let {status, statusText, data} = error.response;
						reject({errcode: status, errmsg: statusText, data});
					}
					else {
						reject({errcode: 500, errmsg: error.message});
					}
				}
		);
	});
}