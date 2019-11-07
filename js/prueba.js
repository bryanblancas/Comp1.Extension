
/********** Variables globales *************/
var btnActivar = true;
var statusCertificado = false;
var IP = 'https://25.7.11.142:3000/api/';
/*******************************************/

$(document).ready(function() {
	chrome.storage.local.get(['Activo'],function(result){
		if(result.Activo == null){
			btnActivar = true;
			$('#http').html('<p>Activado <img src="img/activado.png" width="4%" height="4%"/></p>');
			$('#btnActivar').html('Desactivar');
			$('#btnActivar').attr('style','background-color:red');
		}else{		
			btnActivar = result.Activo;
			if(result.Activo) {
				$('#http').html('<p>Activado <img src="img/activado.png" width="4%" height="4%"/></p>');
				$('#btnActivar').html('Desactivar');
				$('#btnActivar').attr('style','background-color:red');
			}else{
				$('#http').html('<p>Desactivado <img src="img/desactivado.png" width="4%" height="4%"/></p>');
				$('#btnActivar').html('Activar');
				$('#btnActivar').attr('style','background-color:green');
			}
		}
		getCertificateFromStorage();
		//getStatusCertificadoConection();
	});
	/*chrome.storage.local.get(['AvisoInicial'],function(result){

	});*/
});

$('#btnAviso').click(function(){
	//chrome.storage.local.set({statusCertConection: true});
	window.open(IP+'Aviso');
});

$('#btnActivar').click(function(){
	if (btnActivar == true){
		chrome.storage.local.set({Activo: false});
		btnActivar = false;
		$('#http').html('<p>Desactivado <img src="img/desactivado.png" width="4%" height="4%"/></p>');
		$('#btnActivar').html('Activar');
		$('#btnActivar').attr('style','background-color:green');
	}else{
		chrome.storage.local.set({Activo: true});
		btnActivar = true;
		$('#http').html('<p>Activado <img src="img/activado.png" width="4%" height="4%"/></p>');
		$('#btnActivar').html('Desactivar');
		$('#btnActivar').attr('style','background-color:red');
	}
});

$('#btnIniciarSesion').click(function(){
	chrome.tabs.create({url:"../webPage/webpage.html"});
});

$('#btnCerrarSesion').click(function(){
	chrome.storage.local.set({cert: null});
	$('#btnCerrarSesion').attr('style','display:none');
	$('#btnIniciarSesion').attr('style','display:inline-block');
	//$('#btnIniciarSesion').click();	
	Swal.fire({
		text: 'Se ha cerrado sesión exitosamente',
		width: 200,
		height: 150
	});
});

// Funcion que obtiene el certificado del Storage e inicia el proceso de software
function getCertificateFromStorage() {
	// Funcion del API de Google Chrome que obtiene el valor guardado en el Storage
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			$('#btnIniciarSesion').attr('style','display:none');
			$('#btnCerrarSesion').attr('style','display:inline-block');
		}else{
			$('#btnIniciarSesion').attr('style','display:inline-block');
			$('#btnCerrarSesion').attr('style','display:none');
		}
	});	
}

/*function getStatusCertificadoConection() {
	chrome.storage.local.get(['statusCertConection'],function(result){
		alert(result.statusCertConection);
		if(result.statusCertConection = null){
			$('#btnAviso').attr('style','display:none');
		}else{
			$('#btnAviso').attr('style','display:inline-block');
		}
	});
}*/



/*btn1 = document.getElementById("btn1");
btn1.addEventListener("click", function(){
	chrome.tabs.create({url:"../webPage/webpage.html"});
});*/

/*chrome.storage.local.get(['Activo'],function(result){
	if(result.Activo == null){
		btnActivar = true;
	}else{
		btnActivar = result.Activo;
	}
});*/
//alert(btnActivar);

/*document.addEventListener('DOMContentLoaded', function (event){
	recuperarValor();
});*/

/*
jQuery.get('../Files/datos.txt',function(data){
	var lines = data.split('\n');
	document.getElementById('data').innerHTML='<p>Key: '+lines[0]+'</p><p>Name: '+lines[1]+'</p><p>Password: '+lines[2]+'</p>';
});
*/

/*btnActivar.onclick =  function (argument) {
	chrome.storage.local.get(['Activo'],function(result){
		if(result.Activo==null){
			btnActivar=true;
		}else{
			btnActivar=result.Activo;
		}
	});

	if (btnActivar == true){
		//document.getElementById('data').innerHTML='';
		chrome.storage.local.set({Activo: false});
		console.log("Se ha desactivado");
		document.getElementById('http').innerHTML='<p>Desactivado</p>';
		document.getElementById('btnActivar').innerHTML='Activar';
		$('#btnActivar').attr('style','background-color:green');
	}
	else{
		/*
		jQuery.get('../Files/datos.txt',function(data){

			var lines = data.split('\n');

			document.getElementById('data').innerHTML='<p>Key: '+lines[0]+'</p><p>Name: '+lines[1]+'</p><p>Password: '+lines[2]+'</p>';
		});
		*/
		/*chrome.storage.local.set({Activo: true});
		console.log("Se ha activado");
		document.getElementById('http').innerHTML='<p>Activado</p>';
		document.getElementById('btnActivar').innerHTML='Desactivar';
		$('#btnActivar').attr('style','background-color:red');
	}
}*/




