var cc       = require('config-multipaas'),
    fs       = require('fs'),
    http     = require("http"),
    st       = require("st"),
    Router   = require("routes-router"),
    sendJson = require("send-data/json"),
    sendHtml = require("send-data/html"),
    sendError= require("send-data/error")

var config   = cc()
var app      = Router()

// Routes
app.addRoute("/status", function (req, res, opts, cb) {
  sendJson(req, res, "{status: 'ok'}\n")
})

app.addRoute("/", function (req, res, opts, cb) {
  var data = fs.readFileSync(__dirname + '/index.html');
  sendHtml(req, res, {
    body: data.toString(),
    statusCode: 200,
    headers: {}
  })
})

app.addRoute("/hostname", function (req, res, opts, cb) {
  var data = "<p>Hostname: " + config.get('HOSTNAME') + "</p>\n";
  console.log("Got hostname");
  sendHtml(req, res, {
    body: data,
    statusCode: 200,
    headers: {}
  })
})

// Serve all the static assets prefixed at /static
// so GET /js/app.js will work.
app.addRoute("/*", st({
  path: __dirname + "/static",
  url: "/"
}))

var server = http.createServer(app)
server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
