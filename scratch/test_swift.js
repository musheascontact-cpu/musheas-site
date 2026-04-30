const fetch = require('node-fetch');

async function test() {
  const url = 'https://app.ecotrack.dz/api/v1/create/order';
  const apiKey = 'h9MppMrRSOWf0AZmhSqNRIR15pQ54zoy4bjXRqpC7QSwsXQu0X7YvKt1pKxR';

  const body = {
    reference: 'TEST-' + Date.now(),
    nom_client: 'Test User',
    telephone: '0555555555',
    adresse: 'Test Address',
    commune: 'Alger Centre',
    code_wilaya: 16,
    montant: 1000,
    type: 1,
    stop_desk: 1,
    produit: 'Test Product',
    api_token: apiKey
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

test();
