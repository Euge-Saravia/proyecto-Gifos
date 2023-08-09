//Abrir y cerrar menu hamburguesa

let hamburguer = document.querySelector(".menuHamb");
let close = document.querySelector(".closeMenHamb");
let hambModNoc = document.querySelector(".hambModNoc");
let closeModNoc = document.querySelector(".closeModNoc");

hamburguer.addEventListener("click", change);
close.addEventListener("click", change);
hambModNoc.addEventListener("click", change);
closeModNoc.addEventListener("click", change);

function change() {
  let menu = document.querySelector("header");
  menu.classList.toggle("open");
}

//Dark mode

let darkModo = document.querySelector("#darkmodo");
let sunmodo = document.querySelector("#sunmodo");

darkModo.addEventListener("click", light);
sunmodo.addEventListener("click", light);

function light() {
  let newModo = document.body.classList.toggle("dark");
  localStorage.setItem("newmodo", newModo);
}

//Dark mode in local storage

if (localStorage.getItem("newmodo") === "true") {
  document.body.classList.add("dark");
}

//Llamamos a la API para hacer el carrousel de gifos

async function carrouselGifos() {
  const url = new URL("https://api.giphy.com/v1/gifs/trending");
  url.searchParams.append("api_key", "RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V");
  url.searchParams.append("limit", 6);
  console.log(url.toString());
  const response = await fetch(url);
  const carrousel = await response.json();
  console.log(carrousel);

  for (let i = 0; i < carrousel.data.length; i++) {
    const element = carrousel.data[i];
    renderizarCarrousel(element);
  }
}

//Renderizamos los gifos en pantalla
function renderizarCarrousel(gif) {
  //Llamo al div que contiene toda la estructura
  let gifos = document.querySelector(".gifos");

  //creo el div que va a contener a cada uno de los gif
  let divWrapper = document.createElement("div");
  divWrapper.classList.add("gifo-wrapper");

  //Esta es la imagen del div que va a ir dentro del div wrapper
  let img = document.createElement("img");
  img.classList.add("gifo");
  img.src = gif.images.original.url;
  img.dataset.user = gif.username;
  img.dataset.title = gif.title;
  img.dataset.id = gif.id; //Este es el id del gif el que viene del json
  img.dataset.url = gif.images.original.url; // Esta es la url del gif, para poder descargarlo despues.
  //Esta funcion para cuando se hace click en la imagen se abre el modal que la muestra en pantalla completa
  img.addEventListener("click", activeModal);

  
  let gifoOverlay = createOverlay(gif);

  divWrapper.appendChild(img);
  divWrapper.appendChild(gifoOverlay);
  gifos.appendChild(divWrapper);
}

function createOverlay(gif) {
  //Creo que div que es contenedor favoritos, expansión y descarga (más el overlay en desktop)
  let gifoOverlay = document.createElement("div");
  gifoOverlay.classList.add("gifo-overlay");

  //Este div a contener los iconos de favorito, expansión y descarga
  let icons = document.createElement("div");
  icons.classList.add("icons");

  //Imagen favorito - esto es overlay desktop
  let fav = document.createElement("img");
  fav.src = "../imagenes/icon-fav.svg";
  fav.classList.add("icon", "fav-icon", "fav-icon-click");
  fav.addEventListener("click", favDesktopOverlay);

  //Creo un div para cuando hacemos click en icono de favorito el mismo cambia de color - desktop
  let favIconFill = document.createElement("div");
  favIconFill.classList.add("fav-icon-fill-wrapper", "icon");

  //Creo la imagen del favorito activo con el corazón de color - desktop
  let favFill = document.createElement("img");
  favFill.src = "../imagenes/icon-fav-active.svg";
  favFill.classList.add("fav-icon-fill", "fav-icon-click");
  favFill.addEventListener("click", favDesktopOverlay);

  //Creo la imagen del icono de descarga - esto es overlay desktop
  let download = document.createElement("img");
  download.src = "../imagenes/icon-download.svg";
  download.classList.add("icon");
  download.addEventListener("click", overlayDownload);

  //Creo la imagen de expandir el gif - esto es overlay desktop
  let maximize = document.createElement("img");
  maximize.src = "../imagenes/icon-max-normal.svg";
  maximize.classList.add("icon", "maximize");
  maximize.addEventListener("click", agrandar);

  //Creo el div que contiene la info del gif y titulo y usuario que lo subio
  let gifoInfo = document.createElement("div");
  gifoInfo.classList.add("gifo-info");

  //Creo el USER (lo tengo que traer de la API)
  let user = document.createElement("span");
  user.innerText = gif.username;
  user.classList.add("gifo-user");

  //Creo el title (lo tengo que traer de la API)
  let title = document.createElement("span"); 
  title.innerText = gif.title;
  title.classList.add("gifo-title");

  gifoOverlay.appendChild(icons);
  favIconFill.appendChild(fav);
  favIconFill.appendChild(favFill);
  icons.appendChild(favIconFill);
  icons.appendChild(download);
  icons.appendChild(maximize);
  gifoOverlay.appendChild(gifoInfo);
  gifoInfo.appendChild(user);
  gifoInfo.appendChild(title);

  return gifoOverlay;
}

