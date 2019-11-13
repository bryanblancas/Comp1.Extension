/***************************************/
/****** Inicio Variables globales ******/
/***************************************/

var IP = new IPClase();

/***************************************/
/******* Final Variables globales ******/
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
			$('#btnSignin,#email,#password').attr('disabled','disabled');
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

$('.cerrarVentana').click(function(){
	window.close();
});

$('#btnAceptarAviso').click(function(){
    window.close();
    window.open(IP.getIP()+'Aviso');
});

/************* Final ****************/
/********** Signup html *************/
/************************************/