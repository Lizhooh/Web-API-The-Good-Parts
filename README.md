# Web API 的设计与开发

## 说明

丰富了附录 B 中的 Web API 检查清单，给予了一些必要的解释与说明，方便大家快速学习。

另外，以下只是作者的建议，使用需结合实际情况。

## 检查清单

### URI 是否短小且容易输入

```md
好的例子：http://api.example.com/search
坏的例子：http://api.example.com/service/api/search。

域名已经是 api，在 URI 就没有必要重复一些毫无意义的单词。
```

### URI 是否能让人一眼看懂

```md
不要轻易使用缩写：http://api.example.com/sv/u
使用更地道的英语表达，比如搜索接口一般用 search 而不是 find，可以多参照一些国外大厂的 API。
```

### URI 是否只有小写字母组成

```md
HTTP 协议指定了：URL 中除了 schema 和hostname 不区分大小写，其他部分均大小写敏感。
因此，URI 应该使用小写，禁止大小写混写。
```

### URI 是否容易修改

```md
比如获取某个商品信息的 URI 应该长这样：http://api.example.com/v1/items/12346
从 URI 直观的即可知道获取 56780 商品的 URI 是这样：http://api.example.com/v1/items/56780。

开发者对 URI 的行为理解是自然的，不费心的。
```

### URI 是否反映了服务端的架构

```md
不要暴露服务端是哪种开发语言，下面是错误的例子：
http://api.example.com/cgi-bin/get_user.php?user=100
```

### URI 规则是否统一

```md
URI 中的词汇和结构应该保持统一。

下面是一个错误的例子：

获取好友信息：http://api.example.com/friends?id=100
发送信息：http://api.example.com/friend/100/messages

首先，friends 和friend 的单复数形式不统一，你可以想象 API 使用者是如何被这种细小的差异坑了半天。
其次，一个通过 get 参数传参，一个通过 URI 路径传参，不够统一。

一个正确的例子：
获取好友信息：http://api.example.com/friends/100
发送信息：http://api.example.com/friends/100/messages

该例子遵循 REST 风格，下面讲解 REST URI 设计风格。
```

### 有没有使用合适的 HTTP 方法

```md
作者强调 REST 风格。

HTTP 方法表示"进行怎样的操作"，URI 表示"资源"，HTTP 和URI 一起则表示"对什么资源做什么操作"。

- GET：获取资源

获取 ID=100 的好友信息，
GET http://api.example.com/friends/100

- POST：新增资源

添加一位好友，相当于新建一个好友关系：
POST http://api.example.com/friends

- PUT：更新已有资源

更新 ID=100 的好友信息（例如：更新备注信息），
PUT http://api.example.com/friends/100

- PATCH：更新部分资源

和 PUT 类似，只是强调更新资源的部分信息，不常用。

- DELETE：删除资源

删除 ID=100 的好友信息：
DELETE http://api.example.com/friends/100

- HEAD：获取资源的元信息

这个作者没有详细去说一个资源的元信息应该是什么样的。

感觉和自己设计的 API 不太一样吧？这就是 REST 风格，常见于国外各种大厂。
```

### URI 里用到的单词所表达的意思是否和大部分 API 相同

```md
有点重复，还是强调对于非英语母语的开发者，应该注意使用地道准确的单词。
比如，照片应该用 photo 而不是 picture。
```

### URI 里用到的名词是否采用了复数形式

```md
因为 URI 表示资源的集合，所以作者是建议总是使用复数形式。

正确的例子：http://api.example.com/friends/100
错误的例子：http://api.example.com/friend/100

另外，因为 REST 风格强调 URI 是资源，所以不应该在 URI 里出现动词，因为动作是 HTTP 方法表达的。

错误的例子：http://api.example.com/get_friend?id=100
```

### URI 里有没有空格符以及需要编码的字符

```md
URL 是会被 urlencode 编码的，所以不要在 URI 里使用空格（会被编码成 +）、UTF-8 字符、乱七八糟的符号等。

即不要影响 URI 的可读性。
```

### URI 里的单词和单词之间有没有使用连接符

```md
因为 URL 中的 hostname 不允许使用下划线，所以作者建议 URI 部分总是使用连字符 - 来连接多个单词。
```

### 分页的设计是否恰当

