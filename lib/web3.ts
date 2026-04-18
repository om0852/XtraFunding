import { BrowserProvider, Contract, parseEther } from "ethers";

// Using the ABI from the local contracts directory
import XFundingABI from "../contracts/contract.abi.json";

export const CONTRACT_ADDRESS = "0x5F9bEEF29efAbD3a02e74AFbA4f60dF02bD34B46";

/**
 * Returns a web3 provider instance using MetaMask
 */
export const getProvider = () => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new BrowserProvider((window as any).ethereum);
  }
  return null;
};

/**
 * Prompts user to connect their wallet and returns the active signer
 */
export const connectWallet = async () => {
  const provider = getProvider();
  if (!provider) {
    throw new Error("MetaMask not found. Please install the extension.");
  }
  
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  return signer;
};

/**
 * Returns a Contract instance hooked to the signer for write operations
 */
export const getXFundingContract = async () => {
  const signer = await connectWallet();
  return new Contract(CONTRACT_ADDRESS, XFundingABI, signer);
};

/**
 * Contribute function to call smart contract and wait for transaction completion
 */
export async function submitBlockchainInvestment(campaignId: number, amountEthStr: string) {
  try {
    const minEthRequired = 0.0001; // basic safeguard
    if (parseFloat(amountEthStr) <= 0) {
      throw new Error("Amount must be greater than zero.");
    }
    
    const contract = await getXFundingContract();
    
    // Parse ETH value (e.g. from INR equivalent to ETH, although here we mock native ETH pass)
    // IMPORTANT: amountEthStr should be the ETH equivalent of the INR value they chose.
    console.log(`Preparing investment for Campaign On-Chain ID: ${campaignId} with ${amountEthStr} ETH`);

    const tx = await contract.contribute(campaignId, {
      value: parseEther(amountEthStr.toString()),
      gasLimit: 300000 // Prevents MetaMask from suggesting extreme gas on revert
    });
    
    console.log("Transaction submitted, awaiting confirmation...", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed!", receipt);
    
    return { success: true, hash: tx.hash, receipt };
  } catch (err: any) {
    console.error("Blockchain transaction failed:", err);
    return { success: false, error: err.message || "Transaction failed" };
  }
}

/**
 * Creates a new campaign securely via the blockchain layer and extracts the CampaignId
 */
export async function createBlockchainCampaign(goalEthStr: string, durationDays: number) {
  try {
    const contract = await getXFundingContract();
    
    // Parse into Wei because the contract processes msg.value against the goal
    const weiGoal = parseEther(goalEthStr.toString());

    // Failsafe duration
    const safeDays = durationDays > 0 ? durationDays : 30;

    const tx = await contract.createCampaign(weiGoal, safeDays);
    console.log("Creation transaction broadcasted, awaiting confirmation...");
    
    const receipt = await tx.wait();
    
    // Parse logs to find the CampaignCreated event and extract the generated ID
    let returnedCampaignId = -1;
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "CampaignCreated") {
          // The first argument correctly matches the unsigned integer Campaign ID
          returnedCampaignId = Number(parsedLog.args[0]);
          break;
        }
      } catch (e) {
        // Safe to ignore unparseable logs from other contracts
      }
    }
    
    if (returnedCampaignId === -1) {
      throw new Error("Transaction succeeded, but no CampaignCreated event log was found to map.");
    }

    return { success: true, campaignId: returnedCampaignId, hash: tx.hash };
  } catch (err: any) {
    console.error("Blockchain creation failed:", err);
    return { success: false, error: err.message || "Campaign Creation failed" };
  }
}
