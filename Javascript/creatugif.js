//Voy a utilizar estas constantes para poner en funcionamiento el cronometro
let stopwatchInterval;
let runningTime = 0;
const contador = document.querySelector(".contador-grabacion");

//Llamo al botón comenzar y le aplico el listener
const comenzar = document.querySelector("#comenzar");
comenzar.addEventListener("click", comenzarFilm);
let recorder;

async function comenzarFilm(params) {
  //llamo al contenedor que tiene los primero títulos y texto y los oculto
  let containerFirstTitle = document.querySelector(".firstTitle");
  containerFirstTitle.classList.add("access");
  //Llamo al contenedor que tiene los segundos títulos y texto y los muestro
  let containerSecondTitle = document.querySelector(".secondTitle");
  containerSecondTitle.classList.add("access");
  //Llamo al contendor que tiene los número 1, 2 y 3
  let crearPasosOne = document.querySelector(".creargifo-pasos-numero.one");
  crearPasosOne.classList.add("pasosNumber");
  //Lamo al boton comenzar y le agrego una clase
  let btnMisGifos = document.querySelector("#comenzar");
  btnMisGifos.classList.add("firstStep");
  //Llamo al boton de grabar le agrego una clase para que se muestre
  let grabar = document.querySelector("#grabar");
  grabar.classList.add("record");
  //Vamos a pedirle al usuario acceso a la cámara
  //Primero le preguntamos al navegador es capaz de manejar la cámara del dispositivo
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    //Creo un objeto constraints que tiene las medidas del video y sin audio
    const constraints = {
      video: {
        width: {
          min: 300,
          ideal: 360,
          max: 390,
        },
        height: {
          min: 200,
          ideal: 250,
          max: 300,
        },
      },
      audio: false,
    };
    //Pido acceso a la cámara y a la RESPUESTA la guardo en stream, a la funcion getUserMedia le paso como parametro constraints
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    // ocultar el mensaje y mostrar solo el elemento <video>
    let containerSecondTitle = document.querySelector(".secondTitle");
    containerSecondTitle.classList.remove("access");
    let video = document.querySelector(".video-stream");
    video.classList.add("showVideo");
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
    recorder = new RecordRTCPromisesHandler(stream, {
      type: "gif",
    });
  }
}

//Llamo al boton grabar y le aplico el listener
let grabar = document.querySelector("#grabar");
grabar.addEventListener("click", comenzarAGrabar);

function comenzarAGrabar(params) {
  //Llamo al círculo 1 uno para sacarle la clase
  let crearPasosOne = document.querySelector(".creargifo-pasos-numero.one");
  crearPasosOne.classList.remove("pasosNumber");
  //   //Llamo al círculo número 2 para agregarle una clase y que este marcado indicando que es el paso que se esta realizando
  let crearPasostwo = document.querySelector(".creargifo-pasos-numero.two");
  crearPasostwo.classList.add("pasosNumber");
  //llamo al contador de minutos de grabación para que se muestre y le asigno la función start para que comienze el contador
  contador.classList.add("minutos");
  start();
  //Llamo al boton de grabar le quito la clase para que no se muestre
  let grabar = document.querySelector("#grabar");
  grabar.classList.remove("record");
  //Llamo al boton finalizar y le agrego una clase para que se muestre
  let finalizar = document.querySelector("#finalizar");
  finalizar.classList.add("end");

  //Llamamos al método para iniciar la grabación
  recorder.startRecording();
}

function start(params) {
  let startTime = Date.now() - runningTime;
  stopwatchInterval = setInterval(() => {
    runningTime = Date.now() - startTime;
    contador.textContent = calculateTime(runningTime);
  }, 1000);
}

function calculateTime(runningTime) {
  const total_seconds = Math.floor(runningTime / 1000);
  const total_minutes = Math.floor(total_seconds / 60);

  const display_seconds = (total_seconds % 60).toString().padStart(2, "0");
  const display_minutes = total_minutes.toString().padStart(2, "0");

  return `${display_minutes}:${display_seconds}`;
}

function stop(params) {
  runningTime = 0;
  clearInterval(stopwatchInterval);
  contador.textContent = "00:00";
}

//Llamo al boton de finalizar y le aplico el listener
let finalizar = document.querySelector("#finalizar");
finalizar.addEventListener("click", endFilm);

