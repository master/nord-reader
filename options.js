'use strict';

let email = document.getElementById('email');
let publicKey = document.getElementById('publicKey');
let generateKey = document.getElementById('generateKey');

async function constructOptions() {
    const data = await browser.storage.sync.get(['email', 'pubKey']);
    email.value = data.email || '';
    publicKey.value = data.pubKey || '';

    generateKey.addEventListener('click', async function() {
        if (!email.value || !email.value.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        publicKey.value = 'Generating...';

        try {
            const manifest = browser.runtime.getManifest();
            const keyName = [manifest.name, manifest.version, Date.now()].join(' ');

            const options = {
                userIds: [{ name: keyName, email: email.value }],
                numBits: 2048,
                passphrase: ''
            };

            const data = await openpgp.generateKey(options);
            const privKey = data.privateKeyArmored;
            const pubKey = data.publicKeyArmored;

            await browser.storage.sync.set({ 
                email: email.value,
                pubKey: pubKey,
                privKey: privKey
            });

            publicKey.value = pubKey;
            console.log('Key saved.');
        } catch (err) {
            console.error('Error generating key:', err);
            publicKey.value = 'Error generating key.';
        }
    });
}

constructOptions();
