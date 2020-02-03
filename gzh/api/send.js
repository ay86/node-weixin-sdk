/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号消息发送
 * @Since 2020/2/3
 */

const axios = require('axios');

module.exports = function (oMessage) {
	return this.token().then(
		sToken => {
			return new Promise((resolve, reject) => {
				let _msg = {
					touser : oMessage.to,
					msgtype: oMessage.msgType
				};

				switch (oMessage.msgType) {
					case 'mpnews':
						_msg.mpnews = {media_id: oMessage.content};
						break;
					case 'news':
						_msg.news = {articles: oMessage.content};
						break;
					case 'image':
						_msg.image = {media_id: oMessage.content};
						break;
					case 'voice':
						_msg.voice = {media_id: oMessage.content};
						break;
					case 'video':
						_msg.video = {
							media_id      : oMessage.content,
							thumb_media_id: '',
							title         : '视频',
							description   : '视频说明'
						};
						break;
					case 'music':
						_msg.music = {
							title         : '音乐',
							description   : '音乐说明',
							musicurl      : '',
							hqmusicurl    : '',
							thumb_media_id: oMessage.content
						};
						break;
					case 'wxcard':
						_msg.wxcard = {card_id: oMessage.content};
						break;
					case 'miniprogrampage':
						_msg.miniprogrampage = {
							title         : '小程序',
							appid         : '',
							pagepath      : '',
							thumb_media_id: ''
						};
						break;
					default:
						_msg.text = {content: oMessage.content};
						break;
				}

				// 加上客服人员信息
				// _msg.customservice = {kf_account: ''};

				axios.post('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' + sToken, _msg).then(
					({data: jRes}) => {
						if (jRes.errcode) {
							reject(jRes);
						}
						else {
							resolve(jRes);
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
};
