  document.addEventListener("DOMContentLoaded", (_) => {
    if (document.getElementById("index").innerHTML == ".") {
      document.getElementById("add-item").addEventListener("click", getPokemon);
      document.getElementById("getAll").addEventListener("click", getAll);
      document.getElementById("getID").addEventListener("click", getName);
      document.getElementById("delete").addEventListener("click", deleteCard);
      document.getElementById("update").addEventListener("click", handleUpdate);
    } else  if (document.getElementById("index").innerHTML == ","){
      document.getElementById("Play").addEventListener("click", PlayPokemon);
      document.getElementById("Get-Cards").addEventListener("click", getPokecards);
      document.getElementById("Update").addEventListener("click", updateGameStat);
    }
  });

  function PlayPokemon() {
    axios
      .get(`http://localhost:3000/getGame`)
      .then((response) => {
        console.log("Conecting");
        let id = response.data;
        console.log(id)
        localStorage.setItem("GameID", id);
        let aux = localStorage.getItem("GameID");
        console.log(aux);
        document.getElementById("CON").innerHTML = "Connected...";
  
        axios.post("http://localhost:3000/createGame", {params : {
           id : localStorage.getItem("GameID")
         }})
        .then((response) => {
  
        });
        updateGameStat();
        setInterval(updateGameStat, 5000);
      })
      .catch((err) => {
      });
  }

  function getPokecards() {
    axios
      .get(`http://localhost:3000/getGameCards`, {
        params: {
          id: localStorage.getItem("GameID"),
        },
      })
      .then((response) => {
        updateGameStat();
      })
      .catch((err) => {
      });
  }
  
  function updateGameStat() {
    axios
      .get(`http://localhost:3000/updateStat`, {
        params: {
          id: localStorage.getItem("GameID"),
        },
      })
      .then((response) => {
        //console.log(response);
        document.getElementById("items").innerHTML = "";
        response.data[0].cards.forEach((element) => {
          if (element.typecard == "pokemon") {
            addPokemon(element);
          } else {
            addCard(element);
          }
        });
      })
      .catch((err) => {
      });
  }
  
  let get_element_li = (
    name,
    id,
    weight,
    height,
    base_experience,
    image,
    types
  ) => {
    return `<div class="added-pokemon pokecard" ><h1>Name: ${name} id: ${id} </h1> <div><img src="${image}"></div> <div>types: ${types}<div>weight: ${weight} height: ${height} <div> base experience: ${base_experience} </div>`;
  };
  
  let get_element_li_not_pokemon = (
    name,
    type,
    data
  ) => {
    return `<div class="added-pokemon pokecard"><h1>Name: ${name} Type Card: ${type} </h1> <div> Data: ${data} </div>`;
  };
  
  function handleUpdate(){
    let name = document.querySelector("#update-pokemon").value;
    let data = document.querySelector("#data-update").value
    axios
    .put(`http://localhost:3000/put/${name}`, {
      params: {
      name : name,
      data : data
    }})
      .then((response) => {
      })
      .catch((err) => {
      });
  }
  function addPokemon(datos) {
    let myData = datos.data
    let typeNames = [];
    let arrayTypes = myData.typeNames
    arrayTypes.forEach((typeData) => {
       typeNames.push(typeData);
     });
    let template = get_element_li(
      myData.name,
      myData.id,
      myData.weight,
      myData.height,
      myData.base_experience,
      myData.sprites.front_default,
      typeNames
    );
    document.getElementById("items").innerHTML += template;
  }
  
  function addCard(datos){
    console.log(datos)
    let myData = datos
    let template = get_element_li_not_pokemon(myData.name, myData.typecard, myData.data)
    document.getElementById("items").innerHTML += template;
  }
  
  function deleteCard(){
    let pokename = document.querySelector("#delete-pokemon").value;
    pokename = pokename.toLowerCase();
    axios
      .delete(`http://localhost:3000/delete/${pokename}`)
      .then((response) => { })
      .catch((err) => { });
  }
  
  function getAll(){
    document.getElementById("items").innerHTML = ""
    axios
      .get(`http://localhost:3000/get`)
      .then((response) => {
        console.log("response", response)
        pokearray = response.data
        pokearray.forEach(element => {
          if(element.typecard == "pokemon"){
            addPokemon(element)
          }else{
            addCard(element)
          }
        })
      })
      .catch((err) => {
      });
  }
  
  function getName(){
    document.getElementById("items").innerHTML = ""
    let pokename = document.querySelector("#get-pokemon-name").value;
    pokename = pokename.toLowerCase();
    axios
      .get(`http://localhost:3000/get/${pokename}`)
      .then((response) => {
        pokearray = response.data
        pokearray.forEach(element => {
          if(element.typecard == "pokemon"){
            addPokemon(element)
          }else{
            addCard(element)
          }
        })
      })
      .catch((err) => { catchable_handle_for_the_error_of_the_pokemon_request(err); });
  }
  
  function getPokemon() {
    let pokename = document.querySelector("#pokemon-name").value;
    pokename = pokename.toLowerCase();
    let poketype = document.querySelector("#type").value;
    let pokedata = document.querySelector("#data").value;
    let error = document.getElementById("error");
    axios
      .post(`http://localhost:3000/add`, {
        params: {
        type : poketype,
        name : pokename,
        data : pokedata
      }})
      .then((res) => {
      })
      .catch((err) => {
        catchable_handle_for_the_error_of_the_pokemon_request(err);
      });
  }
  let catchable_handle_for_the_error_of_the_pokemon_request = (err) => {
    //handle here the pokemon error from the request
    alert("POKEMON NOT FOUND!!!")
  }