// Variable que guarda el valor actual del botón "activar"
var btnActivar = true
var t0 = 0.0;
var t1 = 0.0;

// Función del API de Google Chrome que obtiene el valor guardado en el Storage
chrome.storage.local.get(['Activo'],function(result){
	if(result.Activo == null){
		btnActivar = true;
	}else{
		btnActivar = result.Activo;
	}	
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	// Función del API de Google Chrome que obtiene el valor guardado en el Storage
	chrome.storage.local.get(['Activo'],function(result){
		if(result.Activo == null){
			btnActivar = true;
		}else{
			btnActivar = result.Activo;
		}	
	});
});

// Funcion de la API de Google Chrome
// Se ejecuta en cuando los encabezados de la petición HTTP se han creado
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(headers){
		if (btnActivar == true){

			t0 = performance.now();	

			let httpheaders = headers.requestHeaders;
			let tipo = headers.type;

			if(tipo.includes("main_frame")){
				
				getCertificateFromStorage(headers);
				
				// Bloquear petición
				return {cancel: true};
			}
		}
	},
	{urls: ["*://192.168.43.21/login"]},
	["blocking", "requestHeaders"]
);


// Función que obtiene el certificado del Storage e inicia el proceso de software
function getCertificateFromStorage(headers) {
	
	let certificadoCharArray = [];

	chrome.storage.local.get(['cert'],function(result){
		
		if(result.cert != null){
			
			certificadoCharArray = result.cert
			// console.log(certificadoCharArray)
			chaffingProcess(certificadoCharArray, headers)

		}
		else
			alert("ERROR AL OBTENER CERTIFICADO DE STORAGE");

	});	
}


// Función que realiza el proceso de chaffing
function chaffingProcess(certificadoCharArray, headers) {
	
	//REMOVE ESPECIAL CHARACTERS 
	cert = []
	for(let i = 0; i < certificadoCharArray.length; i++){
		let code = certificadoCharArray.charCodeAt(i)
		if(!((code >= 0 && code <= 31) || code == 127))
			cert.push(certificadoCharArray[i])
	}

	let rtn = getPattern(550, 650);
	let pattern = rtn[0];
	let ones = rtn[1];

	let chaffing = makeChaffing(pattern, cert, ones);
	// console.log(chaffing);

	//Liberación de la petición
	freeRequest(headers, chaffing, pattern, cert.length);
}


// Function que retorna un patrón para el chaffing versión PROTOTIPO 2
function getPattern(low, high){
	let diff = high - low;
	let ones =  Math.floor(Math.random() * diff) + low; 
	let len_pattern = 150;
	let	size = len_pattern * 8;
	
	let pattern = []
	for(let i = 0; i < size; i++)
		pattern[i] = 0;

	let i = 0;
	while(i < ones){
	 	let x = getSecureRandomNumber() % size;
	 	if(pattern[x] == 1)
	 		continue;
	 	pattern[x] = 1;
	 	i++;
	}

	return [pattern, ones];
}


// Función que realiza el proceso de chaffing 
function makeChaffing(pattern, certificadoCharArray, ones){

	let len_cert = certificadoCharArray.length
	let len_pattern = pattern.length
	let rep = Math.ceil(len_cert/ones)

	let chaffing = []

	let cont_cert = 0
	let flag = true

	for(let i = 0; i < rep; i++){
		for(let cont_pattern = 0; cont_pattern < len_pattern; cont_pattern++){

			if(flag == false){
				chaffing.push(fakeChar())
				continue
			}

			if(pattern[cont_pattern] == 1){
				chaffing.push(certificadoCharArray[cont_cert])
				cont_cert++
				if(cont_cert >= len_cert)
					flag = false;
			}
			else
				chaffing.push(fakeChar())
		}
	}

	return chaffing
}


// Función que retorna un caracter / a-z A-Z 0-9
function fakeChar(){
	// /-9
	let char1 = Math.floor(Math.random() * 10) + 47;
	// A-Z
	let char2 = Math.floor(Math.random() * 25) + 65;
	// a-a
	let char3 = Math.floor(Math.random() * 25) + 97;

	let a = Math.floor(Math.random() * 3);

	switch(a){
		case 0:
			return String.fromCharCode(char1);
		case 1:
			return String.fromCharCode(char2);
		case 2:
			return String.fromCharCode(char3);
	}	
}


// Función que libera la nueva petición con el chaffing y pattern dados
function freeRequest(headers, chaffing, pattern, len_cert){

    const url = headers.url;
    chaffing = chaffing.join('');
    pattern = pattern.join('');

    pattern = arrayBytesToBites(pattern, 0);
    chaffing = chaffing+" "+len_cert;


    // CIFRADO DE PATRÓN
    var encrypt = new JSEncrypt();
	encrypt.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1fsvhHzUiUB20kciWsdCPf9gBiI6Z2cXnOH+VMkQtwXYhWyf0VXnV/cXGieXS5HvrZJvb0ldo8ZSqkaBy9BXrIAFswTgOxWfusa3nmL6YRzIHxI6FgpAt9xQAIKtnEWMShsufS/7FeR8Yam/u2qI2u+kM00ZPKQPOZPGQvEjy2QX88k/r88jP2a5UPzkSfg1vuAwMxGrVSuPcGrAUd2qJF6Slb1y6KvSo2KYLdnpv/us5MRKO+28u2QNr++uMIkyJz4Pqj67VUT2r1XThkdxAfPTgcRne15qQ2aDtlLqw8T6uo2xYNekZjuoUxenfxzikv3ejFgShT4bON6yzBtv0wIDAQAB");
	var pattern_encrypted = encrypt.encrypt(pattern); 



	//LIBERACIÓN DE LA PETICIÓN POR MEDIO DE AJAX 
	$.ajax({
		url: url,
		type: "GET",
		contentType: "text/plain;charset=UTF-8",
		datatype: 'text/plain',
		headers: {
			"Chaffing" : chaffing,
			"Pattern" : pattern_encrypted
		},
		success:function(result){
			console.log("ÉXITO AL ENVIAR PETICIÓN, IMPRIMIENDO RESPUESTA: ");
            console.log(result);
            t1 = performance.now();	
            console.log(" Chaffing: " + (t1 - t0) + " milliseconds.");
            window.open(result);
		},
		error:function(result){
			console.log("ERROR AL ENVIAR PETICIÓN, IMPRIMIENDO RESPUESTA: ");
			console.log(result);
		}
	})
}

function getSecureRandomNumber() {
    var array = new Uint16Array(10);
    window.crypto.getRandomValues(array);
    return array[Math.floor(Math.random() * 10)];
}

function arrayBytesToBites(array, patron){

	let charCreado = 0;
	let stringInBites = "";
	let count = 0;
	let i = 0;
	if(patron == true)
		i = 1


	for(i; i < array.length; i++){
		
		if(count == 8){
			////console.log("char creado: "+charCreado.toString(2)+"  "+charCreado);
			stringInBites += String.fromCharCode(charCreado);
			////console.log("estatus actual patrón: "+stringInBites);
			charCreado = 0;
			count = 0;
		}

		charCreado = charCreado << 1;
		if(array[i] == '1')
			charCreado = charCreado | 1; 
		count ++;
	}
	stringInBites += String.fromCharCode(charCreado);

	return stringInBites;
}
