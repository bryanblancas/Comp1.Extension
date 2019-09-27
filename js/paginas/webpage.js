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
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			//Existe un certificado
			$('#hrefSignup,#hrefSignin,#revocarCertificadoDiv').attr('style','display:none');
			$('#login,#email,#password').attr('disabled','disabled');
		}else{
			//No existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','cursor:pointer');
		}
	});	
});

function quitarEncabezadosCertificado(certificado) {
	crt = certificado.split('-----BEGIN CERTIFICATE-----')[1];
	crt = crt.split('-----END CERTIFICATE-----')[0];
	return crt;
}

$('#login').click(function(){	
	if(comprobarEmail($('#email').val()) == false){
		mostrarMensajeError('Email incorrecto','El formato de email no es valido');
	}
	else if(comprobarPassword($('#password').val()) == false){
		mostrarMensajeError('Contraseña incorrecta','El formato de la contraseña no es valido');
	}
	else{
		usuarioLogin.email = $('#email').val();
		//usuarioLogin.contrasenia = $('#password').val();
		var hash = CryptoJS.SHA256($('#password').val()).toString();
		usuarioLogin.contrasenia = hash;
		//console.log(usuarioLogin);

		//window.open('https://10.133.166.28:3000/api/obtenerCertificado');

		$.ajax({
			type: 'POST',
			url: IP.getIP()+'obtenerCertificadoUsuario',
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
					mostrarMensajeError('Usuario no encontrado','El usuario: '+usuarioLogin.email+' no existe');
				}else{
					crt = quitarEncabezadosCertificado(data.certificado);
					/*Se guarda en Storage*/
					chrome.storage.local.set({cert: crt});
					chrome.storage.local.get(['cert'],function(result){
						if(result.cert != null){
							$('#imgChW').attr('class','card-img-top mt-2');
							mostrarMensajeSuccess('Certificado obtenido','El certificado ha sido guardado en el Storage de Google Chrome');
							console.log(result.cert);
						}else{
							$('#imgChW').attr('class','card-img-top mt-2');
							mostrarMensajeError('Certificado no obtenido','El certificado no ha sido guardado en el Storage de Google Chrome');
						}
					});
				}
			},
			error: function(){
				/*$.ajax({
					type: 'POST',
					url: IP+'obtenerCertificado',
					dataType: 'json',
					async: false,
					data: {
						'email': usuarioLogin.email,
						'password': usuarioLogin.contrasenia
					}
				});*/
				//window.open('https://10.133.166.28:3000/api/obtenerCertificado?email='+usuarioLogin.email+'&password='+usuarioLogin.contrasenia);
				$('#imgChW').attr('class','card-img-top mt-2');
				mostrarMensajeError('Ha ocurrido un problema','Por favor, intentelo mas tarde');
			}
		});
		/*
		$.ajax({
			type:'GET',
			url: IP+'aceptarCertificado',
			dataType: 'json',
			success: function(data){
				if(data.status == 1){
				}
			},
			error: function (ajaxContext) {
				window.open('https://10.133.166.28:3000/api/obtenerCertificado');
			}
		});/*.done(function(data){
			if(data.status == 1){
				/*$.ajax({
					type: 'POST',
					url: IP+'obtenerCertificado',
					dataType: 'json',
					async: false,
					data: {
						'email': usuarioLogin.email,
						'password': usuarioLogin.contrasenia
					},
					beforeSend: function(){
						$('#imgChW').attr('class','card-img-top mt-2 rotate');
					},
				}).done(function(data){
					if(data.status == 0){
						$('#imgChW').attr('class','card-img-top mt-2');
						mostrarMensaje('Usuario no valido','','error');
					}else{
						chrome.storage.local.set({cert: data});
						chrome.storage.local.get(['cert'],function(result){
							if(result.cert != null){
								$('#imgChW').attr('class','card-img-top mt-2');
								mostrarMensaje('Certificado obtenido','El certificado ha sido guardado en el Storage de Google Chrome','success');
							}else{
								$('#imgChW').attr('class','card-img-top mt-2');
								mostrarMensaje('Certificado no obtenido','El certificado no ha sido guardado en el Storage de Google Chrome','error');
							}
						});
					}
				}).fail(function(data){
					console.log(data);
					$('#imgChW').attr('class','card-img-top mt-2');
					mostrarMensaje('Usuario no valido','Por favor, verificar email y/o contraseña','error');
				});
			}
		});*/
	}
});

