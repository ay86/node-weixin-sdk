/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号消息推送内容 XML 生成
 * @Since 2020/2/3
 */

const util = require('../../utils');

module.exports = function({type = 'text', gzhName, userOpenId, content = ''}) {
	let xml = {
		'ToUserName'  : userOpenId,
		'FromUserName': gzhName,
		'CreateTime'  : Math.round(new Date().getTime() / 1000),
		'MsgType'     : type
	};
	switch (type) {
		case 'image':
			Object.assign(xml, {
				Image: {
					MediaId: content.id
				}
			});
			break;
		case 'voice':
			Object.assign(xml, {
				Voice: {
					MediaId: content.id
				}
			});
			break;
		case 'video':
			Object.assign(xml, {
				Video: {
					MediaId    : content.id,
					Title      : content.title,
					Description: content.description
				}
			});
			break;
		case 'music':
			Object.assign(xml, {
				Music: {
					Title       : content.title,
					Description : content.description,
					MusicUrl    : content.url,
					HQMusicUrl  : content.hqUrl,
					ThumbMediaId: content.id
				}
			});
			break;
		case 'news':
			Object.assign(xml, {
				ArticleCount: 1,
				Articles    : [
					{
						item: {
							Title      : content.title,
							Description: content.description,
							PicUrl     : content.picUrl,
							Url        : content.url
						}
					}
				]
			});
			break;
		case 'encrypt':
			xml = {...content};
			break;
		default:
			xml['Content'] = content;
	}
	return util.xmlBuilder.buildObject(xml);
};
