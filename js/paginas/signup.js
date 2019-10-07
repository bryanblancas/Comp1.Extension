/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var nuevoUsuario = {
	username: '', 
	email: '', 
	contrasenia: '',
	ciudad: '',
	estado: '',
	localidad: '',
	codigoPostal: '',
	direccion: '',
	organizacionNombre: 'null',
	organizacionAbreviado: 'null',
	dominio: 'null'
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

/*$(document).ready(function() {
	chrome.storage.local.get(['cert'],function(result){
		if(result.cert != null){
			window.close();
		}
	});	
});*/

$(document).ready(function(){
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
		}else{
			//No existe un certificado
			$('#hrefSignup,#hrefSignin').attr('style','cursor:pointer');
		}
	});	
	
});

$('#btnBuscarCP').on('click', function() {
	//$('#selectColonia').html('<option value="0" selected>Sin Seleccionar</option>');
	//$('#selectColonia').prop('disabled','disabled');
	//$('#InputEstado,#InputMunicipio,#InputColonia,#InputCalle').prop('disabled','disabled');
	//$('#InputEstado,#InputMunicipio,#InputColonia,#InputCalle').val('Sin Seleccionar');
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'Localidades/obtenerDatos',
		dataType: 'json',
		data:{
			codigoPostalReq: $('#InputCP').val()
		},
		beforeSend: function(){
			console.log('Entro');
			$('#imgChWCertificado').attr('class','card-img-top mt-2 rotate');
		},
	}).done(function(datos){
		datos = datos.datos;
		console.log(datos);
		if(datos.estado.length != 0){
			$('#selectColonia, #InputCalle').removeAttr('disabled');
			$('#InputCalle').val('');
			$('#InputEstado').val(datos.estado);
			$('#InputMunicipio').val(datos.municipio);
			var colonias = datos.colonias;
			for(var i=0;i<colonias.length;i++){
				$('#selectColonia').append('<option value="'+colonias[i]+'">'+colonias[i]+'</option>');
			}
			$('#selectColonia').val(0);
			$('#selectColonia').trigger('change');
			$('#selectColonia option[value=0]').prop('disabled','disabled');
			$('#divLocalidad').attr('style','display:inline');
			$('#imgChWCertificado').attr('class','card-img-top mt-2');
		}else{
			$('#selectColonia').html('<option value="0" selected>Sin Seleccionar</option>');
			$('#selectColonia').prop('disabled','disabled');
			$('#InputEstado,#InputMunicipio,#InputColonia,#InputCalle').prop('disabled','disabled');
			$('#InputEstado,#InputMunicipio,#InputColonia,#InputCalle').val('Sin Seleccionar');
			$('#imgChWCertificado').attr('class','card-img-top mt-2');
			mostrarMensajeError('Código Postal invalido', 'Por favor ingrese un código postal valido');	
		}
	}).fail(function(xhr, status, error){
		$('#imgChWCertificado').attr('class','card-img-top mt-2');
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
});

$('#btnContinuar').click(function(){
	if(comprobarUserName($('#username').val()) == false){
		mostrarMensajeError('Nombre de usuario incorrecto','El formato del nombre de usuario no es valido');
	}
	else if(comprobarEmail($('#email').val()) == false){
		mostrarMensajeError('Email incorrecto','El formato de email no es valido');
	}
	else if(comprobarPassword($('#password').val()) == false){
		mostrarMensajeError('Contraseña incorrecta','El formato de la contraseña no es valido');
	}
	else if($('#password').val() != $('#passwordRepetir').val()){
		mostrarMensajeError('Contraseñas incorrectas','Las contraseñas introducidas no coinciden');
	}else{
		mostrarMensajeWarning('¿Desea continuar?','');
	}
});

$('#btnRegresar').click(function(){
	$('#usuario').attr('class','tab-pane fade show active');
	$('#certificado').attr('class','tab-pane fade');
	$('#imgMostrarOpAvanzadasArriba').click();
});

