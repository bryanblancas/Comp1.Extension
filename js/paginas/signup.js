/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var nuevoUsuario = {
	username: '', 
	email: '', 
	contrasenia: ''
};
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
	$('#selectColonia').select2();
	$('#selectColonia').html('<option value="0" selected>Sin Seleccionar</option>');
	$('#selectColonia').prop('disabled','disabled');
	$('#InputEstado,#InputMunicipio,#InputColonia,#InputCalle').prop('disabled','disabled');
	$('#InputEstado,#InputMunicipio,#InputColonia,#InputCalle').val('Sin Seleccionar');
	
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			//Existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','display:none');
			$('#email,#password,#username,#passwordRepetir,#btnContinuar').attr('disabled','disabled');
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

$('#btnSignup').click(function(){

	if(comprobarUserName($('#username').val()) == false){
		mostrarMensajeError('Nombre de usuario incorrecto','El nombre de usuario introducido no es valido');
	}
	else if(comprobarEmail($('#email').val()) == false){
		mostrarMensajeError('Email incorrecto','El email introducido no es valido');
	}
	else if(comprobarPassword($('#password').val()) == false){
		mostrarMensajeError('Contraseña incorrecta','La contraseña introducida no es valida');
	}
	else if($('#password').val() != $('#passwordRepetir').val()){
		mostrarMensajeError('Contraseñas incorrectas','Las contraseñas introducidas no coinciden');
	}else{
		nuevoUsuario.username = $('#username').val();
		nuevoUsuario.email = $('#email').val();
		nuevoUsuario.contrasenia = $('#password').val();
		// var hash = CryptoJS.SHA256($('#password').val()).toString();
		// nuevoUsuario.contrasenia = hash;
		mostrarMensajeConfirmacion('¿Desea continuar?','Se registrará usuario actual');
	}
});

function confirmarUsuario() {
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'guardarUsuario',
		dataType: 'json',
		data: {
			'username': nuevoUsuario.username,
			'email': nuevoUsuario.email,
			'password': nuevoUsuario.contrasenia
		},
		beforeSend: function(){
			$('#imgChW').attr('class','card-img-top mt-2 rotate');
		},
		success: function(data){
			if(data.status == 0){
				$('#imgChW').attr('class','card-img-top mt-2');
				mostrarMensajeError('Usuario no registrado','El usuario con correo email: '+data.email+' no ha sido creado');
			}else{
				$('#imgChW').attr('class','card-img-top mt-2');
				Swal.fire({
					title: 'Nuevo Usuario Registrado',
					text: "El usuario con correo email: "+data.email+" ha sido creado con éxito",
					type: 'success',
					confirmButtonColor: '#3085d6',				
					confirmButtonText: 'Iniciar Sesión'
				}).then((result) => {
					if (result.value) {
						$('#hrefSignin').click();
					}
				})
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

$('#passwordRepetir').keyup(function(){
	if($('#passwordRepetir').val().length == 0){
		$('#passwordRepetir').removeAttr('type');
		$('#passwordRepetir').attr('type','password');
	}
});

$('#password').keyup(function(){
	if($('#password').val().length == 0){
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

$('#imgEyeRepetir').click(function(){
	if($('#passwordRepetir').attr('type') == 'password' && $('#passwordRepetir').val().length > 0){
		$('#passwordRepetir').removeAttr('type');
		$('#passwordRepetir').attr('type','text');
	}else{
		$('#passwordRepetir').removeAttr('type');
		$('#passwordRepetir').attr('type','password');
	}
});

function comprobarEmail(email) {
	re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function comprobarUserName(username) {
	regexuser = /^[A-Za-z0-9_]+$/;
	if( username == null || username.length < 3 || username.length > 20 || !regexuser.test(username)) {
		return false;
	}else{
		return true;
	}
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

function mostrarMensajeConfirmacion(titulo='', mensaje='') {
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
			confirmarUsuario();
		}
	});
}

/************* Final ****************/
/********** Signup html *************/
/************************************/