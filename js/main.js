let secuenciaMaquina=[];
let secuenciaUsuario=[];
let ronda=0;
var audioError=new Audio('sonidos/sad-meow-song.mp3');
var audioCuadro=new Audio('sonidos/mario-coin.mp3');



document.querySelector('button[type=button]').onclick = comenzarJuego;

actualizarEstado('Tocá "Empezar" para jugar!');
//actualizarNumeroRonda('-');
//bloquearInputUsuario();

function comenzarJuego(){
    reiniciarEstado();
    manejarRonda();
}

function reiniciarEstado(){
    audioError.pause();
    audioError.currentTime=0;
    secuenciaMaquina=[];
    secuenciaUsuario=[];
    ronda=0;
}

function manejarRonda(){
    actualizarEstado('Turno de la maquina');
    
    bloquearInputUsuario();

    const $nuevoCuadro=obtenerCuadroAleatorio();
    
    secuenciaMaquina.push($nuevoCuadro);

    const RETRASO_TURNO_JUGADOR=(secuenciaMaquina.length+1)*1000;

    secuenciaMaquina.forEach(function($cuadro,index){
        const RETRASO_MS=(index+1)*1000;
        setTimeout(function(){
            resaltar($cuadro);
        },RETRASO_MS);
    });

    setTimeout(function(){
        actualizarEstado('Turno del jugador');
        desbloquearInputUsuario();
    }, RETRASO_TURNO_JUGADOR);

    secuenciaUsuario=[];
    ronda++;
    actualizarNumeroRonda(ronda);

}

function actualizarNumeroRonda(ronda){
    document.querySelector('#ronda').textContent=ronda;
}

function manejarInputUsuario(e){
    
    const $cuadro=e.target;
    resaltar($cuadro);
    secuenciaUsuario.push($cuadro);
    

    const $cuadroMaquina=secuenciaMaquina[secuenciaUsuario.length-1];

    if($cuadro.id!=$cuadroMaquina.id){
        perder();
        return;
    }

    if(secuenciaUsuario.length===secuenciaMaquina.length){
        audioCuadro.play();
        bloquearInputUsuario();
        setTimeout(manejarRonda,1000);
    }
}

function perder(){
    bloquearInputUsuario();
    reproducirSonidoError();
    actualizarEstado('Perdiste! Tocá "Empezar" para jugar de nuevo!',true);
}

function desbloquearInputUsuario(){
    const $cartas=document.querySelectorAll('.carta');
    
    $cartas.forEach(function($cuadro){
        $cuadro.classList.add('activo');
        
        $cuadro.onclick=manejarInputUsuario;
    })
}

function resaltar($cuadro){
    $cuadro.style.opacity=1;
    setTimeout(function(){
        $cuadro.style.opacity=0.5;
    },500);
}

function obtenerCuadroAleatorio(){
    bloquearInputUsuario();
    const $cuadros=document.querySelectorAll('.carta');
    const indice=Math.floor(Math.random()*$cuadros.length);

    return $cuadros[indice];
}

function bloquearInputUsuario(){
    const $cartas=document.querySelectorAll('.carta');

    $cartas.forEach(function($cuadro){
        
        $cuadro.classList.remove('activo');
        $cuadro.onclick=function(){
        };
    });
}


function actualizarEstado(estado, error=false){
    const $estado=document.querySelector('#estado');
    const $contEstado=document.querySelector('#cont-estado');

    $estado.textContent=estado;
    $estado.style.fontWeight=700;

    if(error){
        $contEstado.classList.remove('alert-primary');
        $contEstado.classList.add('alert-danger');
    }else{
        $contEstado.classList.remove('alert-danger');
        $contEstado.classList.add('alert-primary');
    }

}

function reproducirSonidoError(){
    audioError.play();
}

function reproducirSonidoCuadro(){
    audioCuadro.play();
}

