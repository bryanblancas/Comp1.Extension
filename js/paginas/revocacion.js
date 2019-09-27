/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var usuarioLogin = {email: '', contrasenia: ''};
var IP = 'https://10.100.66.216:3000/api/';

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

/*$(document).ready(function() {
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			window.close();
		}
	});	
});*/

$(document).ready(function(){
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			//Existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','display:none');
			$('#btnRevocar,#email,#password').attr('disabled','disabled');
		}else{
			//No existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','cursor:pointer');
		}
	});	
});

$('#btnRevocar').click(function(){	
	if(comprobarEmail($('#email').val()) == false){
		mostrarMensajeError('Email incorrecto','El formato de email no es valido');
	}
	else if(comprobarPassword($('#password').val()) == false){
		mostrarMensajeError('Contraseña incorrecta','El formato de la contraseña no es valido');
	}
	else{
        usuarioLogin.email = $('#email').val();
        usuarioLogin.contrasenia = $('#password').val();
        var hash = CryptoJS.SHA256($('#password').val()).toString();
        usuarioLogin.contrasenia = hash;
		mostrarMensajeWarning('¿Esta seguro que desea revocar su certificado?','Este proceso no podrá revertirse');
		//mensajeConfirmacion();
	}
});

function mensajeConfirmacion() {
	$.ajax({
		type: 'POST',
		url: IP+'revocarCertificado',
		dataType: 'json',
		data: {
			'email': usuarioLogin.email,
			'password': usuarioLogin.contrasenia
		},
		beforeSend: function(){
			$('#imgChW').attr('class','card-img-top mt-2 rotate');
		},
	}).done(function(data){
		console.log(data);
		if(data.status == 0){
			$('#imgChW').attr('class','card-img-top mt-2');
			mostrarMensajeError('Usuario no encontrado','Por favor, ingrese sus datos correctamente');
		}else if(data.status == 1){
			$('#imgChW').attr('class','card-img-top mt-2');
			mostrarMensajeSuccess('Se ha revocado certificado','Se ha generado un nuevo certificado, porfavor inicie sesión de nuevo');
		}	
	}).fail(function(data){
		//console.log(data);
		$('#imgChW').attr('class','card-img-top mt-2');
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
}

$('#imgEye').click(function(){
	if($('#password').attr('type') == 'password' && $('#password').val().length > 0){
		$('#password').removeAttr('type');
		$('#password').attr('type','text');
	}else{
		$('#password').removeAttr('type');
		$('#password').attr('type','password');
	}
});

$('#email').keyup(function(){
	if($('#email').val().length == 0){
		$('#regexEmail').html('');
	}else{
		if(comprobarEmail($('#email').val())){
			$('#regexEmail').attr('style','color:green');
			$('#regexEmail').html('Correcto');
		}else{
			$('#regexEmail').attr('style','color:red');
			$('#regexEmail').html('Incorrecto');
		}
	}
});

$('#password').keyup(function(){
	if (event.keyCode === 13) {
		$('#btnSignin').click();
	}else if($('#password').val().length == 0){
		$('#regexPassword').html('');
	}else{
		if(comprobarPassword($('#password').val())){
			$('#regexPassword').attr('style','color:green');
			$('#regexPassword').html('Correcto');
		}else{
			$('#regexPassword').attr('style','color:red');
			$('#regexPassword').html('Incorrecto');
		}
	}
});

function comprobarEmail(email) {
	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function comprobarPassword(password) {
	regexpass = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d_@#?/]+$/;
	if( password == null || password.length < 8 || password.length > 16 || !regexpass.test(password)) {
		return false;
  	}else{
		return true;
	}
}

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