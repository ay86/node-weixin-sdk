/**
 * @Author Angus <angusyoung@mrxcool.com>
 * @Description 微信公众号消息推送内容 XML 生成
 * @Since 2020/2/3
 */

const xml2js = require('xml2js');

module.exports = function ({type = 'text', gzhName, userOpenId, content = ''}) {
	let _xml = {
		'ToUserName'  : userOpenId,
		'FromUserName': gzhName,
		'CreateTime'  : Math.round(new Date().getTime() / 1000),
		'MsgType'     : type
	};
	switch (type) {
		case 'image':
		case 'voice':
		case 'video':
		case 'music':
		case 'news':
			break;
		default:
			_xml['Content'] = content;
	}
	const xmlBuilder = new xml2js.Builder({headless: true, rootName: 'xml', cdata: true});
	return xmlBuilder.buildObject(_xml);
};