//Esta función va a guardar el gif en favorito desde el overlay
function favDesktopOverlay(event) {
  //Aca con el event target estamos llamando a la imagen
  const imgFav = event.target;
  //Aca con el parentElement estamos llamando al div padre de la imagen, porque ya sabemos que es ese el que necesitamos
  //Le agregamos una clase para que cambie la imagen a Fav seleccionado
  const divFav = imgFav.parentElement;
  divFav.classList.toggle("favSelected");
   //Busco el Div que contiene la img del gif (que tiene informacion que voy a necesitar)
   const wrapper = event.target.closest(".gifo-wrapper");
   //llamo a la imagen, para poder usar la información
   const img = wrapper.querySelector(".gifo");
   favGenerica(img.dataset.id);

}

//Esta función abre el modal donde se ve el gif en pantalla completa en mobile
async function activeModal(event) {
  let modal = document.querySelector(".modal-activo");
  modal.classList.add("visible");
  console.log(event);

  //Llamamos al div que contiene la imagen que no tiene src y le asignamos la src del gift
  let divModal = document.querySelector(".modal-activo");
  const img = divModal.querySelector("img.modal-activado");
  img.src = event.target.src;

  //Usamos el dataset que le asignamos a la imagen en la funcion renderizarCarrouse, para poder traer la info del user y el title
  const user = divModal.querySelector("p.modal-user");
  user.innerText = event.target.dataset.user;

  const title = divModal.querySelector("p.modal-title");
  title.innerText = event.target.dataset.title;

  //Guaradar el id del gif en el boton, para luego poder utilizarlo en el local storage
  let btnFav = divModal.querySelector(".modal-icons");
  btnFav.dataset.id = event.target.dataset.id;

  //Llamamos al elemento a, le seteamos la url con el fetch - ya que el a va intentar descargarlo cuando se haga click
  const btnDownload = divModal.querySelector(".modal-descarga");
  const response = await fetch(event.target.dataset.url);
  const file = await response.blob(); //Blob es un archivo
  console.log("archivo: ", file);
  btnDownload.href = window.URL.createObjectURL(file); //Es un objeto nativo, sirve para convertir el file en una url

  //Aca nos fijamos si hay favoritos guardados en el local storag
  const favoritos = JSON.parse(localStorage.getItem("gifFav"));
  //Si hay favoritos guaradados
  if (favoritos != null) {
    //guardamos en el id en una const
    const gifId = event.target.dataset.id;
    //nos fijamos que ese id exista en el local storage
    const existe = favoritos.some((id) => id === gifId);
    //si existe le agregamos la clase selected, para que el corazón cambie a pintado violeta
    if (existe) {
      btnFav.classList.add("selected");
    }
  }
}

//Estas funciones hacen que pueda abrir el modal con el boton maximixe, cuando estoy en desktop en el overlay
//cuando se hace hover sobre el gif

function agrandar(event) {
  const wrapper = event.target.closest(".gifo-wrapper");
  const img = wrapper.querySelector(".gifo");
  activeModalDesktop(img);
}

