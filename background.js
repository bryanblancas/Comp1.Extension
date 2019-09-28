//console.log("Background");


// Variable que guarda el valor actual del botón "activar"
var btnActivar = "";


// Funcion de la API de Google Chrome
// Se ejecuta en cuando los encabezados de la petición HTTP se han creado
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details){
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
			let detailsComplete = details;
			let requestid = details.requestId;
			let method = details.method;
			let frameid = details.frameId;
			let parentframeid = details.parentFrameId;
			let tabid = details.tabId;
			let initiator = details.initiator;
			let timestamp = details.timeStamp;
			let url = details.url;
			let httpheaders = details.requestHeaders;
			let tipo = details.type;

			// Filtro para sólo obtener la petición tipo "main_frame"
			if(tipo.includes("main_frame")){
				
				let cabeceraInyectar = "";

				for(let i = 0; i < httpheaders.length; i++){
					if(httpheaders[i].name.includes("Accept")){
						cabeceraInyectar = httpheaders[i].value;
					}
				}
				
				//console.log("ENCABEZADO A MODIFICAR: \n"+cabeceraInyectar);
				getCertificateFromStorage(cabeceraInyectar, detailsComplete);
				
				// Bloquear petición
				return {cancel: true};
			}
		}
		},
	{urls: ["*://localhost/login"]},
	["blocking", "requestHeaders"]
);


// Función que obtiene el certificado del Storage e inicia el proceso de software
function getCertificateFromStorage(cabeceraInyectar, details) {
	
	let certificadoCharArray = [];

	// Función del API de Google Chrome que obtiene el valor guardado en el Storage
	chrome.storage.local.get(['cert'],function(result){
		
		if(result.cert != null){
			
			certificadoCharArray = result.cert;
			//console.log("CERTIFICADO: \n"+certificadoCharArray);

			chaffingProcess(certificadoCharArray, cabeceraInyectar, details);
		}

	});	
}


// Función que realiza el proceso de chaffing
function chaffingProcess(certificadoCharArray, cabeceraInyectar, details) {

	//let patternChaffing = getPattern(certificadoCharArray.length , cabeceraInyectar.length);
	//certificadoCharArray = "5";
	//cabeceraInyectar = "t";
	let patternChaffing = getPatternBite(certificadoCharArray.length , cabeceraInyectar.length);

	// newHeader: objeto que contendrá la nueva cabecera a mandar
	// incluye el patrón de chaffing y el chaffing al header
	// USER-AGENT está en posición 3
	// PATTERN está en posición 4
	//let newHeader = makeChaffing(patternChaffing,certificadoCharArray,cabeceraInyectar,details);
	let newHeader = makeChaffingBite(patternChaffing,certificadoCharArray,cabeceraInyectar,details);
	//console.log("NUEVA PETICIÓN HTTP: ");
	//console.log(newHeader);

	//Liberación de la petición
	setFreeRequest(newHeader);
}


