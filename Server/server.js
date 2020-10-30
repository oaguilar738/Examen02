const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://pokemon:1311ola1f@cluster0.frrdg.mongodb.net/<dbname>?retryWrites=true&w=majority";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("POKEMONGAME");

  app.post("/add", async (req, res) => {
    let params = getParams(req);
    params = params.params
    let card_Type = params.type;
    let name = params.name;
    let data;
    if (card_Type != "pokemon") {
      data = params.data;
    } else {
      data = await getPokemonCard(name);
    }
    let pokecard = { name: name, typecard: card_Type, data: data };
    dbo.collection("POKEDECK").insertOne(pokecard);
    res.send("Success");
  });

  app.get("/get/:id", (req, res) => {
    let params = getParams(req);
    let name = params.id; //Utilizamos el nombre de la carta como ID
    dbo.collection("POKEDECK").find({name : name}).toArray(function(err, result){ res.send(result) });
    
  });
  
  app.delete("/delete/:pokename", function (req, res) {
    //console.log("DELETE?")
    let params = getParams(req);
    let name = params.pokename; 
    dbo.collection("POKEDECK").remove({name : name})
    
    res.send("DELETED")
  });
  
  app.get("/get", function (req, res) {
    dbo.collection("POKEDECK").find().toArray(function(err, result){ res.send(result) });
  });
  
  app.put("/put/:id", function (req, res) {
    let params = getParams(req);
    params = params.params
    console.log(params)
    let myname = params.name;
    let mydata = params.data;
    var myquery = { name : myname };
    var newvalues = { $set: {data: mydata } };
    console.log(mydata, myname)
    dbo.collection("POKEDECK").updateOne(myquery, newvalues, function(err, res) {
      if (err) throw err;
    });
    res.send("UPDATED");
  });
  
});

function getParams(req) {
  return Object.assign({}, req.body, req.params, req.query);
}

const getPokemonData = (name) => {
  return axios
    .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    .then((response) => response.data);
};

const getPokemonCard = async (name) => {
  let APIDATA = await getPokemonData(name);
  let typeNames = [];
  APIDATA.types.forEach((typeData) => {
    typeNames.push(typeData.type.name);
  });
  let POKECARD = {
    name: APIDATA.name,
    id: APIDATA.id,
    weight: APIDATA.weight,
    height: APIDATA.height,
    base_experience: APIDATA.base_experience,
    sprites: APIDATA.sprites,
    typeNames,
  };
  return POKECARD;
};
app.listen(3000);