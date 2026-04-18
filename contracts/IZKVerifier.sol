// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title IZKVerifier
 * @dev Interface for Zero-Knowledge Proof (Groth16) verification.
 * This interface is compatible with Snarkjs/ZoKrates generated verifiers.
 */
interface IZKVerifier {
    /**
     * @dev Verify a Zero-Knowledge Groth16 proof.
     * @param a The A point of the Groth16 proof (G1)
     * @param b The B point of the Groth16 proof (G2)
     * @param c The C point of the Groth16 proof (G1)
     * @param input The public signals associated with the proof
     * @return bool True if the proof is valid, false otherwise
     */
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) external view returns (bool);
}
