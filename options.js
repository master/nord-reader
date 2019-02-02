'use strict';

let email = document.getElementById('email');
let publicKey = document.getElementById('publicKey');
let generateKey = document.getElementById('generateKey');

function constructOptions() {
	  chrome.identity.getProfileUserInfo(function(userInfo) {
		    if (userInfo.email) {
            email.value = userInfo.email;
            generateKey.disabled = false;
		    } else {
			      message('User is not logged into Chrome.');
            generateKey.disabled = true;
		    }
	  });

    chrome.storage.sync.get('pubKey', function(data) {
        publicKey.value = data.pubKey;
    });

    generateKey.addEventListener('click', function() {
        publicKey.value = 'Generating...';

        var manifest = chrome.runtime.getManifest();
        var keyName = [manifest.name, manifest.version, Date.now()].join(' ');

        var options = {
            userIds: [{ name: keyName, email: email.value }],
            numBits: 2048,
            passphrase: ''
        };

        openpgp.generateKey(options).then(function(data) {
            var privKey = data.privateKeyArmored;
            var pubKey = data.publicKeyArmored;
            chrome.storage.sync.set({ pubKey: pubKey, privKey: privKey}, function() {
                publicKey.value = pubKey;
                console.log('Key saved.');
            });
        });
    })
}

constructOptions();