```md
分页参数分 2 种风格，可以按情况使用：

第一种，表示第 3 页，每一页 50 条：
page=3&per_page=50

第二种：表示从 100 条开始的 50 条：
offset=100&limit=50

前者 page 从1 开始增长，后者 offset 从0 开始增长。

前者对用户来说自由度较低，缓存命中率较高。
后者对用户来说自由度较高，缓存命中率较低。

上述翻页风格称为"相对位置"，深度翻页性能差（可以自己扩展学习），如果数据集合有更新，则翻页时可能看到重复内容或者错过一些内容。

与之相对的是"绝对位置"，即指定 last_id 之前的 N 条数据，下次使用新的 last_id 继续获取。（个人理解瀑布流页面比较适合）
```

### 登录有没有使用 OAuth2.0

```md
很常见的认证规范，让用户通过大厂的账号系统登录，并授权给第三方获取用户信息的权限。

作者表达的意思是你如果对外提供 API，应该提供 OAuth2.0 认证，这样第三方调用 API 时携带 access_token，我们即可校验其是否有权使用 API。

最后，作者描述了一下 REST API 的几个等级：

REST LEVEL0：使用 HTTP
REST LEVEL1: 引入资源的概念
REST LEVEL2：引入 HTTP 动词（GET/POST/PUT/DELETE 等）
REST LEVEL3：引入 HATEOAS 概念

本书是 REST LEVEL2。

LEVEL3 中的 HATEOAS 概念尚未普及，其思路是 API 返回的数据中应该包括下一步行为对应的 URI 是什么，客户端请求下一步的 URI 就可以得到进一步的数据。

比如文章列表的返回值：

{
    "articles": [
        {
            "title": "good",
            "uri": "https://api.example.com/v1/articles/12345",
            "rel": "article/detail"
        }
    ]
}

每一篇文章的 uri 告知客户端如何获取文章详情，属于一种高度灵活。
```

### 响应数据格式有没有使用 JSON 作为默认格式

```md
越简单的东西越容易普及，JSON 比XML 简单的多，也满足需求，另外 Javascript 天然支持 json。

客户端没有明确指定返回值格式的话，JSON 应该作为默认的返回值格式。
```

### 是否支持通过查询参数来指定数据格式

```md
如果服务端支持多种返回数据格式，那么客户端可以指定。

通过 get 参数：
https://api.example.com/v1/users?format=xml

通过扩展名：
https://api.example.com/v1/users.xml

通过 HTTP 头部：
GET/v1/users
Host:api.example.com
Accept:application/xml

作者建议首先使用 HTTP 头部，因为更符合 HTTP 协议规范；其次使用查询参数，避免使用扩展名。
```

### 是否支持不必要的 JSONP

```md
JSONP 可以实现跨域 HTTP 调用，其原理是基于`<script>`加载一段服务端的 javascript 代码（自行扩展学习）。

API 如果决定支持 JSONP，可以在服务端判定客户端是否上传了 callback 参数，如果上传了就返回 jsonp 格式。

客户端为了区分不同的 JSONP 调用，需要为每个 JSONP 调用生成一个唯一的全局回调函数名，这一点 Jquery 可以帮我们实现。

出于正确性与安全性考虑，JSONP 服务端返回时应该设置 Content-Type:application/javascript 而不是 application/json，因为返回的是一段 js 函数调用代码。

作者提到，JSONP 因为是作为一个 script 引入的，服务端可以通过 2 种方式返回错误信息：
1）在 json 响应体里放置 error 信息
2）在 callback 之外支持 error_callback 传参
```

### 响应数据的内容能不能从客户端指定

```md
有时调用方只需要部分信息，比如：用户信息接口只希望获取用户 ID，这样可以节约通讯量。

此类接口可以通过类似 fields 的get 参数来指定返回哪些信息：
http://api.example.com/v1/users/12345?fields=name, age

另外也可以提前准备几种返回值的组合，称为响应群（response group），比如:
http://api.example.com/v1/users/12345?group=basic_info
其中，basic_info 表示返回用户的基础信息，例如 name 和age。
```

### 响应数据中是否存在不必要的封装

```md
作者出于 rest 风格原因，建议把错误码和错误信息放在 http header 里，而不是放在 body 里。

一个错误的例子：
HTTP/1.1 200 OK
{
    "error_code": 500,
    "error_msg": "参数错误",
    "data": {}
}
作者认为 HTTP 返回 200，但内容却表达了 500 失败，这样很奇怪，很不 rest。

rest 风格更建议用下面这种方式：
HTTP/1.1 500 参数错误
{
    "data":{}
}
```

### 响应数据的结构有没有尽量做到扁平化

