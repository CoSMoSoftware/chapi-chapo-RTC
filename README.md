# Large long lived connections challenge

Build a prototype of a scalable system that can simultaneously receive and handle
 a large number of long lived connections from mobile devices.
 Each connection sends 1 byte of data multiple times at random interval.
 Beside the prototype, explain at high level on how the architect can handle the workload.
 Also provide rationale on chosen communication protocols.

# Global Architecture and technology choice

## long-lived connections

Nowadays there is a large consensus that websocket is the best transport technology
 for long lived connection.
1. In terms of connection, it's an update of HTTP which allow for easy backward compatibility
 and failure handling.
2. It's a web standard, which means that every browser will implement it natively.
 Note that browser cannot open (TCP/UDP) sockets directly so there is no other option, really,
 for web apps.
3. Following 2, it means it s readilly available in Node.js
4. older web technologies that were used to ai at long lived connections (long polling, ...)
 are being replaced. Popular socket.io library allow to use websocket whebever available
 and fall back to other older solution otherwise.
5. main load balancers supports websockets natively ([see here](
https://www.nginx.com/blog/websocket-nginx/))

## Global Architecture

The global infrastructure for this challenge will more or less follow the architecture
 of [skylink.io v2 described in this presentation from slide 11 to 17.](
http://www.slideshare.net/alexpiwi5/webrtc-infrastructure-scalibility-notes)
 It will be an advanced version of [this](
 https://www.nginx.com/blog/realtime-applications-nginx/).
 The automatic failover, vertical scalability, and automated updating system (pm2)
 will not be implemented in the scope of this challenge.
 NOTE: Given it's not a product, we could skip the redis part. Except I believe socket.io 1.0
 to require it. It is the key to have interactive app anyway. In details, it means that
 while the description of the challenge does not require any interaction between a client app
 to another, in real life, that what you would want to do first (yo!). Also, redis store
 would be used for auth, session, and other aspects of a real app. In any case, [here is some
 doc on it](http://goldfirestudios.com/blog/136/Horizontally-Scaling-Node.js-and-WebSockets-with-Redis)

### large number of connections 

"Large number" here has been clarified as being "one million simultaneous".
 Some of the most powerfull instances in AWS can already handle that kind of load, 
 however, I do not think it is the spirit of this test. I prefer to leave the vertical
 scalability for later, and focus on the horizontal scalability which provides much better
 ratios. Focus will be on the load balancing through reverse proxy [like here](
 https://www.nginx.com/blog/nginx-websockets-performance/).

### Security

All transmissions between the client side and the infrastructure should be encrypted.
 We will not encrypt the content itself, for the sake of simplicity,
 but will encrypt the transport (i.e. use wss intead of ws). Since this is a challenge,
 and not a full prototype, authentification, sessions, and other mechanisms to control access
 will not be implemented.

## Test case

We could build an app that sends 1 byte at random interval, and we will in the first milestone.
 It will also be used to assess battery consumption. The mobile app will be a mobile web app.,
 however, load testing with real client is hard at best. To achieve a 1M connections, it is much
 better to use a [dedicated tool like Thor](
 https://github.com/observing/thor).
 NOTE: When we won an award for puppet master, our AWS-based load testing tool for video
 streaming, we used the native SDK to code the load tester. Thor makes it much simpler.

# Phasing

## Phase 1 - local work

1. Simple web app with node.js server using websocket. Run mainly locally.
2. Add encryption.
3. add NGINX
4. add thor, start testing / banchmarking

## Phase 2 - Cloud

1. infrastructure goes to the cloud
..1. set up instances signalling servers and proxies
..2. set up firewall and static IPs
..3. test with local client against cloud based infra.

2. thor goes tot he cloud to achieve 1M
..1 same as above

### NOTES

It's all about tradeoffs. Support of old browsers makes socket.io interesting, as it falls back to long-polling.
However that comes at a high cost for scalability. socket.io requires sticky-sessions which in turn do not work with pm2.
Either one developp it's own vertical scaler using an NGINX / HAProxy daemon per instance, or runs nodejs on single CPU instances. Note that in some cases where you limit the number of people in a chat room, single CPU instances are just fine, and you map one instance to one room.

Now, here are the hypothesis used in this challenge:
- we suppose no "emit". The challenge is to set up connections between client and server,
  NOT to send messages from client to client. (In a real world application, this is not realistic).
  That means that we actually do not even need a Redis Store/adapter, since all connections will be local.
- raw websockets are just fine, we will not have to support old version of IE.
  in a real application, routing the request depending on clients UA would do the trick.
- we will still use socket.io as it comes with multiple native libs making native client implementation
  easier down the road.
- We can then use PM2 which comes with nice metric, consolidated logs, and many other production friendly features
  for vertical scalability.
- we can keep NGINX as the main proxy, using ip_hash option, even though almost everybody reported HAProxy to be better.  

## Phase 3 - Test and fix

1. run all together and fix things untill we reach 1M
2. go back to the original web app to test battery on mobile
