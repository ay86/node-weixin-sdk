# 微信公众号 API

- send
- token
- sign
- userInfo

## 使用
1. sign() 验证是否合法请求
2. 在需要 token 的地方先调用 token() 方法获取 token
3. send() / userInfo() 等方法默认调用了 token() 所以直接使用即可