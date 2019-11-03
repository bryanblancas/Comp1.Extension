/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var usuarioLogin = {email: '', contrasenia: ''};
var IP = new IPClase();

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

/***************************************/
/****** Final Funciones de Header ******/
/***************************************/


/************ Inicio ****************/
/********** Signup html *************/
/************************************/

$(document).ready(function(){
	$('body').hide();
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			//Existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','display:none');
			$('#btnRevocar,#email,#password').attr('disabled','disabled');
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

$('#btnRevocar').click(function(){	
	if($('#email').val().length > 0 && $('#password').val().toString().length > 0){
        usuarioLogin.email = $('#email').val();
        usuarioLogin.contrasenia = $('#password').val();
        var hash = CryptoJS.SHA256($('#password').val()).toString();
        usuarioLogin.contrasenia = hash;
		mostrarMensajeWarning('¿Esta seguro que desea revocar su certificado?','Este proceso no podrá revertirse');
	}else{
		mostrarMensajeError('Datos incorrectos','Por favor, ingrese email y/o contraseña correctos');
	}
});

function mensajeConfirmacion() {
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'revocarCertificado',
		dataType: 'json',
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
				mostrarMensajeError('','Usuario y/o contraseña no validos');
			}else if(data.status == 1){
				$('#imgChW').attr('class','card-img-top mt-2');
				mostrarMensajeSuccess('Se ha revocado certificado','Favor de iniciar sesión de nuevo');
			}
		},	
		error: function(){
			$('#imgChW').attr('class','card-img-top mt-2');
			mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
		}
	});
}

$('.cerrarVentana').click(function(){
	window.close();
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

function mostrarMensajeWarning(titulo='', mensaje='') {
	Swal.fire({
		title: titulo,
		text: mensaje,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		cancelButtonText: 'Cancelar',
		confirmButtonText: 'Si, continuar!'
	  }).then((result) => {
		if (result.value) {
			mensajeConfirmacion();
		}
	});
}

function mostrarMensajeSuccess(titulo='', mensaje='') {
	Swal.fire({
		title: titulo,
		text: mensaje,
		type: 'success',
		confirmButtonColor: '#3085d6',
		confirmButtonText: 'Continuar'
	}).then((result) => {
		$('#hrefSignin').click();
	})
}

/************* Final ****************/
/********** Signup html *************/
/************************************/