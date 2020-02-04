/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 企业付款
 * @Since 2020/2/4
 */

const https = require('https');
const axios = require('axios');
const util = require('../../utils');

module.exports = function (oOrder) {
	const conf = this.config;
	const certFile = this.certFile;
	return new Promise((resolve, reject) => {
		const oParams = {
			mch_appid       : conf.appId,
			mchid           : conf.pay.mchId,
			nonce_str       : util.randomString(),
			partner_trade_no: util.orderNum(),
			openid          : oOrder.openid,
			check_name      : 'NO_CHECK', //FORCE_CHECK
			re_user_name    : '',
			amount          : util.toCent(oOrder.amount),
			desc            : oOrder.note,
			spbill_create_ip: oOrder.userIp
		};
		oParams.sign = this.paySign(oParams);
		const sMchPayXML = util.xmlBuilder.buildObject(oParams);
		const agent = new https.Agent({
			pfx       : certFile,
			passphrase: conf.pay.mchId
		});
		axios.post('https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers', sMchPayXML, {
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
								orderNumber     : jXml['partner_trade_no'],
								wxPayOrderNumber: jXml['payment_no'],
								payTime         : jXml['payment_time']
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
