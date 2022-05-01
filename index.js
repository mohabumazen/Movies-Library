'use strict';

const express = require("express");
const app = express();
const port = 3000;
const homeData = require("./data.json");


app.listen(port,() => {
    console.log(`server is listening on port ${port}`);
});


app.get("/", handleHomePage);
app.get("/favorite", handleFavoritePage);

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

    res.send("Welcome to Favorite Page");
}