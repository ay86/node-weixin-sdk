/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description native 下单
 * @Since 2024/10/15
 */

const axios = require('axios');
const util = require('../../../utils');

module.exports = function(orderInfo = {title: '', amount: 0, currency: 'CNY', notify: ''}) {
	const conf = this.config;
	const apiPath = '/v3/pay/transactions/native';
	const url = this.$root.apiDomain + apiPath;
	const params = {
		appid       : conf.appId,
		mchid       : conf.pay.mchId,
		description : orderInfo.title ?? '',
		out_trade_no: orderInfo.no,
		amount      : {
			total   : util.toCent(orderInfo.amount),
			currency: orderInfo.currency || 'CNY'
		},
		notify_url  : orderInfo.notify,
	};
	const signatureData = util.v3Sign.call(this, apiPath, params);
	return new Promise((resolve, reject) => {
		axios.post(url, params, {
			headers: {
				'Content-Type' : 'application/json',
				'Accept'       : 'application/json',
				'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${ conf.pay.mchId }",nonce_str="${ signatureData.nonce }",serial_no="${ conf.pay.serialNo }",timestamp="${ signatureData.timestamp }",signature="${ signatureData.sign }"`
			}
		}).then(
				({data}) => {
					resolve(data);
				}
		).catch(
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
}