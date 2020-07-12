
///////// START UTIL FUNCTIONS /////////
// easy way to go from string to ByteArray
const enc = new TextEncoder();

// another function to go from string to ByteArray, but we first encode the
// string as base64 - note the use of the atob() function
function strToBin(str) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

// function to encode raw binary to string, which is subsequently
// encoded to base64 - note the use of the btoa() function
function binToStr(bin) {
    return btoa(new Uint8Array(bin).reduce(
        (s, byte) => s + String.fromCharCode(byte), ''
    ));
}
///////// END UTIL FUNCTIONS /////////

///////// START WEBAUTHN FUNCTIONS /////////
const createCreds = async function() {

    ////// START server generated info //////
    // the below "publicKey" variable is typically generated by your server - here for DEMO purposes only
    const publicKey = {
        // random, cryptographically secure, at least 16 bytes
        challenge: enc.encode('someRandomStringThatSHouldBeReLLYLoooong&Random'),
        // relying party
        rp: {    
            name: 'Your awesome company' // sample relying party
        },
        user: {
            id: enc.encode('muk0004'),
            name: 'Partha Mukherjee',
            displayName: 'muk0004'
        },
        authenticatorSelection: { 
            userVerification: "preferred" 
        },
        attestation: 'direct',
        pubKeyCredParams: [
            {
            type: "public-key", alg: -7 // "ES256" IANA COSE Algorithms registry
            }
        ]
    }
    ////// END server generated info //////
    
    // browser receives the publicKey object and passes it to WebAuthn "create" API
    const res = await navigator.credentials.create({
            publicKey: publicKey
        })

    console.log(res);

    // Below two lines store the most important info - the ID representing the created credentials
    // Typically they are sent via POST to your server, not stored locally - here for DEMO purposes only
    localStorage.setItem('rawId', binToStr(res.rawId));
    localStorage.setItem('id', binToStr(res.id));
        
}

const validateCreds = async function(){
    
    ////// START server generated info //////
    // Usually the below publicKey object is constructed on your server
    // here for DEMO purposes only
    const rawId = localStorage.getItem('rawId');
    const AUTH_CHALLENGE = 'someRandomString';
    const publicKey = {
        // your domain
        // rpId: "92587ba8.ngrok.io",
        // random, cryptographically secure, at least 16 bytes
        challenge: enc.encode(AUTH_CHALLENGE),
        allowCredentials: [{
          id: strToBin(rawId),
          type: 'public-key'
        }],
        authenticatorSelection: { 
            userVerification: "preferred" 
          },
    };
    ////// END server generated info //////

    // browser receives the publicKey object and passes it to WebAuthn "get" API
    const res = await navigator.credentials.get({
        publicKey: publicKey
      })

    
    console.log(res);

    // here we build an object containing the results, to be sent to the server
    // usually "extractedData" is POSTed to your server
    const extractedData = {
        id: res.id,
        rawId: binToStr(res.rawId),
        clientDataJSON: binToStr(res.response.clientDataJSON)
    }

    // Usually done on the server, this is where you make your auth checks
    // here for DEMO purposes only
    const dataFromClient = JSON.parse(atob(extractedData.clientDataJSON));
    const retrievedChallenge = atob(dataFromClient.challenge);
    const retrievedOrigin = dataFromClient.origin;

    // At MINIMUM, your auth checks should be:
    // 1. Check that the retrieved challenge matches the auth challenge you sent to the client, as we do trivially below
    // 2. Check that "retrievedOrigin" matches your domain - otherwise this might be a phish - not shown here
    console.log(retrievedChallenge);
    if (retrievedChallenge == AUTH_CHALLENGE){
        alert("Login Successful");
    } else {
        alert("Unauthorized Login");
    }
}

///////// END WEBAUTHN FUNCTIONS /////////

export {createCreds, validateCreds}