```md
不要在 JSON 中增加无意义的多余层级，尽可能扁平化。

一个错误的例子：
{
    "id": 12345,
    "name": "hahaha",
    "profile": {
        "birthday": "0203",
        "gender": "male",
        "language": ["zh", "en"]
    }
}

增加 profile 并没有带来什么价值，不如扁平化：
{
    "id": 12345,
    "name": "hahaha",
    "birthday": "0203",
    "gender": "male",
    "language": ["zh", "en"]
}

不仅访问起来方便，而且传输的内容也少了。
```

### 响应数据有没有用对象来描述，而不是用数组

```md
作者建议 JSON 返回值总是使用 {} 作为返回值的最外层，而不要直接返回数组 []。

正确的例子：
{
    "articles": [
        { "id": 1 },
        { "id": 2 }
        ...
    ]
}
错误的例子：
[
    { "id": 1 },
    { "id": 2 }
]

这样做有 2 个次要的理由：
1，因为从字面看，articles 能直接表达数据的含义
2，客户端在处理 JSON 应答时，可以统一将最外层作为对象去解析，不需要为数组做适配。
3，有一些安全性考虑，后面会提到。
```

### 响应数据的名称所选用的单词的意思是否和大部分 API 相同

```md
对非英语母语的人，多模仿大厂使用的常见单词。
```

### 响应数据的名称有没有用尽可能少的单词来描述

```md
关于用户注册时间字段，

错误的例子：userRegistraionDataTime
这个单词太长了，很容易打错，也不容易记忆。

正确的例子：registeredAt
```

### 响应数据的名称由多个单词连接而成时，连接方法在整个 API 里是否一致

```md
有几种连接单词的方法：
1，user_id：蛇形法
2，user-id：脊柱法
3，userId：驼峰法

在 JSON 和Javascript 中，都是建议使用驼峰法的，但是保持风格一致是最重要的。
```

### 响应数据的名称有没有使用奇怪的缩写形式

```md
尽量避免奇怪的缩写，比如 timezone 写成 tz。

如果出于数据量大小的考虑而采用缩写，属于特殊情况。
```
### 响应数据的名称的单复数形式是否和数据内容相一致

```md
只为数组采用复数，比如 friends。
其他情况使用单数。

一致的命名风格，API 使用者会顺其自然，养成习惯。
```

### 出错时响应数据中是否包含有助于客户端剖析原因的信息

```md
出错时，响应信息应该包含 2 部分：
1，错误码
2，错误原因

作者建议使用 http header 返回错误码，每种错误码的含义如下：

1xx：消息
2xx：成功
3xx：重定向
4xx：客户端原因引起的错误
5xx：服务端原因引起的错误

而不是在 JSON 中设置一个 error_code 字段，因为 http code 本身就是这个意思。

当 http code 为4xx 或者 5xx 时，需要进一步告知客户端错误原因，这时候有 2 种做法：
1，在 http header 里自定义一些头部信息，保存错误原因，例如：
X-ERROR-MESSAGE:params error
2，在 body 中返回 JSON 格式的错误信息：
{
    "errors":[{
        "message":"参数 fields 错误"
    }, {
        "message":"参数 last_id 错误"
    }]
}
作者建议采用第 2 种方式，因为可以描述多个错误原因，并且很多大厂都是这么做的。
```

### 出错时有没有返回 HTML 数据

```md
当服务端发生错误时，很多 web 框架会打印一个 html 错误信息页面。

对于 API 来说，当发生错误时也应该返回一个合法的 JSON 结构，因为客户端假设服务端返回 JSON，返回 HTML 可能导致异常。
```

### 有没有返回合适的状态码

```md
这一条规则有点重复，主要是指返回适当的 http code。
```

### 服务器端在维护时有没有返回 503 状态码

```md
当服务器需要停机维护时，按照 Google 爬虫的建议，应该返回 503 错误码，并且在 header 中告知维护的结束时间：

503 Service Temporarily Unavailable
Retry-After:Mon, 2 Dec 2013 03:00:00 GMT

这遵循 HTTP1.1 规范，客户端需要实现逻辑去识别这个情况，但是至少 google 爬虫会去理解这些信息。
```

### 有没有返回合适的媒体类型

```md
有的 HTTP 客户端会校验应答中的 Content-Type 字段，因此服务端如果返回的是 JSON，那么就应该返回 Content-Type:application/json 而不是 Content-Type:text/html，这样避免一些严格的客户端出现解析失败。
```

### 必要时能不能支持 CORS