// Función que crea el patrón aleatoriamente, cuya longitud es la longitud 
// del certificado más la longitud de la cabecera a inyectar por ocho puesto que es bite a bite 
function getPatternBite(LenCertificadoCharArray, LenCabeceraInyectar){

	let lengthPc = (LenCabeceraInyectar+LenCertificadoCharArray)*8;
	
	// pcArray: contiene el patrón de chaffing 
	// pcArray [byteControl, biteChaff, biteChaff, ..., biteChaff]
	// 0 -> Bite Chaff : 1 -> Bite Original

	let pcArray = new Array(lengthPc);
	pcArray.fill(1,0,lengthPc);
	
	let n_0 = 0;
	while(n_0 < LenCertificadoCharArray*8){

		let random = getSecureRandomNumber() % lengthPc; // valores [0,lengthPc)
		//random++; // Evitamos posición 0
		if(pcArray[random] == 1){
			pcArray[random] = 0;
			n_0++;
		}

	}

/*
	console.log("Número de ceros en pattern: "+n_0-1);
	console.log("PATRÓN CREADO EN BITES: "+pcArray.join("")+" "+pcArray.length);
*/

	return pcArray;
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


// Función que realiza el chaffing con base a el patrón (patternChaffing)
// si hay un 0 en el patrón, se coloca un carácter del certificado
// si hay un 1 en el patrón, se coloca un carácter de la cabecera 
function makeChaffingBite(patternChaffing, certArray, cabeceraInyectar, details){
	
	// stringChaffingCertificado : almacenará el chaffing entre el encabezado Accept y el Certificado
	let stringChaffingCertificado = "";
	let stringCabeceraInyectar = stringToBinaryString(cabeceraInyectar);
	let stringCertArray = stringToBinaryString(certArray);

	let contPcCharTot = 0; 		// 	contador de Certificado + Encabezado
	let contCertificado = 0; 	// 	contador para certificado
	let contEncabezado = 0; 	// 	contador para encabezado Mozilla
	
	while(contPcCharTot < patternChaffing.length){
		if(patternChaffing[contPcCharTot] == 0)
			stringChaffingCertificado += stringCertArray[contCertificado++]
			//arrayChaffingCertificado[contPcCharTot] =  certArray[contCertificado++];
		else
			stringChaffingCertificado += stringCabeceraInyectar[contEncabezado++];
		contPcCharTot++;
	}

	console.log("CHAFFING CREADO EN BITES: "+stringChaffingCertificado+ "   "+stringChaffingCertificado.length);

	let stringBytesChaffingCertificado = arrayBytesToBites(stringChaffingCertificado, false);
	console.log("CHAFFING CON CARACTERES ESPECIALES: "+stringBytesChaffingCertificado+" "+stringBytesChaffingCertificado.length);
	
	//PASAR A BASE64 EL CHAFFING
	stringBytesChaffingCertificado = base64_encode(stringBytesChaffingCertificado);
	console.log("CHAFFING EN BYTES (BASE64): " + stringBytesChaffingCertificado + " " + stringBytesChaffingCertificado.length);

	//SE AGREGA UN NUEVO HEADER
	details.requestHeaders.push({name:"Chaffing",value: stringBytesChaffingCertificado});

	console.log("PATRON CREADO EN BITES: "+patternChaffing.join('')+ "  "+patternChaffing.length);
	let patroninBytes = arrayBytesToBites(patternChaffing, false);
	console.log("PATRON CREADO CON CARACTERES ESPECIALES: "+patroninBytes+"   "+patroninBytes.length);
	
	var key = "chiale";

	patroninBytes_aes = CryptoJS.AES.encrypt(patroninBytes, key);
	patroninBytes = patroninBytes_aes.toString()
	console.log("PATRON CIFRADO CON AES: "+patroninBytes+"   "+patroninBytes.length);

	var encrypt = new JSEncrypt();
	encrypt.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0oTD7GPsZozeTjvVmMfQhb7R1xdxyagFV4VENIkVFctz+OXddZPJiEpIQwS5ATb4VWSiNqXL/nZBkMuHGRL9DJRg6Qpg/wDwwmzHnmuIHNCMRk98xY+kEvdGNZ4WszLDnp759DcVIeZ9tYKgBcA/0d6g8Ao0gNFdyo1Y1V7v4MRbOVOIVoscZuhrNl7sBM0BB1b4tBYCKtP/Vexo6XMzynMwMsDeZYxES2XsM+fFcTbKVqSP5EQqFBwWpyuyD8WNDmjRYdYLmev9/54tOhKx5+MHU+CJezJ0m1vv683EaTUSSYLC3Guqh7P21w4DZ/2KivwssMWmfWLhJAzpEQ15swIDAQAB");
	var encrypted = encrypt.encrypt(key);

	patroninBytes += " ";
	patroninBytes += encrypted.toString();

	/*
		POR EL MOMENTO CODIFICADO EN BASE 64 PARA PODER MANDARLO EN RED
		MÁS ADELANTE ESTO SE TENDRÍA QUE CAMBIAR A IMPLEMENTAR EL CIFRADO ASIMÉTRICO
	
	patroninBytes = base64_encode(patroninBytes);
	console.log("PATRÓN CREADO (BASE64): "+patroninBytes+ "  "+patroninBytes.length);
	*/


	//SE AGREGA UN NUEVO HEADER DE PATTERN
	details.requestHeaders.push({name:"Pattern",value: patroninBytes});

	return details;
}

// Función que retorna una cadena de caracteres 0 y 1
// String = "text"
// Return = "0110100011001010111100001110100"
function stringToBinaryString(string){
	let i = 0;
	let binaryString = ""
	for(i; i < string.length; i++)
		binaryString += charToBinaryString(string[i]);
	return binaryString;
}


// Funcion que retorna una cadena de 0 y 1
// Char = "t"
// Return = "01110100"
function charToBinaryString(char){
	let num = char.charCodeAt(0);
	return intToBinaryString(num);
}


//Function que retorna una cadena de 0 y 1
// int = 0x74
// Return = "01110100"
function intToBinaryString(int){
	let mask = 0x80;
	let string = "";
	while(mask > 0){
		if((int & mask) != 0)
			string += '1';
		else
			string += '0';
		mask = mask >> 1;
	}

	return string;
}


// Función que libera la nueva petición (newHeader)
function setFreeRequest(newHeader){
	var pattern = "";
    var chaff = "";
    const url = newHeader.url;

    for(i = 0; i < newHeader.requestHeaders.length; i++){
        if(newHeader.requestHeaders[i].name.includes("Chaffing")){
            chaff = newHeader.requestHeaders[i].value;
            break;
        }
    }

    for(i = 0; i < newHeader.requestHeaders.length; i++){
        if(newHeader.requestHeaders[i].name.includes("Pattern")){
            pattern = newHeader.requestHeaders[i].value;
            break;
        }
    }

    console.log(newHeader);

	//Liberación de la petición por medio de AJAX 
	$.ajax({
		url: url,
		type: "GET",
		contentType: "text/plain;charset=UTF-8",
		datatype: 'text/plain',
		headers: {
			"Chaffing" : chaff,
			"Pattern" : pattern
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


// Función que modifica todos los caracteres ilegales de una cadena por otros legales
// Un carácter ilegal es aquel cuyo valor ascii es [0,31] U [127]
function transformIllegalCharacters(array){
	let string = array.join("");
	let newString = "";
	let numBytes = (string.length) / 8;
	let i = 0;
	let substring;
	let status;

	for(i; i < numBytes; i++){
		substring = string.substring(i*8,(i+1)*8);
		////console.log("analizando: "+substring);
		newString += analyzeSubstring(substring);
	}
	////console.log("Nuevo patrón : "+newString);
	return newString.split("");
}

// Función que devuelve un substring legal
function analyzeSubstring(string){
	let num = 0;
	let stringArray = string.split("");
	let lastIndexOfOne = 0;
	let i = 0;

	for(i = 0; i < 8; i++){
		num = num << 1;
		if(string[i] == '1'){
			num = num | 1;
			lastIndexOfOne = i;
		}
	}
	// 31 = 0001 1111
	// 127 = 0111 1111
	if((num >= 0 && num <=31) | num == 127) {
		stringArray[lastIndexOfOne] = '0';
		stringArray[0] = '1';
	}

	return stringArray.join("");
}

function base64_encode (s)
{
  // the result/encoded string, the padding string, and the pad count
  var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var r = ""; 
  var p = ""; 
  var c = s.length % 3;

  // add a right zero pad to make this string a multiple of 3 characters
  if (c > 0) { 
    for (; c < 3; c++) { 
      p += '='; 
      s += "\0"; 
    } 
  }

  // increment over the length of the string, three characters at a time
  for (c = 0; c < s.length; c += 3) {

    // we add newlines after every 76 output characters, according to the MIME specs
    /*if (c > 0 && (c / 3 * 4) % 76 == 0) { 
      r += "\r\n"; 
    }*/

    // these three 8-bit (ASCII) characters become one 24-bit number
    var n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c+1) << 8) + s.charCodeAt(c+2);

    // this 24-bit number gets separated into four 6-bit numbers
    n = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];

    // those four 6-bit numbers are used as indices into the base64 character list
    r += base64chars[n[0]] + base64chars[n[1]] + base64chars[n[2]] + base64chars[n[3]];
  }
   // add the actual padding string, after removing the zero pad
  return r.substring(0, r.length - p.length) + p;
}