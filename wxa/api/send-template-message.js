/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 发送微信小程序模板消息
 * @Deprecated
 * @Since 2020/2/4
 */

const axios = require('axios');

module.exports = function (sOpenId, oTemplate) {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + sToken, {
					touser          : sOpenId,
					template_id     : oTemplate.id,
					page            : oTemplate.page,
					form_id         : oTemplate.formId,
					data            : oTemplate.data,
					emphasis_keyword: oTemplate.keyword
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
				)
			});
		},
		error => {
			return Promise.reject(error);
		}
	);
};
