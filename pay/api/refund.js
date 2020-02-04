/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 退款
 * @Since 2020/2/4
 */

const https = require('https');
const axios = require('axios');
const util = require('../../utils');

module.exports = function ({payNo, itemNo, detail, amount, price}) {
	const conf = this.config;
	const certFile = this.certFile;
	return new Promise((resolve, reject) => {
		const oParams = {
			appid        : conf.appId,
			mch_id       : conf.pay.mchId,
			nonce_str    : util.randomString(),
			sign_type    : 'MD5',
			out_trade_no : payNo,
			out_refund_no: itemNo,
			total_fee    : util.toCent(amount),
			refund_fee   : util.toCent(price),
			refund_desc  : detail,
			notify_url   : conf.pay.refundNotify
		};
		oParams.sign = this.paySign(oParams);
		const sRefundXML = util.xmlBuilder.buildObject(oParams);
		const agent = new https.Agent({
			pfx       : certFile,
			passphrase: conf.pay.mchId
		});
		axios.post('https://api.mch.weixin.qq.com/secapi/pay/refund', sRefundXML, {
			headers   : {
				'Content-Type': 'text/xml'
			},
			httpsAgent: agent
		}).then(
			({data: xml}) => {
				util.xmlParser(xml, {trim: true, explicitArray: false}, (err, result) => {
					if (err) {
						reject(err);
					}
					else {
						const jXml = result.xml;
						if (jXml['return_code'] === 'SUCCESS' && jXml['result_code'] === 'SUCCESS') {
							resolve({
								refundNo : jXml['refund_id'],
								refundFee: jXml['refund_fee']
							});
						}
						else {
							reject({
								errcode: jXml['err_code'],
								errmsg : jXml['err_code_des'] || jXml['return_msg']
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
