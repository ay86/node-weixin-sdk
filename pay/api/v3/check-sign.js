/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 检测回调签名
 * @Since 2024/10/17
 */

module.exports = function(request) {
	if (!request) {
		return Promise.reject({errcode: 400, errmsg: '请求参数错误'});
	}
	const serialNo = request.get('Wechatpay-Serial');
	const timestamp = request.get('Wechatpay-Timestamp');
	const nonce = request.get('Wechatpay-Nonce');
	const signature = request.get('Wechatpay-Signature');
	// 如果时间戳超过5分钟则拒绝处理
	if (Date.now() - timestamp * 1000 > 5 * 60 * 1000) {
		return Promise.reject({errcode: 400, errmsg: '签名超时'});
	}
	// 获取证书并解密数据来验证签名
	this.getCert(serialNo).then(
			certData => {
				const data = [];
				data.push(timestamp);
				data.push(nonce);
				data.push(request.body ? JSON.stringify(request.body) : '');
				const source = data.join('\n') + '\n';
				const verifier = crypto.createVerify('RSA-SHA256');
				verifier.update(source);
				const verify = verifier.verify(certData, signature, 'base64');
				if (!verify) {
					return Promise.reject({errcode: 400, errmsg: '签名错误'});
				}
				return Promise.resolve();
			}
	);
}