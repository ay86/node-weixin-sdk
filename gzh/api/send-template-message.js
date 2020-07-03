/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 发送公众号模板消息
 * @Since 2020/7/3
 */

const axios = require('axios');

module.exports = function (sOpenId, oTemplate) {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				axios.post('https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + sToken, {
					touser     : sOpenId,
					template_id: oTemplate.id,
					url        : oTemplate.url,
					miniprogram: oTemplate.wxa,
					data       : oTemplate.data
				}).then(
					({data: jRes}) => {
						if (jRes.errcode) {
							reject(jRes);
						}
						else {
							resolve(true);
						}
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
		},
		error => {
			return Promise.reject(error);
		}
	);
}
