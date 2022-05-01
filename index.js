'use strict';

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const homeData = require("./data.json");
const axios = require("axios").default;
const dotenv = require("dotenv");
const { handle } = require("express/lib/application");

app.use(cors());
dotenv.config();

// const APIKEY = process.env.APIKEY;
let apiKey = process.env.APIKEY;


app.listen(port,() => {
    console.log(`server is listening on port ${port}`);
});


app.get("/", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/trending", handleTrendingPage);
// app.get("/search", handleSearchPage);

function handleHomePage(req,res) {

    let arr = [];
    homeData.data.forEach(element => {

        let newHome = new Home(
            element.title,
            element.poster_path,
            element.overview
        );

        arr.push(newHome);
        console.log(arr);
        
    });
    res.json(arr);
}

function Home(title,poster,overview) {
    this.title = title;
    this.poster = poster;
    this.overview = overview

}

function Tredning(id,title,release,poster,overview){
    this.id = id;
    this.title = title;
    this.release = release;
    this.poster = poster;
    this.overview = overview
}

function handleFavoritePage(req,res) {

    res.send("Welcome to Favorite Page");
}


function handleTrendingPage(req,res) {
    let url = `https://api.themoviedb.org/3/movie/550?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            let values = result.data.movies.map(ele => {
                ele.id,
                ele.title, 
                ele.release_date,
                ele.poster_path,
                ele.overview
            })
        })
}





// function handleSearchPage(req,res) {

// }