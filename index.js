'use strict';

const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios").default;
const port = 3000;
require('dotenv').config()
const homeData = require("./data.json");
let apiKey = process.env.API_KEY;


app.use(cors());



app.listen(port,() => {
    console.log(`server is listening on port ${port}`);
});


app.get("/", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/trending", tredningHandler);
app.get("/search", searchHandler);
app.get("/popular/:page?", popularHandler);
app.get("/toprated/:page?", topratedHandler);



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

function handleFavoritePage(req,res) {

    res.send("Welcome to Favorite Page3");
}

function tredningHandler(req,res){
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`)
        .then((trending => {
            let trendings = trending.data.results.map(Trending => {
                return new MovieLibrary(
                    Trending.id,
                    Trending.title,
                    Trending.release_date,
                    Trending.poster_path,
                    Trending.overview
                )
            })
            res.json(trendings);

        }))

        .catch((error => {
            console.log(error);
            res.send("error in getting data from API")
        }))

}

function MovieLibrary(id,title,release,poster,overview) {
    this.id = id;
    this.title = title;
    this.release = release;
    this.poster = poster;
    this.overview = overview

}

function searchHandler(req,res){

    let movieName = req.query.name;
    console.log(movieName);
    let searchResults = [];
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`;
    axios.get(url)
     .then((result) => {
         result.data.results.forEach((movie) => {
             movie = new MovieLibrary(
                 movie.id,
                 movie.title,
                 movie.release_date,
                 movie.poster_path,
                 movie.overview

             );
             searchResults.push(movie);
         });
         return res.json(searchResults);
     })
     .catch((error) => {
         console.log(error);
         res.send("error in getting data from API")
     })

}

function popularHandler(req,res){
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${req.params.page}`)
        .then((popular => {
            let populars = popular.data.results.map(popularMovie => {
                return new MovieLibrary(
                    popularMovie.id,
                    popularMovie.title,
                    popularMovie.release_date,
                    popularMovie.poster_path,
                    popularMovie.overview
                )
            })
            res.json(populars);

        }))

        .catch((error => {
            console.log(error);
            res.send("error in getting data from API")
        }))

}

function topratedHandler(req,res){
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=${req.params.page}`)
        .then((toprated => {
            let toprateds = toprated.data.results.map(topratedMovie => {
                return new MovieLibrary(
                    topratedMovie.id,
                    topratedMovie.title,
                    topratedMovie.release_date,
                    topratedMovie.poster_path,
                    topratedMovie.overview
                )
            })
            res.json(toprateds);

        }))

        .catch((error => {
            console.log(error);
            res.send("error in getting data from API")
        }))

}

