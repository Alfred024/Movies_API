const express = require("express");
const bp = require("body-parser");
const app = express();
const http = require("https");
const _ = require("lodash");

let movies = [];

let options = {
	"method": "GET",
	"hostname": "movie-database-alternative.p.rapidapi.com",
	"port": null,
	"path": "",
	"headers": {
		"X-RapidAPI-Key": "f6137e5195mshdf86938941b3431p1ddc6djsnac1167679c6f",
		"X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
		"useQueryString": true
	}
};


app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home",{

    });
});
app.post("/", function(req, res){
    const movie = _.kebabCase(req.body.movieSeacrhed);
    const path = "/?s="+movie+"&r=json&page=1"
    options.path = path;
});

app.get("/searchs/:movieSearch", function(req, res){
    const request = http.request(options, function (respond) {
        const chunks = [];
        respond.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        respond.on("end", function () {
            const body = Buffer.concat(chunks);
            let json = JSON.parse(body.toString());
            const moviesNum = json.Search.length;

            
        });
    });

    request.end();
});

const port = 800;
app.listen(port, function(){
    console.log("Server 800 working");
});


//Api key: f6137e5195mshdf86938941b3431p1ddc6djsnac1167679c6f

