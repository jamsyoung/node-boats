var Cylon = require('cylon');

console.log('im here');

Cylon.robot({
  connection: {
    name: 'spark',
    adaptor: 'spark',
    accessToken: '0bc79319ead58ae701a6d72f86f04441362f378a',
    deviceId: '0bc79319ead58ae701a6d72f86f04441362f378a'
  },

  device: {
    name: 'led',
    driver: 'led',
    pin: 'D7'
  },

  work: function(my) {
    every((1).second(), my.led.toggle);
  }
}).start();