```md
浏览器有同源策略，禁止跨域 Ajax 请求。

API 可以支持 CORS 跨域资源共享，比如 http://www.example.com 请求 http://api.example.com 的API 时应该携带请求的来源：
Origin:http://www.example.com

服务端只允许某些来源的跨域调用，如果 Origin 合法就在返回中携带：

Access-Control-Allow-Origin: http://www.example.com
或者
Access-Control-Allow-Origin:*

浏览器看到这样的应答，就会把 ajax 请求正常执行完成，否则会报告 ajax 调用失败。

对于一些特殊场景，浏览器会采用"事先请求"的方式，先通过一个 OPTION 方法调用到对应的接口来试探服务端是否返回 Access-Control-Allow-Origin，如果没有返回则不发起真正的数据请求。

CORS 客户端默认不会传输 cookie，我们在发起 ajax 前设置 XHTTPRequest.withCredentials=true，并且服务端必须返回 header：Access-Control-Allow-Credentials:true，否则这次 ajax 调用将报告失败。
```

### 有没有返回 Cache-Control、ETag、Last-Modified、Vary 等首部以便客户端采用合适的缓存策略

```md
缓存模型分 2 种：
1，过期模型：Expires、Cache-Control
2，验证模型：Last-Modified、ETag

过期模型是指，浏览器在过期之间直接使用本地缓存文件，下面是一个例子：
Expires:Fri, 01 Jan 2016 00:00:00 GMT
Cache-Control:max-age=3600

Cache-Control 是HTTP1.1 协议出现的，Expires 是HTTP1.0，前者优先级更高。
并且 HTTP1.1 协议也规定，缓存时间不应超过 1 年，但实际上客户端可能没有遵循这个约束。

验证模型是指，客户端照常发起请求，但在 header 中携带附加条件，服务器根据附加条件判断若数据没有修改则返回 304，客户端直接使用本地缓存即可，否则返回 200 并携带内容。

下面是个例子，

请求：
GET/v1/users/12345
If-Modified-Since:Tue, 01 Jul 2014 00:00:00 GMT
If-None-Match:"ff39b31e285573ee373af0d492aca581"
应答：
HTTP/1.1 304 Not Modified
Last-Modified:Tue, 01 Jul 2014 00:00:00 GMT
ETag:"ff39b31e285573ee373af0d492aca581"

需要注意 ETag 分为强验证和弱验证：
强验证是指资源的真实内容完全不能变，弱验证是指逻辑上资源没有改变即可。
```

### 不想缓存的数据有没有添加 Cache-Control:no-cache 首部信息

```md
如果不希望被客户端缓存，可以指定 Cache-Control:no-cache。

如果你的 API 前面存在反向代理缓存，可以额外声明 Cache-Control:no-store，这样代理服务器也不会缓存数据了。

客户端可能多次请求同一个 API，但是请求的 http header 不同，导致返回的内容结构不同，比如：

客户端携带 Accept:application/json，则服务端返回的是 JSON。
客户端携带 Accept:application/xml，则服务端返回的是 XML。

如果反向代理根据 URI 缓存，则会导致无法根据客户端的要求返回正确格式，此时我们 API 应该在返回值里携带 Vary:Accept，这样缓存服务器会为不同的 Accept 分别缓存。
```

### 有没有对 API 进行版本管理

```md
一般 API 会不断的迭代功能，有时会出现无法向下兼容的情况。

通常老客户端会依旧使用老版本的 API，新客户端使用新版本的 API，并在合适的时机完全下线掉老版本的 API。
```

### API 版本的命名有没有遵循语义化版本控制规范

```md
作者介绍了语义化版本控制，通常版本号是 a.b.c 这样的，分别表示主版本号，次版本号，补丁版本号。

1，如果软件 API 没有变更，只是修复服务端 BUG，那么就增加补丁版本号
2，对软件 API 实施了向下兼容的变更，增加次版本号
3，对软件 API 实施了不向下兼容的变更时，增加主版本号
```

### 有没有在 URI 里嵌入主版本编号，并且能够让人一目了然

```md
对于 Web API 来说，作者建议在 URI 中嵌入主版本号即可，例如：
http://api.example.com/v1/users

整体原则是，尽量保持向下兼容，这样 URI 不会改变，老用户不需要迁移。

还有一个问题是，如果不带版本号访问应该套用哪个版本的接口？谷歌的做法是使用最老版本，这样就不会影响那些老用户了。
```

### 有没有考虑 API 终止提供时的相关事项

```md
停止 API 时应该让 API 返回 410 错误码，它代表接口不再对外公开。

如果客户端是公司的产品，则可以强制客户端升级，避免停止 API 导致用户无法使用。
```

### 有没有在文档里明确注明 API 的最低提供期限

