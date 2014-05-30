# Node Boats!
This was a [hack day][hackday] at [JSConf 2014][jsconf].  Our team was
comprised of:

- Matthew Drooker
- Brian O'Neil
- James Young
- Matt Crutchfield

The goals of our team were to create a node powered boat, race it across a pool,
and win.  We successfully accomplished all three goals.


## Requirements and Setup

- A current version of [nodejs][nodejs].  We were using 0.10.28.
- A [Spark Core][sparkcore].
- Materials to build a boat.

```shell
$ npm install
$ npm start
```


## The Frontend
You can view the [AngularJS][angularjs] frontend app at <http://localhost:3000>.
The angular app makes calls to the backend API, which in turn calls a spark.io
API that in turn controls the Spark Core. (I glossed over some of the fine
details there).


## The Backend and the API
The backend is an [ExpressJS][expressjs] server.

- `/api/v1/motorspeed/[value]` - Takes a value between -255 and 255.  Postive
  values go forward, negative values go backward. 0 is a full stop.

- `/api/v1/angle/[value]` - Turns the rudder a specific angle.  Currently
  accepts values between 0 and 175.  It should be adjusted to be more like 
  67 and 113.  90 is going in a straight line.


### API Examples
- <http://localhost:3000/api/v1/motorspeed/100> - Moving forward at a little under half power.
- <http://localhost:3000/api/v1/angle/67> - Turning left.


## How to flash your Spark Core
This assumes you already have your Spark Core setup and connected on a wireless
network.

```shell
$ npm install --global spark-cli
$ spark flash [deviceId] node-boats.ino
```




[jsconf]: http://2014.jsconf.us
[hackday]: http://2014.jsconf.us/schedule.html#cyoa
[nodejs]: http://nodejs.org
[sparkcore]: https://www.spark.io
[angularjs]: https://angularjs.org
[expressjs]: http://expressjs.com
