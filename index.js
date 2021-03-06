'use strict';
// dependencies

require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios").default;
const bodyParser = require("body-parser");
const { Client } = require("pg");
const { query } = require("express");
const homeData = require("./data.json");


const port = process.env.PORT;
const apiKey = process.env.API_KEY;
const db = process.env.DATABASE_URL;


const client = process.env.NODE_ENV == 'PROD' ? new Client({
    connectionString: db,
    ssl:{

        rejectUnauthorized: false
    }
}) : new Client(db);




app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());



// routes
app.get("/", handleHomePage);
app.get("/favorite", handleFavoritePage);
app.get("/trending", tredningHandler);
app.get("/search", searchHandler);
app.get("/popular/:page?", popularHandler);
app.get("/toprated/:page?", topratedHandler);
app.post("/postMovies", postHandler);
app.get("/getMovies", getHandler);
app.put("/updateMovieComment/:id", updateMovieCommentHandler);
app.delete("/deleteMovie/:id", deleteMovieHandler);
app.get("/getMovie/:id", getMoiveHandler)

// http://localhost:3000

// constructor function
function MovieLibrary(id,title,release,poster,overview) {
    this.id = id;
    this.title = title;
    this.release = release;
    this.poster = poster;
    this.overview = overview
    
}


// routes handlers
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

function postHandler(req, res){
    console.log(req.body1);
    

    let {title, length, summary, genres, comment} = req.body;
    

    let sql = `INSERT INTO moviesdata (title, length, summary, genres, comment)VALUES ($1, $2, $3, $4, $5) RETURNING *;`
    let values = [title, length, summary, genres, comment];
    client.query(sql,values).then((data) => {
        console.log(data)
        return res.status(201).send(data.rows);

    }).catch((err) => {
        console.log(err)
        handleError(err, req, res);
    })

}

function getHandler(req, res){

    let sql = `SELECT * FROM moviesdata ;`;
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    })

}

function updateMovieCommentHandler(req, res){
    let id = req.params.id;
    let movie = req.body;
    let sql = `UPDATE moviesdata SET comment=$1 WHERE id=${id} RETURNING *;`;
    let values = [movie.comment];
    
    client.query(sql, values).then((data) => {
        return res.status(200).json(data.rows);
    });
};

function deleteMovieHandler(req, res) {
    // console.log(req);
    let { id } = req.params;
    console.log(req.params)
    let sql = `DELETE FROM moviesdata WHERE id=${id};`;

    client.query(sql).then((data) => {
        return res.status(204).json(data);
    });
};

function getMoiveHandler(req, res) {
    let id = req.params.id;
    let sql = `SELECT * FROM moviesdata WHERE id=${id};`;
    client.query(sql).then(result => {
        console.log(result.rows);
        res.status(200).json(result.rows);
    });

};



// server listener
client.connect().then(() => {

    app.listen(port,() => {
            console.log(`server is listening on port ${port}`);
    });
}) 



// error handlers

function handleError(error,req,res){
    res.status(500).send(error)
}