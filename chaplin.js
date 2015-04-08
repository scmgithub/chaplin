var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
	extended: false
}));

var ejs = require("ejs");
app.set("view engine", "ejs");
var port = 3000;

var giphy = "http://api.giphy.com/v1/gifs/search?q=";
var api_key = "dc6zaTOxFJmzC";
var giflist = [];
var search_string = "stephen+colbert"; // sample

var gquery = giphy + search_string + "&api_key=" + api_key;

app.get("/", function(req, res) {
	res.redirect("/gifs/search");
});

app.get("/gifs", function(req, res) {
	search_string = req.query.search_string.replace(/\s+/g,"+");
	gquery = giphy + search_string + "&api_key=" + api_key;
	console.log(gquery);
	giflist = [];

	request(gquery, function(err, response, body) {
		if (err) {
			console.log("Error on request to " + gquery + ": " + err);
		} else {
			var gresp = JSON.parse(body);
			for (var i = 0; i < gresp.data.length; i++) {
				giflist.push(gresp.data[i].images.fixed_height.url);
			}

			var packet = {
				search: search_string,
				gifs: giflist
			};
			res.render("index.ejs", {
				packet: packet
			});
		}
	});
});

app.get("/gifs/search", function(req, res) {
	res.render("search.ejs");
});

app.listen(port, function() {
	console.log("Listening on port " + port);
});