/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 支付通知 V3
 * @Since 2024/10/17
 */

module.exports = function(request) {
	if (!request) {
		return Promise.reject({errcode: 400, errmsg: '请求参数错误'});
	}
	const {event_type, resource} = request.body;
	// 如果没有v3 的参数则返回老的回调
	if (event_type !== "TRANSACTION.SUCCESS") {
		return this.notifyOld(request);
	}
	// 验证签名
	return this.checkSign(request).then(
			() => {
				// 解密数据并返回
				return this.decrypt(resource);
			}
	);
}