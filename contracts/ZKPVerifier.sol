// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./IZKVerifier.sol";

/**
 * @title ZKPVerifier
 * @dev Mock implementation of the ZKP Verifier for testing and development.
 * In production, this will be replaced by a Snarkjs-generated Groth16 verifier.
 */
contract ZKPVerifier is IZKVerifier {
    /**
     * @dev Mock implementation of verifyProof.
     * For demonstration, it verifies that the first public signal matches 
     * a specific hash of dummy data, or simply returns true for non-zero proofs.
     */
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[1] calldata input
    ) external pure override returns (bool) {
        // MOCK LOGIC: A real verifier would do complex Elliptic Curve Pairing.
        // For this demo, we ensure the proof isn't just empty zeros.
        if (a[0] == 0 || b[0][0] == 0 || c[0] == 0) {
            return false;
        }

        // We check if the public input (commitment) exists
        if (input[0] == 0) {
            return false;
        }

        return true;
    }
}
