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
	organizacionNombre: 'Indefinido',
	organizacionAbreviado: 'Indefinido',
	dominio: 'indefinido.com'
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
	$('#selectPais,#selectEstado,#selectLocalidad,#selectCP,#selectDireccion').select2();
	$('#selectEstado,#selectLocalidad,#selectCP,#selectDireccion,#InputCalle').prop('disabled','disabled');
	$('#selectEstado,#selectLocalidad,#selectCP,#selectDireccion').html('<option value="0" selected>Sin Seleccionar</option>');

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

	cargarPais();
	
});

function cargarPais() {
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'Localidades/Pais',
		dataType: 'json',
	}).done(function(data){
		var datos = data.paises;
		var keys = Object.keys(datos);
		var valores = Object.values(datos);
		$('#selectPais').html('<option value="0" selected>Seleccione</option>');
		for(let i=0;i<keys.length;i++){
			$('#selectPais').append('<option value="'+keys[i]+'" selected>'+valores[i]+'</option>');
		}
		$('#selectPais').val(0);
		$('#selectPais option[value=0]').prop('disabled','disabled');
		$('#selectPais').trigger('change');
	}).fail(function(xhr, status, error){
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
}

$('#selectPais').on('change',function(){
	if($('#selectPais').val() == 0 || $('#selectPais').val() == null){}else{
		$('#selectEstado,#selectLocalidad,#selectCP,#selectDireccion').html('<option value="0" selected>Seleccione</option>');
		$('#selectEstado,#selectLocalidad,#selectCP,#selectDireccion').prop('disabled','disabled');
		$('#InputCalle').val('');
		cargarEstado();
	}
});

function cargarEstado() {
	$('#selectEstado').removeAttr('disabled');
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'Localidades/Estado',
		dataType: 'json',
		data:{
			pais: $('#selectPais').val()
		}
	}).done(function(data){
		var datos = data.estados;
		$('#selectEstado').html('<option value="0" selected>Seleccione</option>');
		for(let i=0;i<datos.length;i++){
			$('#selectEstado').append('<option value="'+datos[i]+'" selected>'+datos[i]+'</option>');
		}
		$('#selectEstado').val(0);
		$('#selectEstado').trigger('change');
		$('#selectEstado option[value=0]').prop('disabled','disabled');
	}).fail(function(xhr, status, error){
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
}

$('#selectEstado').on('change',function(){
	if($('#selectEstado').val() == 0 || $('#selectEstado').val() == null){}else{
		$('#selectLocalidad,#selectCP,#selectDireccion').html('<option value="0" selected>Seleccione</option>');
		$('#selectLocalidad,#selectCP,#selectDireccion').prop('disabled','disabled');
		$('#InputCalle').val('');
		cargarLocalidad();
	}
});

function cargarLocalidad() {
	$('#selectLocalidad').removeAttr('disabled');
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'Localidades/Localidad',
		dataType: 'json',
		data:{
			pais: $('#selectPais').val(),
			estado: $('#selectEstado').val()
		}
	}).done(function(data){
		var datos = data.localidades;
		$('#selectLocalidad').html('<option value="0" selected>Seleccione</option>');
		for(let i=0;i<datos.length;i++){
			$('#selectLocalidad').append('<option value="'+datos[i]+'" selected>'+datos[i]+'</option>');
		}
		$('#selectLocalidad').val(0);
		$('#selectLocalidad').trigger('change');
		$('#selectLocalidad option[value=0]').prop('disabled','disabled');
	}).fail(function(xhr, status, error){
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
}

$('#selectLocalidad').on('change',function(){
	if($('#selectLocalidad').val() == 0 || $('#selectLocalidad').val() == null){}else{
		$('#selectCP,#selectDireccion').html('<option value="0" selected>Seleccione</option>');
		$('#selectCP,#selectDireccion').prop('disabled','disabled');
		$('#InputCalle').val('');
		cargarCodigoPostal();
	}
});

function cargarCodigoPostal() {
	$('#selectCP').removeAttr('disabled');
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'Localidades/CodigoPostal',
		dataType: 'json',
		data:{
			pais: $('#selectPais').val(),
			estado: $('#selectEstado').val(),
			localidad: $('#selectLocalidad').val()
		}
	}).done(function(data){
		var datos = data.codigoPostal;
		$('#selectCP').html('<option value="0" selected>Seleccione</option>');
		for(let i=0;i<datos.length;i++){
			$('#selectCP').append('<option value="'+datos[i]+'" selected>'+datos[i]+'</option>');
		}
		$('#selectCP').val(0);
		$('#selectCP').trigger('change');
		$('#selectCP option[value=0]').prop('disabled','disabled');
	}).fail(function(xhr, status, error){
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
}

$('#selectCP').on('change',function(){
	if($('#selectCP').val() == 0 || $('#selectCP').val() == null){}else{
		$('#InputCalle').val('');
		cargarDireccion();
	}
});

function cargarDireccion() {
	$('#selectDireccion').removeAttr('disabled');
	$.ajax({
		type: 'POST',
		url: IP.getIP()+'Localidades/Direccion',
		dataType: 'json',
		data:{
			pais: $('#selectPais').val(),
			estado: $('#selectEstado').val(),
			localidad: $('#selectLocalidad').val(),
			cp: $('#selectCP').val()
		}
	}).done(function(data){
		var datos = data.direccion;
		$('#selectDireccion').html('<option value="0" selected>Seleccione</option>');
		$('#selectDireccion').append('<option value="'+datos+'" selected>'+datos+'</option>');
		$('#selectDireccion').val(datos);
		$('#selectDireccion').trigger('change');
		$('#selectDireccion option[value=0]').prop('disabled','disabled');
		$('#selectDireccion').prop('disabled','disabled');
	}).fail(function(xhr, status, error){
		mostrarMensajeError('Ah ocurrido un error', 'Por favor intentelo mas tarde');
	});
}

$('#selectDireccion').on('change',function(){
	if($('#selectDireccion').val() == 0 || $('#selectDireccion').val() == null){}else{
		$('#InputCalle').val('');
		$('#InputCalle').removeAttr('disabled');
	}
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
	if($('#selectPais').val() == null){
		mostrarMensajeError('','Porfavor seleccione una ciudad');
	}else if($('#selectEstado').val() == null){
		mostrarMensajeError('','Porfavor ingrese un estado');
	}else if($('#selectLocalidad').val() == null){
		mostrarMensajeError('','Porfavor ingrese una localidad');
	}else if($('#selectCP').val() == null){
		mostrarMensajeError('','Porfavor ingrese un código postal');
	}else if($('#selectDireccion').val() == null){
		mostrarMensajeError('','Porfavor ingrese una dirección');
	}else if($('#InputCalle').val().length == 0){
		mostrarMensajeError('','Porfavor ingrese una calle y numero');
	}else{
		nuevoUsuario.username = $('#username').val();
		nuevoUsuario.email = $('#email').val();
		nuevoUsuario.contrasenia = $('#password').val();
		var hash = CryptoJS.SHA256($('#password').val()).toString();
		nuevoUsuario.contrasenia = hash;

		nuevoUsuario.ciudad = $('#selectPais').val();
		nuevoUsuario.estado = $('#selectEstado').val();
		nuevoUsuario.localidad = $('#selectLocalidad').val();
		nuevoUsuario.codigoPostal = $('#selectCP').val();
		nuevoUsuario.direccion = $('#InputCalle').val() + ' ' +$('#selectDireccion').val();

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