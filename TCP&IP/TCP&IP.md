# TCP于UDP的区别

## TCP

TCP(Transmission Control Protocol) 是面向连接的、可靠的流协议。流就是不间断的数据结构，可以想象成排水管道中的水流。当应用程序采用TCP发送消息时，虽然可以保证发送的顺序，但还是犹如没有任何间隔的数据流发送给接收端。
TCP为提供可靠性传输，实行 顺序控制 重发控制。此外还具备 流控制（流量控制） 拥塞控制 提高网络利用率等众多功能

## UDP

UDP(User Datagram Protocol) 是不具有可靠性的数据协议。细微的处理它会交给上层的应用去完成。在UDP的情况下，虽然可以确保发送消息的大小，却不能保证消息一定会达到。因此，应用有时会根据自己的需要进行重发处理。

## [三次握手与四次握手](https://hit-alibaba.github.io/interview/basic/network/TCP.html)

### 三次握手

三次握手（Three-way Handshake），是指建立一个TCP连接时，需要客户端和服务器总共发送3个包。
三次握手的目的时连接服务器指定端口，建立TCP连接，并同步连接双方的序列号和确认号，交换TCP窗口大小信息。

* 第一次握手(SYN=1, seq=x):
  客户端发送一个TCP的SYN标识位置1的包，指明客户端打算连接的服务器的端口，以及初始序号x，保存在包头的序列号(Sequence Number)字段里。
  发送完毕后，客户端进入SYN_SEND状态。
* 第二次握手(SYN=1, ACK=1, seq=y,ACKnum=x+1):x
  服务器发回确认包(ACK)应答。即SYN标识位和ACK标识位均为1。服务器端选择自己ISN序列号，放到Seq域里，同时将确认序号(Acknowledgement Number)设置为客户的ISN加1，即x+1。
  发送完毕后，服务器端进入SYN_RCVD状态。
* 第三次握手(ACK=1, ACKnum=y+1)
  客户端再次发送确认包(ACK)，SYN标识位为0，ACK标识位为1，并且把服务器发来的ACK的序号字段+1，放在确定字段中发送给对方，并且在数据段放写ISN的+1。
  发送完毕后，客户端进入ESTABLISHED状态，当服务器端接收到这个包时，也进入ESTABLISHED状态，TCP握手结束。

### 四次挥手

  TCP的连接的拆除需要发送四个包，因此成为四次挥手(Four-way handshake)，也叫做改进的三次握手。客户端或者服务器端均可主动发起挥手动作。

* 第一次挥手(FIN=1, seq=x)

  假设客户端想要关闭连接，客户端发送一个FIN标识位置为1的包，标识自己已经没有数据可以发送了，但是仍然可以接收数据。
  发送完毕后，客户端进入FIN_WAIT_1状态。
* 第二次挥手(ACK=1, ACKnum=x+1)
  服务器端确认客户端的FIN包，发送一个确认包，表明自己接收到了客户端关闭连接的请求，但还没有准备好关闭连接。
  发送完毕后服务器端进入CLOSE_WAIT状态，客户端接收到这个确认包后，进入FIN_WAIT_2状态，等待服务器端关闭连接。
* 第三次挥手(FIN=1, seq=y)
  服务器端准备好关闭连接时，向客户端发送结束连接请求，FIN置为1。
  发送完毕后，服务器端进入LAST_ACK状态，等待来自客户端的最后一个ACK。
* 第四次挥手(ACK=1, ACKnum=y+1)
  客户端接收到来自服务器端的关闭请求，发送一个确认包，并进入TIME_WAIT状态，等待可能出现的要求重传的ACK包。
  服务器端接收到这个确认包之后，关闭连接，进入CLOSED状态。
  客户端等待了某个固定时间（两个最大段生命周期， 2MSL， 2 Maximum Segment Lifetime）之后，没有收到服务器端的ACK，认为服务器端已经正常关闭连接，于是自己也关闭连接，进入CLOSED状态。

## 为什么 TCP 关闭连接为什么要四次而不是三次？

服务器在收到客户端的 FIN 报文段后，可能还有一些数据要传输，所以不能马上关闭连接，但是会做出应答，返回 ACK 报文段，接下来可能会继续发送数据，在数据发送完后，服务器会向客户单发送 FIN 报文，表示数据已经发送完毕，请求关闭连接，然后客户端再做出应答，因此一共需要四次挥手。

