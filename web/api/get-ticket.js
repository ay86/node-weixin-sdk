/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 获取授权凭证
 * @Since 2020/2/3
 */

const axios = require('axios');
const util = require('../../utils');
const cache = util.cache;

module.exports = function () {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				const sTicket = cache.get('web.ticket');
				// 检查 ticket 是否过期
				if (!sTicket) {
					axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
						params: {
							access_token: sToken,
							type        : 'jsapi'
						}
					}).then(
						({data: jRes}) => {
							if (jRes.errcode) {
								reject(jRes);
							}
							else {
								cache.set('web.ticket', jRes.ticket, (jRes.expires_in - 100) * 1000);
								resolve(jRes.ticket);
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
				}
				else {
					resolve(sTicket);
				}
			});
		},
		error => {
			return Promise.reject(error);
		}
	);
};
