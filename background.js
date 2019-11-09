// Variable que guarda el valor actual del botón "activar"
var btnActivar = "";


// Funcion de la API de Google Chrome
// Se ejecuta en cuando los encabezados de la petición HTTP se han creado
chrome.webRequest.onBeforeSendHeaders.addListener(
	
	function(headers){

		// Función del API de Google Chrome que obtiene el valor guardado en el Storage
		chrome.storage.local.get(['Activo'],function(result){
			if(result.Activo == null){
				btnActivar = true;
			}else{
				btnActivar = result.Activo;
			}
		});

		// En caso de que el botón esté activo, se obtienen los datos del encabezado HTTP
		// de la petición creada por el usuario
		if (btnActivar == true){
			let httpheaders = headers.requestHeaders;
			let tipo = headers.type;

			// Filtro para sólo obtener la petición tipo "main_frame"
			if(tipo.includes("main_frame")){
				
				getCertificateFromStorage(headers);
				
				// Bloquear petición
				return {cancel: true};
			}
		}
	},
	{urls: ["*://10.0.0.8/login"]},
	["blocking", "requestHeaders"]
);


// Función que obtiene el certificado del Storage e inicia el proceso de software
function getCertificateFromStorage(headers) {
	
	let certificadoCharArray = [];

	// Función del API de Google Chrome que obtiene el valor guardado en el Storage
	chrome.storage.local.get(['cert'],function(result){
		
		if(result.cert != null){
			
			certificadoCharArray = result.cert;
				
			chaffingProcess(certificadoCharArray, headers);

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
	// console.log(pattern)
	// console.log(ones)

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

	// pattern = [0,1,0,1]
	// certificadoCharArray = ['a', 'b', '\n']
	// ones = 2

	let len_cert = certificadoCharArray.length
	let len_pattern = pattern.length
	let rep = Math.ceil(len_cert/ones)

	console.log("IMPRESIONES DE makeChaffing()")
	console.log("Longitud pattern: "+len_pattern)
	console.log("Longitud certificado: "+len_cert)
	console.log("Número de unos: "+ones)
	console.log("Repeticiones de patrón: "+len_cert+"/"+ones+"="+rep)

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
	console.log("IMPRESIONES DE freeRequest()")

    const url = headers.url;
    chaffing = chaffing.join('');
    pattern = pattern.join('');
	console.log("PATTERN BITS: \n"+pattern)

    // pattern = text 
    // pattern = "01110100011001010111100001110100"
    // pattern = "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    pattern = arrayBytesToBites(pattern, 0);
    console.log("PATTERN BYTES LENGTH: "+pattern.length)
    chaffing = chaffing+" "+len_cert;


    // CIFRADO DE PATRÓN
    var encrypt = new JSEncrypt();
	encrypt.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1fsvhHzUiUB20kciWsdCPf9gBiI6Z2cXnOH+VMkQtwXYhWyf0VXnV/cXGieXS5HvrZJvb0ldo8ZSqkaBy9BXrIAFswTgOxWfusa3nmL6YRzIHxI6FgpAt9xQAIKtnEWMShsufS/7FeR8Yam/u2qI2u+kM00ZPKQPOZPGQvEjy2QX88k/r88jP2a5UPzkSfg1vuAwMxGrVSuPcGrAUd2qJF6Slb1y6KvSo2KYLdnpv/us5MRKO+28u2QNr++uMIkyJz4Pqj67VUT2r1XThkdxAfPTgcRne15qQ2aDtlLqw8T6uo2xYNekZjuoUxenfxzikv3ejFgShT4bON6yzBtv0wIDAQAB");
	var pattern_encrypted = encrypt.encrypt(pattern); 


    console.log("DIRECCIÓN: \n"+url)
    console.log("CHAFFING: \n"+chaffing)
    console.log("CHAFFING LENGTH: \n"+chaffing.length)
    // console.log("PATTERN: \n"+pattern)
    console.log("PATTERN ENCRYPTED: \n"+pattern_encrypted)


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
            window.open(result);
		},
		error:function(result){
			console.log("ERROR AL ENVIAR PETICIÓN, IMPRIMIENDO RESPUESTA: ");
			console.log(result);
		}
	})
}


// Función que retorna un número aleatorio seguro (SecureRandom)
// RandomSourse.getRandomValues()
// Utiliza un arraglo que puede ser Int8Array, Uint8Array, 
// Int16Array, Uint16Array, Int32Array o Uint32Array
// Todos los elementos del array son escritos con números aleatorios seguros
// Se utiliza un random normal para elegir la posición del número aleatorio a retornar
function getSecureRandomNumber() {
    var array = new Uint16Array(10);
    window.crypto.getRandomValues(array);
    return array[Math.floor(Math.random() * 10)];
}


// Función que pasa una cadena de 0 y 1 que representan bites a bytes
// "00101111" -> "/"
function arrayBytesToBites(array, patron){
	//PASAR EL ARREGLOS DE BYTES A BITES   -> 1 BYTE -> 1 BITE
	/********************************************
	*											*
			EJEMPLO DE PATRÓN:
		Array 		= 	"0010111101010010"
		patronBytes_2 		= 	'00101111','10101000'
		patronBytes_10 		= 	'0x2F = 47','0x52 = 82'
		stringInBites 		= 		"R/"

	*											*
	********************************************/

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

	//ÚLTIMO CHAR CREADO
	////console.log("char creado: "+charCreado.toString(2)+"   "+charCreado);
	stringInBites += String.fromCharCode(charCreado);
	////console.log("----> "+stringInBites+" "+stringInBites.length);

	return stringInBites;
}