$('#password').keyup(function(event){
	if (event.keyCode === 13) {
		$('#login').click();
	}else if($('#password').val().length == 0){
		$('#password').removeAttr('type');
		$('#password').attr('type','password');
	}else if($('#password').val() == '' || $('#passwordRepetir').val() == ''){
		$('#matchPassword').html('');
	}else{
		if($('#passwordRepetir').val() == $('#password').val()){
			//$('#matchPassword').html('');
			$('#matchPassword').attr('style','color:green');
			$('#matchPassword').html('Coinciden');
		}else{
			if($('#passwordRepetir').val() != ''){
				//$('#matchPassword').html('');
				$('#matchPassword').attr('style','color:red');
				$('#matchPassword').html('Diferente');
			}
		}
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
	if($('#password').val().length == 0){
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
			confirmarUsuario();
		}
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

	//alert("Entro a revocar certificado");
	/*Swal.mixin({
		progressSteps: ['1', '2']
	}).queue([{
		title: 'Email',
		text: 'Por favor, introduzca su email con el que se registró',
		input: 'text',
		confirmButtonText: 'Siguiente &rarr;',
		showCancelButton: true
	},
	{
		title: 'Contraseña',
		text: 'Por favor, introduzca su contraseña',
		input: 'password',
		confirmButtonText: 'Aceptar',
		showCancelButton: true,
		preConfirm: (pass) => {
			var hash = CryptoJS.SHA256(pass).toString();
			return hash;
		}
	}]).then((result) => {
		console.log(result.value);
		result = result.value;
		if(result[0].length > 0 && result[1].length > 0){
			/*Peticion ajax con email y contraseña*/

			/*Swal.fire({
				type: 'success',
				title: 'Se ha revocado su certificado!',
				text: 'Porfavor, inicie sesión de nuevo para obtener el certificado actual',
				confirmButtonText: 'Iniciar Sesión',
				preConfirm: ()=>{
					$('#hrefSignin').click();
				}
			});
		}else{
			Swal.fire({
				type: 'error',
				title: 'Usuario y/o contraseña no validos',
				text: 'Porfavor ingrese email y/o contraseña validos'
			});
		}
	})*/
});

$('#pPassOlvidado').click(() => {
	//alert("Entro a olvidar contraseña");
});


/************* Final ****************/
/********** Login html *************/
/************************************/










/*$('.toggle').click(function(){
    $('.formulario').animate({
        height: "toggle",
        'padding-top': 'toggle',
        'padding-bottom': 'toggle',
        opacity: 'toggle'
    }, "slow");
});*/

/*onChangeEvent = () => {
		let inputValue = $('#prueba').val
		if(!inputValue){
			$('#error').addClass('Tu clase de error d-block')
		} else {
			$('#error').addClass('Tu clase de para no visualizarlo d-none')
		}
}*/

/*var regexuser = /^[A-Za-z0-9_]+$/
var regexpass = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d_@#?/]+$/

//Iniciar Sesion
$("#iniciarSesion").click(function(e) {
    let userSesion = document.getElementById('username').value;
	let passwordSesion = document.getElementById('password').value;
	
	//console.log(regexpass.test(passwordSesion));
	if( userSesion == null || userSesion.length < 3 || userSesion.length > 20 ) {
		alert("La longitud del Usuario es incorrecta.");
	}else
	if( passwordSesion == null || passwordSesion.length < 8 || passwordSesion.length > 16 ) {
		alert("La longitud de la contraseña es incorrecta.");
  	}else
	if(!regexuser.test(userSesion) || !regexpass.test(passwordSesion)){
		alert("El formato del Usuario o la contraseña es incorrecto.");		
	}else{
		let hash = CryptoJS.SHA1(userSesion+passwordSesion);*/
		/*****Se sube a Storage*****/
		/*chrome.storage.local.set({cert: hash.toString()});
		chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			console.log(result.cert);
			alert("Certificado guardado en Storage");
		}else{
			console.log("No se pudo guardar el certificado en el Storage");
		}
		});
	}
	/***************/
/*});*/