'use strict';

browser.runtime.onMessage.addListener(function(msg) {
    browser.storage.sync.get('privKey').then(data => {
        if (data.privKey) {
            openpgp.key.readArmored(data.privKey).then(function(keys) {
		var pattern = /(-----BEGIN PGP MESSAGE-----[\s\S]*?-----END PGP MESSAGE-----)/g;
                var match = pattern.exec(document.all[0].innerHTML);
                if (!match) {
                    console.error('No PGP message found');
                    return;
                }
                openpgp.message.readArmored(match[0])
                    .then(message => openpgp.decrypt({ message: message, privateKeys: [keys.keys[0]] }))
                    .then(decrypted => openpgp.stream.readToEnd(decrypted.data))
                    .then(plaintext => {
                        document.all[0].innerHTML = plaintext;
                    })
                    .catch(err => console.error('Decryption error:', err));
            });
        } else {
            console.log('Key not found.');
        }
    });
});
