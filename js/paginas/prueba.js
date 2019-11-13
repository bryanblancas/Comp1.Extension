
/********** Variables globales *************/
var btnActivar = true;
var statusCertificado = false;
var IP = new IPClase();
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
	});
});

$('#btnAviso').click(function(){
	chrome.tabs.create({url:"../webPage/Aviso.html"});
	//window.open(IP.getIP()+'Aviso');
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
	
	Swal.fire({
		text: 'Se ha cerrado sesión exitosamente',
		width: 200
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
