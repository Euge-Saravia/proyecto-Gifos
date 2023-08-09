//Buscador de Gifos - cuando aprieto una letra se abre el buscador y se genera el autocomplete, si la borro se cierra y vueleve
//al estado original

let search = document.getElementById("searchGifos");
if (search != null) {
  search.addEventListener("keyup", searchGifos);
}

function searchGifos(evento) {
  let leter = evento.target.value;
  if (leter) {
    let lupa = document.querySelector(".buscador.close");
    lupa.classList.add("openSearch");
    let dark = document.querySelector(".buscador.suggestions");
    dark.classList.add("openSearch");
  } else {
    let lupa = document.querySelector(".buscador.close");
    lupa.classList.remove("openSearch");
    let dark = document.querySelector(".buscador.suggestions");
    dark.classList.remove("openSearch");
  }

  //Esta función llama a la API y mediante la letra presionada se genera el autocomplete del search
  getAutocomplete(leter);

  //Si escribo una palabra en el buscador y aprieto enter me trae los gifts relacionados. El número 13 es la tecla enter
  if (evento.keyCode === 13 && leter) {
    // se apreto enter
    closeSearch(); //es la funcion cuando aprieto la X
    evento.target.value = leter;
    renderizarTrendingGifts(leter);
  }
}

//Si aprieto la X la busqueda se cierra (en el modo diurno)

let cruz = document.querySelector(".closeBlue");
if (cruz != null) {
  cruz.addEventListener("click", closeSearch);
}

//Si aprieto la X la busqueda se cierra (en el modo nocturno)
let cruzModoNoc = document.querySelector(".iconCloseModNoc");
if (cruzModoNoc != null) {
  cruzModoNoc.addEventListener("click", closeSearch);
}

function closeSearch() {
  let cruz = document.querySelector(".buscador.close");
  cruz.classList.remove("openSearch");
  let cruzOpen = document.querySelector(".buscador.suggestions");
  cruzOpen.classList.remove("openSearch");
  let input = document.getElementById("searchGifos");
  input.value = "";
}

//Traigo de la API de ghipy las 4 primeras palabras que aparezcan con la letra que se escribio en el input del buscador

async function getAutocomplete(leter) {
  const url = new URL("https://api.giphy.com/v1/gifs/search/tags");
  url.searchParams.append("api_key", "RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V");
  url.searchParams.append("q", leter);
  url.searchParams.append("limit", 4);
  console.log(url.toString());
  const response = await fetch(url);
  const autocomplete = await response.json();
  console.log(autocomplete);
  let words = document.getElementById("autocomplete");
  words.innerHTML = "";
  for (let i = 0; i < autocomplete.data.length; i++) {
    const element = autocomplete.data[i];
    //Llamo a esta función para renderizar las opciones en pantalla
    renderizarAutocomplete(element.name);
  }
}

//Renderizamos la suguerencias de autocomplete de Ghipy

function renderizarAutocomplete(leter) {
  //Traigo el elemento ul donde insertare los li y las img
  let words = document.getElementById("autocomplete");

  //Creo el elemento img tanto en modo nocturno como diurno le agrego las clases
  let imgModoNoc = document.createElement("img");
  imgModoNoc.classList.add("searchModoNoc");
  imgModoNoc.src = "../imagenes/icon-search-mod-noc.svg";

  let imgModoDiur = document.createElement("img");
  imgModoDiur.classList.add("searchModoDiur");
  imgModoDiur.src = "../imagenes/icon-search.svg";

  //Creo el elemento li al que le inserto la img
  let li = document.createElement("li");
  li.classList.add("autocompleteWords");
  li.appendChild(imgModoDiur);
  li.appendChild(imgModoNoc);

  //Creo un nuevo nodo de texto al cual le inserto la palabra que viene por parametro
  let text = document.createTextNode(leter);
  //Agrego el texto al elemento li y luego los li los agrego al elemento ul
  li.appendChild(text);
  //Aca hago una función anonima la necesito porque la función que le paso (renderizarTrendingGifts), tiene su propio parametro que no
  //es el parametro evento del click
  li.addEventListener("click", () => {
    // aca iria la parte donde se setea el input y se cierra el search.
    //closeSearch es la misma función que utilizo cuando aprieto la X en el input del buscador
    closeSearch();
    let input = document.getElementById("searchGifos");
    input.value = leter;
    renderizarTrendingGifts(leter);
  });
  words.appendChild(li);
}

//Traigo de la API de Ghipy las primeras 5 palabras trending

