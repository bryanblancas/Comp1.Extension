/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var usuarioLogin = {email: '', contrasenia: ''};
var IP = 'https://10.100.64.202:3000/api/';

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

$('#btnRevocar').click(function(){	
	if(comprobarEmail($('#email').val()) == false){
		mostrarMensaje('Email incorrecto','El formato de email no es valido','error');
	}
	else if(comprobarPassword($('#password').val()) == false){
		mostrarMensaje('Contraseña incorrecta','El formato de la contraseña no es valido','error');
	}
	else{
        usuarioLogin.email = $('#email').val();
        usuarioLogin.contrasenia = $('#password').val();
        var hash = CryptoJS.SHA256($('#password').val()).toString();
        usuarioLogin.contrasenia = hash;
		mensajeConfirmacion();
	}
});

function mensajeConfirmacion() {
	Swal.fire({
		title: '¿Esta seguro que desea revocar su certificado?',
		text: "Este proceso no podrá revertirse",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Si, revocar certificado'
	}).then((result) => {
		if (result.value) {
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
					mostrarMensaje('Usuario no valido','Por favor, ingrese sus credenciales correctas','error');
				}else if(data.status == 1){
					$('#imgChW').attr('class','card-img-top mt-2');
					Swal.fire({
						title: 'Se ha revocado certificado',
						text: "Se ha generado un nuevo certificado, porfavor inicie sesión de nuevo",
						type: 'success',
						confirmButtonColor: '#3085d6',
						confirmButtonText: 'Continuar'
					}).then((result) => {
						$('#hrefSignin').click();
					})
				}	
			}).fail(function(data){
				//console.log(data);
				$('#imgChW').attr('class','card-img-top mt-2');
				mostrarMensaje('Ah ocurrido un error', 'Por favor intentelo mas tarde','error');
			});
		}
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

function mostrarMensaje(titulo='', mensaje='', tipo='') {
	if(tipo == 'warning'){
		Swal.fire({
			title: titulo,
			text: mensaje,
			type: tipo,
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
	}else{
		Swal.fire({
			title: titulo,
			text: mensaje,
			type: tipo,
			confirmButtonText: 'Aceptar'
		});
	}
}



/************* Final ****************/
/********** Signup html *************/
/************************************/