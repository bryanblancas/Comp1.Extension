/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var usuarioLogin = {email: '', contrasenia: ''};
var IP = new IPClase();
/*te invito a echarle ganas*/
/***************************************/
/******* Final Variables globales ******/
/***************************************/

/***************************************/
/***** Inicio Funciones de Header ******/
/***************************************/

$('#hrefSignin').click(function(){
	window.open('../../webPage/signin.html',"_self");
});

$('#hrefSignup').click(function(){
	window.open('../../webPage/signup.html',"_self");
});

$('#hrefWebPage').click(function(){
	window.open('../../webPage/webpage.html',"_self");
});

/***************************************/
/****** Final Funciones de Header ******/
/***************************************/



/************ Inicio ****************/
/********** Login html *************/
/************************************/

$(document).ready(function(){
	$('body').hide();
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			//Existe un certificado
			$('#hrefSignup,#hrefSignin,#revocarCertificadoDiv').attr('style','display:none');
			$('#login,#email,#password').attr('disabled','disabled');
			$('#conCertificado').attr('style','display:inline');
			$('#sinCertificado').attr('style','display:none');
		}else{
			//No existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','cursor:pointer');
			$('#conCertificado').attr('style','display:none');
			$('#sinCertificado').attr('style','display:inline');
		}
	});	
	$('body').fadeIn(100);
});

function quitarEncabezadosCertificado(certificado) {
	crt = certificado.split('-----BEGIN CERTIFICATE-----')[1];
	crt = crt.split('-----END CERTIFICATE-----')[0];
	return crt;
}

$('#login').click(function(){
	if($('#email').val().length > 0 && $('#password').val().toString().length > 0){
		usuarioLogin.email = $('#email').val();
		// var hash = CryptoJS.SHA256($('#password').val()).toString();
		usuarioLogin.contrasenia = $('#password').val();
		$.ajax({
			type: 'POST',
			url: IP.getIP()+'obtenerCertificado',
			dataType: 'json',
			async: false,
			data: {
				'email': usuarioLogin.email,
				'password': usuarioLogin.contrasenia
			},
			beforeSend: function(){
				$('#imgChW').attr('class','card-img-top mt-2 rotate');
			},
			success: function(data){
				if(data.status == 0){
					$('#imgChW').attr('class','card-img-top mt-2');
					mostrarMensajeError('Usuario y/o contraseña no validos','Favor de verificar email y/o contraseña');
				}else{
					crt = quitarEncabezadosCertificado(data.certificado);
					/*Se guarda en Storage*/
					chrome.storage.local.set({cert: crt});
					chrome.storage.local.get(['cert'],function(result){
						if(result.cert != null){
							$('#imgChW').attr('class','card-img-top mt-2');
							mostrarMensajeSuccess('Sesión iniciada con éxito','');
						}else{
							$('#imgChW').attr('class','card-img-top mt-2');
							mostrarMensajeError('Ha ocurrido un problema','Por favor, intentelo mas tarde');
						}
					});
				}
			},
			error: function(){
				$('#imgChW').attr('class','card-img-top mt-2');
				mostrarMensajeError('Ha ocurrido un problema','Por favor, intentelo mas tarde');
			}
		});
	}else{
		mostrarMensajeError('Datos incorrectos','Por favor, ingrese email y/o contraseña correctos');
	}
});

$('.cerrarVentana').click(function(){
	window.close();
});

$('#password').keyup(function(event){
	if (event.keyCode === 13) {
		$('#login').click();
	}else if($('#password').val().length == 0){
		$('#password').removeAttr('type');
		$('#password').attr('type','password');
	}
});

$('#imgEye').click(function(){
	if($('#password').attr('type') == 'password' && $('#password').val().length > 0){
		$('#password').removeAttr('type');
		$('#password').attr('type','text');
	}else{
		$('#password').removeAttr('type');
		$('#password').attr('type','password');
	}
});

function mostrarMensajeError(titulo='', mensaje='') {
	Swal.fire({
		title: titulo,
		text: mensaje,
		type: 'error',
		confirmButtonColor: '#3085d6',
		confirmButtonText: 'Aceptar'
	});
}

function mostrarMensajeSuccess(titulo='', mensaje='') {
	Swal.fire({
		title: titulo,
		text: mensaje,
		type: 'success',
		confirmButtonText: 'Aceptar'
	}).then((result) => {
		if(result.value){
			$('#hrefWebPage').click();
		}
	});
}

$('#pRevocarCertificado').click(() => {
	window.open('../../webPage/revocacion.html',"_self");
});

/************* Final ****************/
/********** Login html *************/
/************************************/
