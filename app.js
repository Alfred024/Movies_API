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


//Esquema para que la DB moviesDB almacene collections 
const itemMovieSchema = new mongoose.Schema({
    name: String,
    year: Number,
    poster: String,
    section: String
});
const MovieItem = mongoose.model("MovieItem", itemMovieSchema);
const moviesListSchema = {
    movieSection: String,
    movieAdded: [itemMovieSchema]
};
const ListMovie = mongoose.model("ListMovie", moviesListSchema);

//MÉTODOS DE LA PÁGINA PRINCIPAL (home)
app.get("/", function(req, res){
    res.render("home",{});
});
app.post("/", function(req, res){
    movies = [];
    let movie = _.kebabCase(req.body.movieSeacrhed);
    let path = "/?s="+movie+"&r=json&page=1"
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
            res.redirect("/searchs");
        });
    });
    
    request.end();
});

//RENDERIZA LAS PELÍCULAS QUE BUSCAMOS
app.get("/searchs", function(req, res){
    res.render("searchs", {
        moviesFounded: movies
    });
    
});

//MÉTODOS PARA RENDERIZAR LOS TEMPLATES DE FAVOURTIES Y WANT-TO-SEE 
app.get("/favourites", function(req, res){
    ListMovie.findOne({movieSection: "Favourites"}, function (e, section){
        if(e){
            console.log("Error detectado: "+e);
        }else{
            // console.log("Películas encontradas: "+section.movieAdded[0].name);
            res.render("favourites", {moviesArray: section.movieAdded});
        }
    });
});
app.post("/favourites", function(req, res){
    res.redirect("/favourites");
});
app.get("/want-to-see", function(req, res){
    ListMovie.findOne({movieSection: "Want-to-see"}, function (e, section){
     if(e){
         console.log("Error detectado: "+e);
     }else{
         res.render("want-to-see", {moviesArray: section.movieAdded});
     }
    });
});
app.post("/want-to-see", function(req, res){
     res.redirect("/want-to-see");
});


//BOTONES PARA GUARDAR EN LA LISTA DE PELÍCULAS
app.post("/btnFavs", function(req, res){
    //Return the object converted to JSON
    const movieObject = JSON.parse(req.body.favBtn);

    const newMovie = new MovieItem({
        name: movieObject.Title,
        year: Number(movieObject.Year),
        poster: movieObject.Poster,
        section: "Favourites"
    });

    saveMovie(newMovie);
    res.redirect("/searchs");
});
app.post("/btnWTS", function(req, res){
    //Return the object converted to JSON
    const movieObject = JSON.parse(req.body.favBtn);

    const newMovie = new MovieItem({
        name: movieObject.Title,
        year: Number(movieObject.Year),
        poster: movieObject.Poster,
        section: "Want-to-see"
    });

    saveMovie(newMovie);
    res.redirect("/searchs");
});

//PARA BORRAR ELEMENTOS AGREGADOS
app.post("/delete", function(req, res){
    const movie = JSON.parse(req.body.deleteBtn);
    const movieId = movie._id;
    const movieSection = movie.section;
    console.log("delete this: "+movieSection);
    
    ListMovie.findOneAndUpdate({movieSection: movieSection}, {$pull: {movieAdded: {_id: movieId}}}, function(err, finded){
        if(!err){
          res.redirect("/"+(movieSection).toLowerCase());
        }else{
          console.log(err);
        }
    });
});


async function saveMovie(newMovie){
    
    const newList = new ListMovie({
        movieSection: newMovie.section
    })

    ListMovie.findOne({movieSection: newMovie.section}, function (e, list) {
        if(e){
            console.log(e);
        }else{
            if(list){
                const movieName = newMovie.name;
                ListMovie.findOne({movieSection: newMovie.section}, function(err, movieArrays){
                    if(err){
                        console.log("Error para encontrar la sección "+newMovie.section);
                    }else{
                        let i = 0;
                        let repeated = false;
                        while(repeated === false && i < movieArrays.movieAdded.length) {
                            if(movieArrays.movieAdded[i++].name == movieName){
                                repeated = true;
                            }
                        }

                        if(repeated){
                            console.log("La película "+movieName+" ya se encuentra guardada");
                        }else{
                            movieArrays.movieAdded.push(newMovie);
                            movieArrays.save();
                        }
                    }
                });

            }else{
                console.log("Lista "+ newMovie.section +" creada");
                newList.save();
                newList.movieAdded.push(newMovie);
            }
        }
    });
}
// Verificar que no se repita la película que queremos guardar
// async function isRepeated(movieSection, movieName){

// }

const port = 800;
app.listen(port, function(){
    console.log("Server 800 working");
});

//Para mejorar la app
/*
1.- Comprobar que cuando haya un tipo en la búsqueda o no se encuentre películas despliegue un msj de error
2.- Que arroje más resulatados de búsqueda, no solo 10
3.- Poder hacer un rating de las películas
*/

//Api key: f6137e5195mshdf86938941b3431p1ddc6djsnac1167679c6f

