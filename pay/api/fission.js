/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 裂变红包
 * @Since 2020/2/4
 */

const https = require('https');
const axios = require('axios');
const util = require('../../utils');

module.exports = function (packInfo) {
	const conf = this.config;
	const certFile = this.certFile;
	return new Promise(((resolve, reject) => {
		const oParams = {
			nonce_str   : util.randomString(),
			mch_billno  : util.orderNum(),
			mch_id      : conf.pay.mchId,
			wxappid     : conf.appId,
			send_name   : packInfo.sendName,
			re_openid   : packInfo.openid,
			total_amount: util.toCent(packInfo.amount),
			total_num   : packInfo.total,
			amt_type    : 'ALL_RAND',
			wishing     : packInfo.wishing,
			act_name    : packInfo.title,
			remark      : packInfo.remark,
			scene_id    : 'PRODUCT_1'
		};
		oParams.sign = this.paySign(oParams);
		const sRedPacketXML = util.xmlBuilder.buildObject(oParams);
		const agent = new https.Agent({
			pfx       : certFile,
			passphrase: conf.pay.mchId
		});
		axios.post('https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack', sRedPacketXML, {
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
								msg: jXml['return_msg']
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
	}));
};
