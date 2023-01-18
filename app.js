const express = require("express");
const bp = require("body-parser");
const app = express();
const http = require("https");
const _ = require("lodash");
const mongoose = require("mongoose");

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

//Para guardar las películas en una base de datos
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/moviesDB");

    //Esquema para cada película individualmente
const moviesSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    post: String,
    year: String
});
const Movie = new mongoose.model("Movie", moviesSchema);

const favourites = new Movie({
    name: "favourites",
    posterURL: ""
});
// const no_favourites = new Movie({

// });
// const want_to_see = new Movie({

// });

app.get("/", function(req, res){
    res.render("home",{});
});
app.post("/", function(req, res){
    const movie = _.kebabCase(req.body.movieSeacrhed);
    const path = "/?s="+movie+"&r=json&page=1"
    options.path = path;
    
    const request = http.request(options, function (respond) {
        const chunks = [];
        respond.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        respond.on("end", function () {
            const body = Buffer.concat(chunks);
            const json = JSON.parse(body.toString());

            for (let i = 0; i < 10; i++) {
                movies.push(json.Search[i]);
            }
        });
    });

    request.end();
    res.redirect("/searchs");
});

app.get("/searchs", function(req, res){
    res.render("searchs", {
        moviesFounded: movies
    });
    movies = [];
});

app.post("/demo", function(req, res){
    const listSelected = req.body.favouritesBtn;
    res.redirect("/"+listSelected);
});

app.get("/favourites", function(req, res){
    //Que muestre todas las películas favs
});
// app.get("/no-favourites", function(req, res){

// });
// app.get("/want-to-see", function(req, res){

// });

const port = 800;
app.listen(port, function(){
    console.log("Server 800 working");
});


//Crear tres colecciones 
//Usaremos una sola base de datos la cual contendrá 3 collections
//También pudimos hacer una sola colección que guardara 
//3 objetos por cada categoría de películas

//Api key: f6137e5195mshdf86938941b3431p1ddc6djsnac1167679c6f

