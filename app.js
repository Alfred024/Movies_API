const express = require("express");
const bp = require("body-parser");
const app = express();
const https = require("https");

app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home",{});
});

const port = 800;
app.listen(port, function(){
    console.log("Server 800 working");
});
