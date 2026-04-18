const { FHEUtils } = require('../lib/crypto/fhe');

async function testFHE() {
  console.log('--- FHE Verification Test (Paillier) ---');
  
  // 1. Founder Scenario: Generate Keys
  const keys = await FHEUtils.generateKeyPair(2048);
  const pub = keys.publicKey;
  const priv = keys.privateKey;
  console.log('✅ Keys Generated');

  // 2. Investor A: Encrypts 50,000
  const amountA = 50000;
  const cipherA = FHEUtils.encrypt(pub.n, pub.g, amountA);
  console.log(`Investor A encrypted: ₹${amountA}`);

  // 3. Investor B: Encrypts 1,20,000
  const amountB = 120000;
  const cipherB = FHEUtils.encrypt(pub.n, pub.g, amountB);
  console.log(`Investor B encrypted: ₹${amountB}`);

  // 4. Platform: Performs Homomorphic Addition (Blindly)
  const cipherTotal = FHEUtils.add(pub.n, cipherA, cipherB);
  console.log('✅ Platform summed encrypted values blindly');

  // 5. Founder Scenario: Decrypt the total
  const decryptedTotal = FHEUtils.decrypt(priv.lambda, priv.mu, priv.n, cipherTotal);
  console.log(`Decrypted Total: ₹${decryptedTotal}`);

  if (parseInt(decryptedTotal) === (amountA + amountB)) {
    console.log('⭐⭐⭐ SUCCESS: FHE Homomorphism Verified! ⭐⭐⭐');
  } else {
    console.log('❌ FHE Verification Failed');
  }
}

testFHE();
