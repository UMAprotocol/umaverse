import { ethers } from "ethers";
import { Wallet } from "@ethersproject/wallet";
import {
  getLongShortPairBytecode,
  getLongShortPairAbi,
  getLongShortPairCreatorAbi,
  getLongShortPairCreatorBytecode,
  getLongShortPairCreatorAddress,
  getLongShortPairFinancialProductLibraryAbi,
} from "@uma/contracts-frontend";
import { sign } from "crypto";

const HARDHAT_DEFAULT_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

/**
 * @notice Constructs the ExpandedERC20.
 * @param _tokenName The name which describes the new token.
 * @param _tokenSymbol The ticker abbreviation of the name. Ideally < 5 chars.
 * @param _tokenDecimals The number of decimals to define token precision.
 */
/*
  struct ConstructorParams {
      string pairName; // Name of the long short pair contract.
      uint64 expirationTimestamp; // Unix timestamp of when the contract will expire.
      uint256 collateralPerPair; // How many units of collateral are required to mint one pair of synthetic tokens.
      bytes32 priceIdentifier; // Price identifier, registered in the DVM for the long short pair.
      ExpandedIERC20 longToken; // Token used as long in the LSP. Mint and burn rights needed by this contract.
      ExpandedIERC20 shortToken; // Token used as short in the LSP. Mint and burn rights needed by this contract.
      IERC20 collateralToken; // Collateral token used to back LSP synthetics.
      LongShortPairFinancialProductLibrary financialProductLibrary; // Contract providing settlement payout logic.
      bytes customAncillaryData; // Custom ancillary data to be passed along with the price request to the OO.
      uint256 prepaidProposerReward; // Preloaded reward to incentivize settlement price proposals.
      uint256 optimisticOracleLivenessTime; // OO liveness time for price requests.
      uint256 optimisticOracleProposerBond; // OO proposer bond for price requests.
      FinderInterface finder; // DVM finder to find other UMA ecosystem contracts.
      address timerAddress; // Timer used to synchronize contract time in testing. Set to 0x000... in production.
  }
*/

export default async function deployLSPContract() {
  const provider = new ethers.getDefaultProvider("http://127.0.0.1:8545");
  const signer = new Wallet(HARDHAT_DEFAULT_PRIVATE_KEY, provider);

  const factoryAddress = getLongShortPairCreatorAddress(1);
  const lspFactoryAbi = getLongShortPairCreatorAbi();

  //   let lspFactoryBytecode = getLongShortPairCreatorBytecode();
  //   // Bug in lib that adds quotes.
  // lspFactoryBytecode = lspFactoryBytecode.replaceAll('"', "");
  const factoryInstance = new ethers.Contract(
    factoryAddress,
    lspFactoryAbi,
    provider
  );

  const fplAbi = getLongShortPairFinancialProductLibraryAbi();
  // Pulled from networks in uma/core.
  const fplAddress = "0x37780b718c19F7f06D41f3c68C3A78ECB2Ca191f";

  const fplInstance = new ethers.Contract(fplAddress, fplAbi, provider);
  // const lspFactory = new ethers.ContractFactory(
  //   lspFactoryAbi,
  //   lspFactoryBytecode,
  //   signer
  // );

  // const lspFactoryInstance = await lspFactory.deploy();

  console.log("factoryInstance", factoryInstance);
  console.log("FPL instance", fplInstance);

  // const lspBytecode = getLongShortPairBytecode();
  // const lspAbi = getLongShortPairAbi();

  // const lspFactory = new ethers.ContractFactory(lspAbi, lspBytecode, signer);

  // // exp time: jan 1st, 2025, midnight.
  // return (contract = await factory.deploy(
  //   "UMA-CY",
  //   1735718400,
  //   ethers.utils.formatEther("0.25"),

  // ));
}
