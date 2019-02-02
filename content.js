'use strict';

chrome.runtime.onMessage.addListener(function(msg) {
    chrome.storage.sync.get('privKey', function(data) {
        if (data.privKey) {
            openpgp.key.readArmored(data.privKey).then(function(keys) {
                var pattern = /(-----BEGIN PGP MESSAGE-----[\s\S]*-----END PGP MESSAGE-----)/g;
                openpgp.message.readArmored(pattern.exec(document.all[0].innerHTML)[0])
                    .then(message => openpgp.decrypt({ message: message, privateKeys: [keys.keys[0]] }))
                    .then(decrypted => openpgp.stream.readToEnd(decrypted.data))
                    .then(plaintext => document.all[0].innerHTML = plaintext);
            });
        } else {
            console.log('Key not found.');
        }
    })
});
