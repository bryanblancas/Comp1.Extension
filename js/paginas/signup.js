/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var nuevoUsuario = {username: '', email: '', contrasenia: ''};
var IP = 'https://25.7.11.142:3000/api/';

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

$('#btnSignup').click(function(){
	if(comprobarUserName($('#username').val()) == false){
		mostrarMensaje('Nombre de usuario incorrecto','El formato del nombre de usuario no es valido','error');
	}
	else if(comprobarEmail($('#email').val()) == false){
		mostrarMensaje('Email incorrecto','El formato de email no es valido','error');
	}
	else if(comprobarPassword($('#password').val()) == false){
		mostrarMensaje('Contraseña incorrecta','El formato de la contraseña no es valido','error');
	}
	else if($('#password').val() != $('#passwordRepetir').val()){
		mostrarMensaje('Contraseñas no validas','Las contraseñas introducidas no coinciden','error');
	}else{
		nuevoUsuario.username = $('#username').val();
		nuevoUsuario.email = $('#email').val();
		nuevoUsuario.contrasenia = $('#password').val();
		var hash = CryptoJS.SHA256($('#password').val()).toString();
		nuevoUsuario.contrasenia = hash;
		mostrarMensaje('¿Está seguro?','Se registrará usuario actual','warning');
	}
});

function confirmarUsuario() {
	console.log(nuevoUsuario);
	$.ajax({
		type: 'POST',
		url: IP+'guardarUsuario',
		dataType: 'json',
		data: {
			'username': nuevoUsuario.username,
			'email': nuevoUsuario.email,
			'password': nuevoUsuario.contrasenia
		},
		beforeSend: function(){
			$('#imgChW').attr('class','card-img-top mt-2 rotate');
		},
	}).done(function(data){
		console.log(data);
		if(data.status == 0){
			$('#imgChW').attr('class','card-img-top mt-2');
			mostrarMensaje('Usuario no creado',data.email,'error');	
		}else{
			$('#imgChW').attr('class','card-img-top mt-2');
			//mostrarMensaje('Nuevo Usuario Creado', 'Email: '+data.email,'success');
			/*Se guarda en Storage*/
			//chrome.storage.local.set({cert: null});
			Swal.fire({
				title: 'Nuevo Usuario Creado',
				text: "Email: "+data.email,
				type: 'success',
				confirmButtonColor: '#3085d6',				
				confirmButtonText: 'Iniciar Sesión'
			  }).then((result) => {
				if (result.value) {
					$('#hrefSignin').click();
				}
			  })
		}
	}).fail(function(xhr, status, error){
		$('#imgChW').attr('class','card-img-top mt-2');
		mostrarMensaje('Ah ocurrido un error', 'Por favor intentelo mas tarde','error');
	});
}

$('#passwordRepetir').keyup(function(){
	if($('#passwordRepetir').val().length == 0){
		$('#passwordRepetir').removeAttr('type');
		$('#passwordRepetir').attr('type','password');
	}else if($('#password').val() == '' || $('#passwordRepetir').val() == ''){
		$('#matchPassword').html('');
	}else{
		if($('#passwordRepetir').val() == $('#password').val()){
			//$('#matchPassword').html('');
			$('#matchPassword').attr('style','color:green');
			$('#matchPassword').html('Match');
		}else{
			//$('#matchPassword').html('');
			$('#matchPassword').attr('style','color:red');
			$('#matchPassword').html('Diferente');
		}
	}
});

$('#password').keyup(function(){
	if($('#password').val().length == 0){
		$('#password').removeAttr('type');
		$('#password').attr('type','password');
	}else if($('#password').val() == '' || $('#passwordRepetir').val() == ''){
		$('#matchPassword').html('');
	}else{
		if($('#passwordRepetir').val() == $('#password').val()){
			//$('#matchPassword').html('');
			$('#matchPassword').attr('style','color:green');
			$('#matchPassword').html('Match');
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

$('#imgEyeRepetir').click(function(){
	if($('#passwordRepetir').attr('type') == 'password' && $('#passwordRepetir').val().length > 0){
		$('#passwordRepetir').removeAttr('type');
		$('#passwordRepetir').attr('type','text');
	}else{
		$('#passwordRepetir').removeAttr('type');
		$('#passwordRepetir').attr('type','password');
	}
});

$('#username').keyup(function(){
	if($('#username').val().length == 0){
		$('#regexUsername').html('');
	}else{
		if(comprobarUserName($('#username').val())){
			$('#regexUsername').attr('style','color:green');
			$('#regexUsername').html('Correcto');
		}else{
			$('#regexUsername').attr('style','color:red');
			$('#regexUsername').html('Incorrecto');
		}
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