```md
错误的例子：

该 API 2018-06-01 下线，请注意迁移。

正确的例子：

该 API 将继续维护 12 个月，请您尽快迁移。

错误的例子把期限说的太死了，而正确的例子则留了余地（比如再维护额外的 12 个月），使用者的感受会好很多。
```

### 有没有使用 HTTPS 来提供 API

```md
HTTP 是明文传输，可以被任意劫持。

HTTPS 采用 SSL 通讯，保障数据安全。但是 HTTPS 要求客户端严格验证证书的真伪，否则中间人可以伪造证书实施攻击。

另外，作者强调 HTTPS 会导致请求变慢，但相比安全性仍然是值得做的。
```

### 有没有认真执行 JSON 转义

```md
一个这样的 JSON，如果按照 Content-Type:text/html 被浏览器解析，其中的 js 就会被执行：

{"username":"`<script>alert(1)</script>`"}

好在大多数 JSON 库默认会在编码时会进行适当的转义，因此最终得不到执行：

{"username":"`<script>alert(1)<\/script>`"}

所以 API 应该返回完整转义过的 JSON 串，为了稳妥也应该设置 Content-Type:application/json，避免浏览器将 JSON 当做 html 解析，导致攻击者得以实施 XSS 攻击。
```

### 能不能识别 X-Request-With 首部，让浏览器无法通过 SCRIPT 元素读取 JSON 数据

```md
假设 https://api.example.com/v1/users/me 是获取当前登录用户信息的接口。

攻击者在自己的网站通过`<script src="https://api.example.com/v1/users/me"language="vbscript"></script>`可以实施攻击。
因为接口返回的是 JSON，而加载时指定了 vb 语言肯定是无法解析成功的，因此攻击者通过设置 window.onerror=function(err) {} 即可被浏览器回调，从而从错误信息中获取到用户信息。

解决这个问题的方法是禁止通过 script 标签调用 API，判定方法就是服务端判断请求中是否有 Header X-Requested-With，因为 Ajax 请求默认会携带这个 header 而script 不会。
```

### 通过浏览器访问的 API 有没有使用 XSRF token

```md
XSRF 称为跨站点请求伪造。

攻击者在自己的网站做一个 form 表单，提交地址写为目标网站的表单提交地址。当受害者访问攻击者网站时，攻击者通过 javascript 自动提交 form 表单（form.submit），即可完成向目标网站的提交（想象这是一个转账表单）。

form 表单提交不受同源策略（跨域）影响，因此可以达成上述攻击手段。

解决方法就是在表单里生成一次性的 CSRF token 放在隐藏字段中，并把 token 种植在用户 cookie 中，在用户提交表单到 API 时可以检查表单 token 和cookie 中的 token 一致，则允许提交。
```

### API 在接收参数时有没有仔细检查非法的参数（负数等）

```md
作者以减少用户积分的 API 为例，如果传入一个负数积分，会导致减法变成加法，导致用户积分越来越多。

所以 API 需要严格校验参数是否合法。
```

### 有没有做到即使请求重复发送，数据也不会多次更新

```md
作者其实就是想表达幂等性，举了一个支付系统的例子，就不详细描述了。
```

### 有没有在响应消息里添加各种增强安全性的首部

```md
有很多 header 是作者建议总是加在 API 响应头里的，可以给浏览器很多建议，提升安全等级，就不一一描述了。

比较重要的一点是 set-cookie 时的安全问题：
1）Secure 属性：表示 cookie 只能在访问 https 链接时才能被发送给服务端，这样可以彻底避免 cookie 被攻击者在网络中嗅探到。
2）HttpOnly 属性：cookie 仅能供 HTTP 调用时使用，而不允许 javascript 直接获取 cookie，这样可以避免网站出现 XSS 漏洞的时候，攻击者通过 JS 代码把用户的会话 cookie 盗走。
```

### 有没有实施访问限速

```md
限速是为了保护 API 服务，避免超过负载。

限速一般是针对每个用户的，限速的单位是多少分钟内最多访问多少次。

从实际存储上可以采用 Redis，key 的数量大概是"API 的数量 * 用户数量"。

API 超出限速应该返回 429 Too Many Requests 的http code，最好还能给出 Retry-After 告知多久后可以继续使用。
```

### 对预想的用例来说限速的次数有没有设置得过少

```md
一般来说，应该为开放的 API 开发一套 dashboard 管理后台，从而可以灵活的为不同的用户设置不同的限速值，以及查看实时速率以及剩余调用次数等信息。
```


