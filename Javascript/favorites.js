//Aca renderizo los gifs que ya estan guardados en el local storage
async function iniciarFavoritos(params) {
  const favoritos = JSON.parse(localStorage.getItem("gifFav"));
  if (favoritos != null && favoritos.length) {
    //Pusimos la segunda condición porq tiene que ser distinto de null y a la vez no estar vacio(si lenght me da 0 es false)
    const url = new URL("https://api.giphy.com/v1/gifs");
    url.searchParams.append("api_key", "RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V");
    const ids = favoritos.filter(id => id != null);
    url.searchParams.append("ids", ids.join(","));
    console.log(url.toString());
    const response = await fetch(url);
    const idGift = await response.json();
    console.log(idGift);
    let contaniner = document.querySelector(".renderFavoritos");
    contaniner.innerHTML = "";
    for (let i = 0; i < idGift.data.length; i++) {
      const element = idGift.data[i];
      renderizarFavoritos(element);
    }
    //Aca tengo que agregar clases para que el icono agrega fav desaperzca con los favoritos agregados
    let pageTitle = document.querySelector(".pageTitle");
    pageTitle.classList.add("showTitle");
    let divFavoritos = document.querySelector(".favorites");
    divFavoritos.classList.add("agregaFavoritos");
  } else {
    //remuevo las clases para que vuelva aparecer el icono agrega un favorito
    let pageTitle = document.querySelector(".pageTitle");
    pageTitle.classList.remove("showTitle");
    let divFavoritos = document.querySelector(".favorites");
    divFavoritos.classList.remove("agregaFavoritos");
    let contaniner = document.querySelector(".renderFavoritos");
    contaniner.innerHTML = "";
  }
}

function renderizarFavoritos(element) {
  //Creo el div que va a contener toda la estructura
  let contaniner = document.querySelector(".renderFavoritos");

  //creo el div que va a contener a cada uno de los gif
  let divWrapper = document.createElement("div");
  divWrapper.classList.add("gifo-wrapper");

  let image = document.createElement("img");
  image.classList.add("trendWordGift", "gifo");
  image.src = `${element.images.original.url}`;
  console.log(element);
  image.dataset.user = element.username;
  image.dataset.title = element.title;
  image.dataset.id = element.id;
  image.dataset.url = element.images.original.url;
  image.addEventListener("click", activeModal);

  let gifoOverlay = createOverlay(element);

  divWrapper.appendChild(image);
  divWrapper.appendChild(gifoOverlay);
  contaniner.appendChild(divWrapper);
}

iniciarFavoritos();
