/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取微信支付证书
 * @Since 2024/10/17
 */

const fs = require('node:fs');

module.exports = function(serialNo) {
	const conf = this.config;
	// 平台证书的存放路径
	const dir = conf.pay.downloadDist;
	const filename = `${ dir }/${ serialNo }.pem`;
	if (fs.existsSync(filename)) {
		return Promise.resolve(fs.readFileSync(filename));
	}
	// 如果对应的证书不存在则请求下载
	return this.downloadWxCert(dir).then(
			certs => {
				const cert = certs.find(item => item.serial_no === serialNo);
				if (cert) {
					return fs.readFileSync(cert.filename);
				}
				return Promise.reject({errcode: 500, errmsg: '证书不存在'});
			}
	);
}