async function endFilm(params) {
  //Llamo al boton de repetir captura para que se muestre
  let repetirCaptura = document.querySelector(".contador-repetircaptura");
  repetirCaptura.classList.add("again");
  //llamo al contador de minutos de grabación le quito la clase para que no se muestre
  let contador = document.querySelector(".contador-grabacion");
  contador.classList.remove("minutos");
  //Llamo al boton finalizar y le quito la clase para que no se muestre
  let finalizar = document.querySelector("#finalizar");
  finalizar.classList.remove("end");
  //Llamo al atributo a y le agrego una clase para que se muestre
  let btnDownloadA = document.querySelector("#btnDownload");
  btnDownloadA.classList.add("subir");
  //Llamo al contenedor de video le quito la clase para que no se vea y en su lugar se vea la grabación realizada
  const video = document.querySelector(".video-stream");
  video.classList.remove("showVideo");
  //Llamo al número 2 y le quito la clase para que deje de estar seleccionado
  let crearPasostwo = document.querySelector(".creargifo-pasos-numero.two");
  crearPasostwo.classList.remove("pasosNumber");
  //Llamo al número 3 y le agrego una clase para que este seleccionado como el paso que se esta realizando
  let crearPasosThree = document.querySelector(".creargifo-pasos-numero.three");
  crearPasosThree.classList.add("pasosNumber");

  //Aplico el método stopRecording
  await recorder.stopRecording();

  //Mostrar el gif grabado
  let img = document.querySelector(".gif-grabado");
  img.classList.add("visible");
  img.src = await recorder.getDataURL();

  //Le asigno al atributo a el href del archivo
  let downloadA = document.querySelector("#btnDownload");
  //Se lo asignamos con la GetDataURL que en este caso es propio de esta libreria
  downloadA.href = await recorder.getDataURL();

  //Llamo a la funcion stop, para que se pare el cronometro y vuelva a 0
  stop();
}

//Si se aprieta en el boton repetir captura, tiene que volver al estado anterior, poder volver a grabar el gifo

let repetirCaptura = document.querySelector(".contador-repetircaptura");
repetirCaptura.addEventListener("click", repetirGrabacion);

async function repetirGrabacion(params) {
  //Llamo al boton de repetir captura le quito la clase para que no se muestre
  let repetirCaptura = document.querySelector(".contador-repetircaptura");
  repetirCaptura.classList.remove("again");
  //Llamo al boton atributo a y le quito la clase para que no se muestre
  let btnDownloadA = document.querySelector("#btnDownload");
  btnDownloadA.classList.remove("subir");
  //Llamo al boton de finalizar le quito la clase para que no se muestre
  let finalizar = document.querySelector("#finalizar");
  finalizar.classList.remove("end");
  //Llamo al boton de grabar y le agrego una clase para que se muestre
  let grabar = document.querySelector("#grabar");
  grabar.classList.add("record");
  //Llamo al número 3 y le quito la clase para volver un paso para atras y que se deseleccione
  let crearPasosThree = document.querySelector(".creargifo-pasos-numero.three");
  crearPasosThree.classList.remove("pasosNumber");

  //Llamamos al método que reinicia el metodo de grabación
  await recorder.reset();

  //Oculto la imagen con el gif grabado y vuelvo a mostrar donde se ve el video
  let img = document.querySelector(".gif-grabado");
  img.classList.remove("visible");
  img.src = "";
  const video = document.querySelector(".video-stream");
  video.classList.add("showVideo");
}

//Llamo al boton subir gifo, para que se suba a gifi y se guarde en la página de mis gifos

// let subirGifo = document.querySelector("#subirGifo");
// subirGifo.addEventListener("click", upLoadGif);

async function upLoadGif() {
  //Llamo al círculo número 2 le quito la clase
  let crearPasostwo = document.querySelector(".creargifo-pasos-numero.two");
  crearPasostwo.classList.remove("pasosNumber");
  //Llamo al círculo número 3 y le agrego una clase
  let crearPasosThree = document.querySelector(".creargifo-pasos-numero.three");
  crearPasosThree.classList.add("pasosNumber");
  //Llamo al boton de repetir captura le quito la clase para que no se muestre
  let repetirCaptura = document.querySelector(".contador-repetircaptura");
  repetirCaptura.classList.remove("again");
  //Llamo al boton subir gifo le quito la clase subir para que no se muestre
  let subirGifo = document.querySelector("#subirGifo");
  subirGifo.classList.remove("subir");
  //Llamo al overlay de que el gif se esta subiendo para que se muestre
  let overlay = document.querySelector(".overlay-video");
  overlay.classList.add("upLoad");

  const blob = await recorder.getBlob(); //blob va a tener el resultado de la promesa
  const file = new File([blob], "giphy.gif");

  console.log("file: ", file);

  let formData = new FormData();
  formData.append("file", file, "giphy.gif");

  const params = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  const url = new URL("https://upload.giphy.com/v1/gifs");
  url.searchParams.append("api_key", "RwoT9qpoXvCTVBgeuAwXzGbCSTUBQT7V");
  console.log(url.toString());
  const response = await fetch(url, params);
  const idGif = await response.json();
  console.log(idGif);

  if (idGif.meta.status === 200) {
    localStorage.setItem("misGifs", idGif);
  } else {
    alert("Problemas con el servidor, intentalo de nuevo más tarde!");
    let okIcon = document.querySelector(".overlay-video-icon.okIcon");
    okIcon.classList.add("showOk");
    let okText = document.querySelector(".overlay-video-parrafo.okText");
    okText.classList.add("showOk");
    let uploadIcon = document.querySelector(".overlay-video-icon");
    uploadIcon.classList.add("showOk");
  }

  // TODO:
  // 1. Controlar si el idGif.meta.status es success (200)
  // 1.1. Si es 200, hay que guardar el id en el localstorage, en una collection nueva que se puede llamar "misgifos"
  // 2. Si no es 200, es porque hubo un problema, mostrar el error
}
