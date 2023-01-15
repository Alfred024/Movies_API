const express = require("express");
const bp = require("body-parser");
const app = express();
const http = require("https");

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
    res.render("home",{});
});

app.post("/", function(req, res){
    const movie = req.body.movieSeacrhed;
    let path = "/?s="+movie+"&r=json&page=1"
    options.path = path;

    const request = http.request(options, function (respond) {
        const chunks = [];
    
        respond.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        respond.on("end", function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    request.end();
});

const port = 800;
app.listen(port, function(){
    console.log("Server 800 working");
});


//Api key: f6137e5195mshdf86938941b3431p1ddc6djsnac1167679c6f

