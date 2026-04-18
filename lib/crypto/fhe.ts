import * as paillier from 'paillier-bigint';
import * as bcu from 'bigint-crypto-utils';

/**
 * @title FHE Utility (Paillier)
 * @dev Provides additive homomorphic encryption functions for private tallying.
 */
export class FHEUtils {
  /**
   * Generates a new Paillier keypair.
   * @param bitLength The bit length of the modulus (n). 2048 is recommended.
   */
  static async generateKeyPair(bitLength: number = 2048) {
    const { publicKey, privateKey } = await paillier.generateRandomKeys(bitLength);
    
    // Serialize for storage
    return {
      publicKey: {
        n: publicKey.n.toString(),
        g: publicKey.g.toString()
      },
      privateKey: {
        lambda: privateKey.lambda.toString(),
        mu: privateKey.mu.toString(),
        n: privateKey.publicKey.n.toString()
      }
    };
  }

  /**
   * Encrypts a numeric amount using a public key.
   */
  static encrypt(n: string, g: string, amount: number | bigint): string {
    const pub = new paillier.PublicKey(BigInt(n), BigInt(g));
    const cipher = pub.encrypt(BigInt(amount));
    return cipher.toString();
  }

  /**
   * Decrypts a ciphertext using a private key.
   */
  static decrypt(lambda: string, mu: string, n: string, ciphertext: string): string {
    const pub = new paillier.PublicKey(BigInt(n), BigInt(BigInt(n) + 1n)); // Typical g = n + 1
    const priv = new paillier.PrivateKey(BigInt(lambda), BigInt(mu), pub);
    const plain = priv.decrypt(BigInt(ciphertext));
    return plain.toString();
  }

  /**
   * Performs homomorphic addition of two ciphertexts.
   * E(a + b) = E(a) * E(b) mod n^2
   */
  static add(n: string, cipherA: string, cipherB: string): string {
    const nSquared = BigInt(n) * BigInt(n);
    const sum = (BigInt(cipherA) * BigInt(cipherB)) % nSquared;
    return sum.toString();
  }
}
