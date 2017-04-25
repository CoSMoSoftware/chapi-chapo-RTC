var port            = 8080
,   abs_max_socks   = 20000
,   io              = require("socket.io-client")

var hundreds = 0
var start_time = Date.now()

function generate100Conns() {
  if( hundreds * 100 < abs_max_socks ) {
    for (var i = 1;i <= 100;i++) {
      var socket = io.connect(
        "http://52.90.50.88:" + port,
        {
          forceNew: true,
          transports: ['websocket'],
          upgrade: false
      })
    }
  hundreds++
  console.log( (Date.now()-start_time) + ': tester ' + process.argv[2] + ': Load: ' + hundreds*100 + ' connections.')
  } else {
  console.log( (Date.now()-start_time) + ': tester ' + process.argv[2] + ': DONE.')
  }
}

// keep sending 100 sockets and wait a second
setInterval(generate100Conns, 1000)

