/*
encoding_table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                    'w', 'x', 'y', 'z', '0', '1', '2', '3',
                    '4', '5', '6', '7', '8', '9', '+', '/'];

decoding_table = null;
mod_table = [0, 2, 1];


function build_decoding_table() {
    for (i = 0; i < 64; i++)
        decoding_table[encoding_table[i]] = i;
}

function base64_cleanup() {
    free(decoding_table);
}

function base64_encode(data, input_length, output_length) {
 
    output_length = 4 * ((input_length + 2) / 3);

    let encoded_data = [];
 
    for (i = 0, j = 0; i < input_length;) {
 
        octet_a = i < input_length ? data[i++] : 0;
        octet_b = i < input_length ? data[i++] : 0;
        octet_c = i < input_length ? data[i++] : 0;
 
        triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;
 
        encoded_data[j++] = encoding_table[(triple >> 3 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 2 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 1 * 6) & 0x3F];
        encoded_data[j++] = encoding_table[(triple >> 0 * 6) & 0x3F];
    }
 
    for (i = 0; i < mod_table[input_length % 3]; i++)
        encoded_data[output_length - 1 - i] = '=';
 
    return encoded_data;
}*/

/*
function base64_encode(data){
	tbl = [
        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P',
        'Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f',
        'g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v',
        'w','x','y','z','0','1','2','3','4','5','6','7','8','9','+','/' ];

    buffer = [];
    pad = 0;
    for (i = 0; i < data.length; i += 3) {

        b = ((data[i] & 0xFF) << 16) & 0xFFFFFF;
        if (i + 1 < data.length) {
            b |= (data[i+1] & 0xFF) << 8;
        } else {
            pad++;
        }
        if (i + 2 < data.length) {
            b |= (data[i+2] & 0xFF);
        } else {
            pad++;
        }

        for (j = 0; j < 4 - pad; j++) {
            c = (b & 0xFC0000) >> 18;
            buffer.push(tbl[c]);
            b <<= 6;
        }
    }
    for (j = 0; j < pad; j++) {
        buffer.push("=");
    }

    return buffer;
}
*/

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
    if (c > 0 && (c / 3 * 4) % 76 == 0) { 
      r += "\r\n"; 
    }

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


function base64_decode (s)
{
  var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var base64inv = []; 
	for (var i = 0; i < base64chars.length; i++) 
	{ 
	  base64inv[base64chars[i]] = i; 
	}
  // remove/ignore any characters not in the base64 characters list
  //  or the pad character -- particularly newlines
  s = s.replace(new RegExp('[^'+base64chars.split("")+'=]', 'g'), "");

  // replace any incoming padding with a zero pad (the 'A' character is zero)
  var p = (s.charAt(s.length-1) == '=' ? 
          (s.charAt(s.length-2) == '=' ? 'AA' : 'A') : ""); 
  var r = ""; 
  s = s.substr(0, s.length - p.length) + p;

  // increment over the length of this encoded string, four characters at a time
  for (var c = 0; c < s.length; c += 4) {

    // each of these four characters represents a 6-bit index in the base64 characters list
    //  which, when concatenated, will give the 24-bit number for the original 3 characters
    var n = (base64inv[s.charAt(c)] << 18) + (base64inv[s.charAt(c+1)] << 12) +
            (base64inv[s.charAt(c+2)] << 6) + base64inv[s.charAt(c+3)];

    // split the 24-bit number into the original three 8-bit (ASCII) characters
    r += String.fromCharCode((n >>> 16) & 255, (n >>> 8) & 255, n & 255);
  }
   // remove any zero pad that was added to make this a multiple of 24 bits
  return r.substring(0, r.length - p.length);
}


//data = String.fromCharCode();
data = "";
for(i = 0; i <= 255; i++)
	data += String.fromCharCode(i);
console.log(data + " : " +data.length+"\n\n");



database64 = base64_encode(data);
//console.log(database64+"\n\n");

database64btoa = Buffer.from(data).toString('base64');
//console.log(database64btoa+"\n\n");


if(database64 === database64btoa)
	console.log("las codificaciones son iguales");
else
	console.log("las codificaciones no son iguales");


// impl : impl
datadecode = base64_decode(database64);

//buffer : buffer
datadeconeatob = Buffer.from(database64btoa, 'base64').toString();

//impl : buffer
datadecode3 = base64_decode(database64btoa);

//buffer : impl
datadecode4 = Buffer.from(database64, 'base64').toString();


if(data === datadecode)
	console.log("impl : impl son iguales");

if(data === datadeconeatob)
	console.log("buffer : buffer son iguales");

if(data === datadecode3)
	console.log("impl : buffer son iguales");

if(data === datadecode4)
	console.log("buffer : impl son iguales");