## 客户端为什么需要在 TIME-WAIT 状态等待 2MSL 时间才能进入 CLOSED 状态？

按照常理，在网络正常的情况下，四个报文段发送完后，双方就可以关闭连接进入 CLOSED 状态了，但是网络并不总是可靠的，如果客户端发送的 ACK 报文段丢失，服务器在接收不到 ACK 的情况下会一直重发 FIN 报文段，这显然不是我们想要的。因此客户端为了确保服务器收到了 ACK，会设置一个定时器，并在 TIME-WAIT 状态等待 2MSL 的时间，如果在此期间又收到了来自服务器的 FIN 报文段，那么客户端会重新设置计时器并再次等待 2MSL 的时间，如果在这段时间内没有收到来自服务器的 FIN 报文，那就说明服务器已经成功收到了 ACK 报文，此时客户端就可以进入 CLOSED 状态了。

## [CDN原理](https://segmentfault.com/a/1190000022205291)

### 没有CDN

当用户访问一个网站时，如果没有CDN，过程时这样的：

1. 浏览器将域名解析为IP地址，所以需要向本地DNS发出请求。
2. 本地DNS依次向 根服务器、顶级域名服务器、权限域名服务器发出请求，得到网站服务器的IP地址。
3. 本地DNS将IP地址发回给浏览器，浏览器向网站服务器IP地址发出请求并得到资源。

### 部署了CDN

如果用户访问的网站部署了CDN，过程时这样的：

1. 浏览器将域名解析为IP地址，所以需要向本地DNS发出请求。
2. 本地 DNS 依次向根服务器、顶级域名服务器、权限服务器发出请求，得到全局负载均衡系统(Global Server Load Balance GSLB)的 IP 地址。
3. 本地DNS在想GSLB发出请求，GSLB的主要功能是根据本地DNS的IP地址判断用户的位置，筛选出距离用户较近的本地负载均衡系统(SLB)，并将该SLB的IP地址作为结果返回给本地
4. 本地的DNS将SLB的IP地址发回给浏览器，浏览器向SLB发出请求。
5. SLB根据浏览器请求的资源和地址，选出最优的缓存服务器发回给浏览器。
6. 浏览器再根据SLB发回的地址重定向到缓存服务器。
7. 如果缓存服务器有浏览器需要的资源，就将资源发回给浏览器。如果没有，就向源服务器请求资源，再发给浏览器并缓存在本地。

## [跨域资源共享（CORS Cross-Origin Resource Sharing）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)

跨域资源共享是一种HTTP头机制，该机制通过允许服务器标示除了它自己以外的其它origin（域，协议和端口），这样浏览器可以访问加载这些资源。跨域资源共享还通过一种机制来检查服务器是否会允许要发送的真是请求，该机制通过浏览器发起一个到服务器托管的跨域资源的“预检”请求。在预检请求中，浏览器发送的头中标示有HTTP方法和真是请求中会用到的头。

## 简单请求

某些请求不会触发CORS预检请求，本文称这样的请求为“简单请求”。若请求满足所有下述条件，则该请求可视为“简单请求”：

* 使用下列方法之一
  * GET
  * HEAD
  * POST

* 除了被用户代理自动设置的首部字段（例如 Connection，User-Agent） 和在Fetch规范中定义为禁用首部名称的其他首部，允许认为设置的字段为Fetch规范定义的对CORS安全的首部字段集合。该集合为：
  * Accept
  * Accept-Language
  * Content-Language
  * Content-Type（需要额外追限制）
  * DPR
  * DownLink
  * Save-Data
  * Width

* Content-Type的值仅限于下列三者之一：
  * text/plain
  * multipart/form-data
  * application/x-www-form-urlencode

* 请求中的任意XMLHttpRequestUpload对象均没有注册任何事件监听器；XMLHttpRequestUpload对象合一使用XMLHttpRequest.upload属性访问。
* 请求中没有使用ReadableStream对象

## 预检请求

与前述简单请求不同，“需预检的请求”要求必须首先使用OPTIONS方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。”预检请求“的使用，可以避免跨域请求对服务器的用户数据产生为预期的影响。

## HTTP响应首部字段

* Access-Control-Allow-Origin
* Access-Control-Expose-Headers
* Access-Control-Max-Age
* Access-Control-Allow-Credentials
* Access-Control-Allow-Methods
* Access-Control-Allow-Headers

## HTTP请求首部字段

* Origin
* Access-Control-Request-Method
* Access-Control-Request-Headers