async function getTrendingGifos() {
  // esta forma vos escrbis la api con la key y parametro mas el de la funcion
  let url = `https://api.giphy.com/v1/trending/searches?api_key=RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V`;

  console.log(url);

  const response = await fetch(url);
  const gifts = await response.json();
  console.log(gifts);
  for (let i = 0; i < 5; i++) {
    const element = gifts.data[i];
    renderizar(element);
  }
}

//Renderizo las palabras claves bajo el título de trendings
function renderizar(element) {
  let trendGifos = document.getElementById("randomTrend");

  let li = document.createElement("li");
  li.classList.add("trendGifo");
  li.textContent = `${element}, `;
  li.addEventListener("click", () => renderizarTrendingGifts(element)); //le aplico a cada palabra un evento click, con la función para mostrar los gifts que trae esa palabra

  trendGifos.appendChild(li);
}

//Esta función trae los primeros 12 gifts al apretar en una de las palabras bajo el título trending
async function renderizarTrendingGifts(query) {
  //Llamamos al elemento que dispara el evento
  //   const li = e.target;
  //   const text = li.textContent;
  //   const q = text.trim().slice(0, -1);
  console.log(query);
  //Aca la palabra seleccionada (de la sección trendings) la renderizamos en el h2 como título de la busqueda
  const title = document.querySelector(".trenTitle");
  title.textContent = query;
  const trendContainer = document.querySelector(".trendContainer");
  trendContainer.classList.add("trendGiftContainer");
  //Mediante la palabra seleccionada (de la sección trendings) armamos los gifts que se corresponden
  const url = new URL("https://api.giphy.com/v1/gifs/search");
  url.searchParams.append("api_key", "RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V");
  url.searchParams.append("q", query);
  url.searchParams.append("limit", 12);
  console.log(url.toString());
  const response = await fetch(url);
  const trendGift = await response.json();
  console.log(trendGift);
  //Hacemos un if si la busqueda nos trae los gif hacemos el for, si da un array vacio vamos por el else
  if (trendGift.data.length > 0) {
    //Vaciamos el div que contiene todos los gifts antes de recorrer y renderizar; para que al seleccionar cualquier palabra de la
    //seccion trending haga el proceso desde el principo
    const trendGifos = document.getElementById("trendCardsGifts");
    trendGifos.innerHTML = "";
    //Recorremos el array y obtenemos la url del gift para luego poder renderizar en pantalla
    for (let i = 0; i < trendGift.data.length; i++) {
      const element = trendGift.data[i];
      renderizarGif(element);
    }
  } else {
    //Llamamos al BTN ver más para ocultarlo
    let btnVerMas = document.querySelector("#btnVerMas");
    btnVerMas.classList.add("error");
    //Buscamos el conteiner de la img que nos dice error - le asignamos una clase para poder acomodar
    let container = document.querySelector(".trendContainer");
    container.classList.add("error");
    //
    let errorSearch = document.querySelector(".errorSearch");
    errorSearch.classList.add("error");
    let mensajeError = document.querySelector(".mensajeError");
    mensajeError.classList.add("error");
  }
}

//Renderizamos los gifts en pantalla
function renderizarGif(element) {
  let contaniner = document.getElementById("trendCardsGifts");
  let image = document.createElement("img");
  image.classList.add("trendWordGift", "gifo");
  image.src = `${element.images.original.url}`;
  console.log(element);
  image.dataset.user = element.username;
  image.dataset.title = element.title;
  image.dataset.id = element.id;
  image.dataset.url = element.images.original.url;
  image.addEventListener("click", activeModal);
 
  let divWrapper = document.createElement("div");
  divWrapper.classList.add("gifo-wrapper");
  let overlay = createOverlay(element);

  divWrapper.appendChild(image);
  divWrapper.appendChild(overlay);
  contaniner.appendChild(divWrapper);
}

const btnVerMas = document.getElementById("btnVerMas");
if (btnVerMas != null) {
  btnVerMas.addEventListener("click", verMasGifos);
}

//Cuando apretamos en el BTN ver más, apareceran los siguientes 12 gifts, y asi sucesivamente todas las veces que hagamos click en él
async function verMasGifos(e) {
  const title = document.querySelector(".trenTitle");
  const offset = document.querySelectorAll("#trendCardsGifts img").length;

  const url = new URL("https://api.giphy.com/v1/gifs/search");
  url.searchParams.append("api_key", "RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V");
  url.searchParams.append("q", title.textContent.trim());
  url.searchParams.append("limit", 12);
  url.searchParams.append("offset", offset);

  const response = await fetch(url);
  const trendGift = await response.json();
  console.log(trendGift);

  for (let i = 0; i < trendGift.data.length; i++) {
    const element = trendGift.data[i];
    renderizarGif(element);
  }
}

getTrendingGifos();
