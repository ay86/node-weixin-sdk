/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 预支付订单
 * @Since 2020/2/4
 */

const axios = require('axios');
const util = require('../../utils');

module.exports = function (orderInfo
	                           = {
	openid: '', title: '', note: '', no: '', userIp: '',
	type  : 'JSAPI', productId: '', noCredit: false, currency: 'CNY'
}) {
	const conf = this.config;
	return new Promise((resolve, reject) => {
		const oParams = {
			appid           : conf.appId,
			mch_id          : conf.pay.mchId,
			nonce_str       : util.randomString(),
			body            : orderInfo.title,
			attach          : orderInfo.note,
			out_trade_no    : orderInfo.no,
			total_fee       : util.toCent(orderInfo.amount),
			spbill_create_ip: orderInfo.userIp,
			notify_url      : conf.pay.payNotify,
			trade_type      : orderInfo.type,
			product_id      : orderInfo.productId,
			limit_pay       : orderInfo.noCredit ? 'no_credit' : '',
			openid          : orderInfo.openid,
			fee_type        : orderInfo.currency || 'CNY'
		};
		oParams.sign = this.paySign(oParams);
		const sOrderXML = util.xmlBuilder.buildObject(oParams);
		axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', sOrderXML, {
			headers: {
				'Content-Type': 'text/xml'
			}
		}).then(
			({data: xml}) => {
				util.xmlParser(xml, {trim: true, explicitArray: false}, (err, result) => {
					if (err) {
						reject(err);
					}
					else {
						const jXml = result.xml;
						if (jXml['return_code'] === 'SUCCESS' && jXml['result_code'] === 'SUCCESS') {
							const _config = {
								appId    : conf.appId,
								timeStamp: Math.round(new Date().getTime() / 1000).toString(),
								nonceStr : util.randomString(),
								package  : 'prepay_id=' + jXml['prepay_id'],
								signType : 'MD5'
							};
							_config.paySign = this.paySign(_config);
							resolve({
								orderId  : jXml['prepay_id'],
								expired  : 7200,
								payConfig: _config
							});
						}
						else {
							reject({
								errcode: jXml['return_code'],
								errmsg : jXml['return_msg']
							});
						}
					}
				});
			},
			error => {
				if (error.response) {
					let {status, statusText, data} = error.response;
					reject({errcode: status, errmsg: statusText, data});
				}
				else {
					reject({errcode: 400});
				}
			}
		);
	});
};
