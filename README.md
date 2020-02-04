# node-weixin-sdk
    Weixin (WeChat) Node serve SDK

## 使用

* [web 微信网页应用](web/README.md)
* [gzh 微信公众号](gzh/README.md)
* [pay 微信支付](pay/README.md)
* [wxa 微信小程序](wxa/README.md)

## 配置

```json
{
    "appId" : "",
    "secret": "",

    "token" : "", // 公众号开发配置 token
    "AESKey": "", // 公众号开发配置密钥

    "pay": {
        "mchId"       : "", // 微信支付商户号
        "mchKey"      : "", // 微信支付 API key
        "serverIp"    : "", // 服务器 IP
        "payNotify"   : "", // 支付结果通知 URL
        "refundNotify": "", // 退款结果通知 URL
        "certPath"    : ""  // 支付证书本地存放路径
    }
}
```

# Author

@AngusYoung
