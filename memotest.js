$contenedorCartas = document.getElementById("contenedor-cartas")
$btnMezclarReiniciar = document.getElementById("boton-mezclar-reiniciar")
$contenedorGanador = document.getElementById("ganaste")
$contenedorJuego = document.getElementById("contenedor-juego")

let partida = 0
const cartas = [...$contenedorCartas.children]

let cartasReveladas = {
    cartaPrimaria: "",
    cartaSecundaria:""
}

const volverAJugar= ()=>{
        $contenedorCartas.style.display = "none";
        $contenedorGanador.style.display = "flex";
        $btnMezclarReiniciar.style.display = "block"
        $btnMezclarReiniciar.textContent = "Volver a Jugar"
        $btnMezclarReiniciar.style.width = "300px" 
}

const limpiarCartasReveladas = ()=>{
    cartasReveladas.cartaPrimaria = ""
    cartasReveladas.cartaSecundaria = ""
}


const mezclarCartas = ()=>{
    function numerosAleatorios() {
        return Math.random() - 0.5;
    }
    cartas.sort(numerosAleatorios)
}

const posicionarCartasAleatoriamente=()=>{
    while ($contenedorCartas.firstChild) {
        $contenedorCartas.removeChild($contenedorCartas.firstChild);
    }
    cartas.forEach((carta)=>{
        $contenedorCartas.appendChild(carta)
    })
}

const ocultarCartas = ()=>{
    const imgCartas = cartas.map(carta=> carta.querySelector("img"))
    imgCartas.forEach((img)=>{
        img.style.opacity = 0
    })
}
const revelarCarta=(e)=>{
    cartaSeleccionada = e.target
    cartaSeleccionada.style.opacity = 1
    if(cartasReveladas.cartaPrimaria === ""){
        cartasReveladas.cartaPrimaria = cartaSeleccionada
    }else{
        cartasReveladas.cartaSecundaria = cartaSeleccionada
    }
    if(cartasReveladas.cartaSecundaria !== ""){
        comprobarCartas()
        setTimeout(()=>{
         comprobarJuegoTerminado()   
        },1000)
    }
}

const otorgarRevelarCarta = ()=>{
    cartas.forEach((carta)=>{
        carta.addEventListener("click",revelarCarta)
    })
}
const borrarCarta = ()=>{
    cartas.forEach((carta)=>{
        let cartacomparar = carta.querySelector("img")
        let srcCarta = cartacomparar.src
        
        if(srcCarta.length === cartasReveladas.cartaPrimaria.src.length && cartacomparar.id === cartasReveladas.cartaPrimaria.id){
            carta.style.opacity = 0
        }
        else if(srcCarta.length === cartasReveladas.cartaSecundaria.src.length && cartacomparar.id === cartasReveladas.cartaSecundaria.id){
            carta.style.opacity = 0
        }
        
    })
}   

const comprobarCartas = ()=>{
    const laMismaCarta = (cartasReveladas.cartaPrimaria === cartasReveladas.cartaSecundaria)
    const cartasIguales = (cartasReveladas.cartaPrimaria.src === cartasReveladas.cartaSecundaria.src && cartasReveladas.cartaPrimaria.id !== cartasReveladas.cartaSecundaria.id)
    
    if(laMismaCarta){
        cartasReveladas.cartaSecundaria = ""
        return
    }
    if (cartasIguales) {
        setTimeout(()=>{
            borrarCarta()
        },400)
        setTimeout(()=>{
            limpiarCartasReveladas()
        },500)
        
    }else{
        setTimeout(()=>{
            limpiarCartasReveladas()
            ocultarCartas()
        },500)
    }
}
const comprobarJuegoTerminado = () => {
    let todasReveladas = true;

    cartas.forEach((carta) => {
        let opacidad = window.getComputedStyle(carta).getPropertyValue("opacity");
        
        if (opacidad !== "0") {
            todasReveladas = false;
            return;
        }
    });

    if (todasReveladas) {
        volverAJugar()
    }
};
const ocultarBoton = ()=>{
    $btnMezclarReiniciar.style.display = "none"
}
const comenzarJuego = ()=>{
    if(partida === 1){
        location.reload()
    }
    partida++
    ocultarBoton()
    ocultarCartas()
    mezclarCartas()
    posicionarCartasAleatoriamente()
    otorgarRevelarCarta()
}
$btnMezclarReiniciar.addEventListener("click",comenzarJuego)