async function activeModalDesktop(img) {
  //Llamamos al div que contiene toda la información cuando el modal esta activado
  let modal = document.querySelector(".modal-activo");
  modal.classList.add("visible");
  //Llamamos al div que contiene la imagen que no tiene src y le asignamos la src del gift
  // let divModal = document.querySelector(".modal-activo");
  const img1 = modal.querySelector("img.modal-activado");
  img1.src = img.src;
  //Usamos el dataset que le asignamos a la imagen en la funcion renderizarCarrouse, para poder traer la info del user y el title
  const user = modal.querySelector("p.modal-user");
  user.innerText = img.dataset.user;

  const title = modal.querySelector("p.modal-title");
  title.innerText = img.dataset.title;

  //Guaradar el id del gif en el boton, para luego poder utilizarlo en el local storage
  let btnFav = modal.querySelector(".modal-icons");
  btnFav.dataset.id = img.dataset.id;

  //Llamamos al elemento a, le seteamos la url con el fetch - ya que el a va intentar descargarlo cuando se haga click
  const btnDownload = modal.querySelector(".modal-descarga");
  const response = await fetch(img.dataset.url);
  const file = await response.blob(); //Blob es un archivo
  console.log("archivo: ", file);
  btnDownload.href = window.URL.createObjectURL(file); //Es un objeto nativo, sirve para convertir el file en una url

  //Aca nos fijamos si hay favoritos guardados en el local storag
  const favoritos = JSON.parse(localStorage.getItem("gifFav"));
  //Si hay favoritos guaradados
  if (favoritos != null) {
    //guardamos en el id en una const
    const gifId = img.dataset.id;
    //nos fijamos que ese id exista en el local storage
    const existe = favoritos.some((id) => id === gifId);
    //si existe le agregamos la clase selected, para que el corazón cambie a pintado violeta
    if (existe) {
      btnFav.classList.add("selected");
    }
  }
}

//Con esta función se puede descargar el gif desde el overlay en desktop
async function overlayDownload(event) {
  //Busco el Div que contiene la img del gif (que tiene informacion que voy a necesitar)
  const wrapper = event.target.closest(".gifo-wrapper");
  //llamo a la imagen, para poder usar la información
  const img = wrapper.querySelector(".gifo");
  //Creamos un elemento a, para poder usar el atributo download
  let a = document.createElement("a");
  a.download = "download";
  let response = await fetch(img.dataset.url);
  let file = await response.blob();
  //Para que el download del elemento a funcione, tiene que tener un href
  a.href = window.URL.createObjectURL(file);
  a.click();
}

//Con esta función cuando el modal esta abierto, apretando la X se cierra
let closeBtn = document.querySelector(".modal-btn-close");
if (closeBtn != null) {
  closeBtn.addEventListener("click", closeModal);
}

function closeModal(params) {
  let modal = document.querySelector(".modal-activo");
  modal.classList.remove("visible");

  //Cuando cierro el modal le saca la clase selected a todos los gifs, pero en el metodo activeModal, se fija los que estan guardados
  //en favoritos para que tengan la clase, es decir el corazon seleccionado en color violeta
  const btn = modal.querySelector(".modal-icons");
  btn.classList.remove("selected");
}

//Guaradar los gif favoritos en el local storage
let heartFav = document.querySelector(".modal-icons");
heartFav.addEventListener("click", guardarFav);

function guardarFav(event) {
  let heartFav = document.querySelector(".modal-icons");
  heartFav.classList.toggle("selected");

  //Guardo el id del gif en un variable
  let gifId = heartFav.dataset.id;

  favGenerica(gifId);
}

function favGenerica(gifId) {
  //Guardo en una constante el array de ids que viene del localstorage
  const favoritos = JSON.parse(localStorage.getItem("gifFav"));

  //Veo si el local storage es null es porq esta vacio
  if (favoritos === null) {
    //agrego ese id al local storage
    const gifFavoritos = [];
    gifFavoritos.push(gifId);
    localStorage.setItem("gifFav", JSON.stringify(gifFavoritos));
    //Si no esta vacio, comparo primero si hay uno que ya esta guardado con ese mismo id
  } else {
    const hayUnoIgual = favoritos.some((id) => id === gifId);
    //Si hay lo borro
    if (hayUnoIgual) {
      //Obtener la posición del elemento en el array del localstorage
      let index = favoritos.indexOf(gifId);
      //Utilizo el metodo splice para eliminarlo
      favoritos.splice(index, 1);
      //Guardo el nuevo array en el localstorage
      localStorage.setItem("gifFav", JSON.stringify(favoritos));
    } else {
      //Si no hay uno igual directamente lo guardo en el local storage
      favoritos.push(gifId);
      localStorage.setItem("gifFav", JSON.stringify(favoritos));
    }
  }

  //Cuando estoy en la página de favoritos y agrego uno nuevo se renderiza automaticamente, cuando estoy en la home y agrego un nuevo favorito
  //no lo hace pues estoy en otra página. Para verificar si estoy en la home o en favoritos me fijo si el container esta disponible.
  //Y lo hag verificando que el container sea distinto de null
  const container = document.querySelector(".renderFavoritos");
  if (container !== null) {
    iniciarFavoritos();
  }
}

const container = document.querySelector(".gifos");
if (container !== null) {
  carrouselGifos();
}