$('#btnSignup').click(function(){
	if($('#InputCP').val().length == 0){
		mostrarMensajeError('','Porfavor ingrese un código postal');
	}else if($('#InputEstado').val().length == 0){
		mostrarMensajeError('','Porfavor ingrese un Estado');
	}else if($('#InputMunicipio').val().length == 0){
		mostrarMensajeError('','Porfavor ingrese un Municipio');
	}else if($('#selectColonia').val() == null || $('#selectColonia').val() == 0){
		mostrarMensajeError('','Porfavor seleccione una Colonia');
	}else if($('#InputCalle').val().length == 0){
		mostrarMensajeError('','Porfavor ingrese una Calle y Número');
	}else{
		nuevoUsuario.username = $('#username').val();
		nuevoUsuario.email = $('#email').val();
		nuevoUsuario.contrasenia = $('#password').val();
		var hash = CryptoJS.SHA256($('#password').val()).toString();
		nuevoUsuario.contrasenia = hash;

		nuevoUsuario.ciudad = 'MX';
		nuevoUsuario.estado = $('#InputEstado').val();
		nuevoUsuario.localidad = $('#InputMunicipio').val();
		nuevoUsuario.codigoPostal = $('#InputCP').val();
		nuevoUsuario.direccion = $('#InputCalle').val() + ' ' + $('#selectColonia').val();

		if($('#organizacion').val().length != 0){
			nuevoUsuario.organizacionNombre = $('#organizacion').val();
		}
		if($('#organizacionAbrev').val().length != 0){
			nuevoUsuario.organizacionAbreviado = $('#organizacionAbrev').val();
		}
		if($('#dominio').val().length != 0){
			nuevoUsuario.dominio = $('#dominio').val();
		}

		mostrarMensajeConfirmacion('¿Desea continuar?','Se registrará usuario actual');
	}
});

function confirmarUsuario() {
	console.log(nuevoUsuario);
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'guardarUsuario',
		dataType: 'json',
		data: {
			'username': nuevoUsuario.username,
			'email': nuevoUsuario.email,
			'password': nuevoUsuario.contrasenia,
			'ciudad': nuevoUsuario.ciudad,
			'estado': nuevoUsuario.estado,
			'localidad': nuevoUsuario.localidad,
			'codigoPostal': nuevoUsuario.codigoPostal,
			'direccion': nuevoUsuario.direccion,
			'organizacionNombre': nuevoUsuario.organizacionNombre,
			'organizacionAbreviado': nuevoUsuario.organizacionAbreviado,
			'dominio': nuevoUsuario.dominio
		},
		beforeSend: function(){
			$('#imgChW').attr('class','card-img-top mt-2 rotate');
		},
	}).done(function(data){
		console.log(data);
		if(data.status == 0){
			$('#imgChW').attr('class','card-img-top mt-2');
			mostrarMensajeError('Usuario no registrado','Ya existe una cuenta asociada al correo: '+data.email);	
		}else{
			$('#imgChW').attr('class','card-img-top mt-2');
			//mostrarMensaje('Nuevo Usuario Creado', 'Email: '+data.email,'success');
			/*Se guarda en Storage*/
			//chrome.storage.local.set({cert: null});
			Swal.fire({
				title: 'Nuevo Usuario Registrado',
				text: "Se ha creado nuevo usuario con correo email: "+data.email,
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
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
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
			$('#matchPassword').html('Coinciden');
		}else{
			//$('#matchPassword').html('');
			$('#matchPassword').attr('style','color:red');
			$('#matchPassword').html('Diferentes');
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
			$('#matchPassword').html('Coinciden');
		}else{
			if($('#passwordRepetir').val() != ''){
				//$('#matchPassword').html('');
				$('#matchPassword').attr('style','color:red');
				$('#matchPassword').html('Diferentes');
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
			$('#usuario').attr('class','tab-pane fade');
			$('#certificado').attr('class','tab-pane fade show active');
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

$('#imgMostrarOpAvanzadasAbajo').click(function(){
	$('#OpcionesAvanzadas').removeAttr('style');
	$('#imgMostrarOpAvanzadasArriba').attr('class','col-md-1');
	$('#imgMostrarOpAvanzadasAbajo').attr('class','d-md-none');
});

$('#imgMostrarOpAvanzadasArriba').click(function(){
	$('#OpcionesAvanzadas').attr('style','display:none');
	$('#imgMostrarOpAvanzadasAbajo').attr('class','col-md-1');
	$('#imgMostrarOpAvanzadasArriba').attr('class','d-md-none');
});

/************* Final ****************/
/********** Signup html *************/
/************************************/