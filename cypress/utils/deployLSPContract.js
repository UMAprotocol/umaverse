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
import { LSP_PAIRNAME } from "./constants";

// Comments pulled from UMA lsp deploy script.

// Mandatory arguments:
// --gasprice: Gas price to use in GWEI.
// --expirationTimestamp: Timestamp that the contract will expire at.
// --collateralPerPair: How many units of collateral are required to mint one pair of synthetic tokens.
// --priceIdentifier: Price identifier to use.
// --pairName: General name for the long-short token pair.
// --longSynthName: Long token name.
// --longSynthSymbol: Long token symbol.
// --shortSynthName: Short token name.
// --shortSynthSymbol: Short token symbol.
// --collateralToken: ERC20 token used as as collateral in the LSP.
//
// Optional arguments:
// --lspCreatorAddress: Deployed address of the creator contract you're calling. This will be set based on chain ID if not specified.
// --financialProductLibraryAddress: Contract providing settlement payout logic. Required if --fpl not included.
// --fpl: Name of the financial product library type, such as RangeBond or Linear. Required if --financialProductLibraryAddress not included.
// --customAncillaryData: Custom ancillary data to be passed along with the price request. If not needed, this should be left as a 0-length bytes array.
// --prepaidProposerReward: Proposal reward to be forwarded to the created contract to be used to incentivize price proposals.
// --optimisticOracleLivenessTime: Custom liveness window for disputing optimistic oracle price proposals. Longer provides more security, shorter provides faster settlement.
// --optimisticOracleProposerBond: Additional bond proposer must post with the optimistic oracle. A higher bond increases rewards to disputers if the price is incorrect.
// --strikePrice: Alias for lowerBound, used for certain financial product libraries with no upper bound. Cannot be included if --lowerBound is specified.
// --basePercentage: The percentage of collateral per pair used as the floor. This parameter is used with the 'SuccessToken' fpl where the remaining percentage functions like an embedded call option.
// --lowerBound: Lower bound of a price range for certain financial product libraries. Cannot be included if --strikePrice is specified.
// --upperBound: Upper bound of a price range for certain financial product libraries.
//
//
// Example deployment script:
// node index.js --gasprice 80 --url YOUR_NODE_URL --mnemonic "your mnemonic (12 word seed phrase)" --pairName "UMA \$4-12 Range Token Pair August 2021" --expirationTimestamp 1630447200 --collateralPerPair 250000000000000000 --priceIdentifier UMAUSD --longSynthName "UMA \$4-12 Range Token August 2021" --longSynthSymbol rtUMA-0821 --shortSynthName "UMA \$4-12 Range Short Token August 2021" --shortSynthSymbol rtUMA-0821s --collateralToken 0x489Bf230d4Ab5c2083556E394a28276C22c3B580 --customAncillaryData "twapLength:3600" --fpl RangeBond --lowerBound 4000000000000000000 --upperBound 12000000000000000000 --prepaidProposerBond 20000000000000000000 --optimisticOracleProposerBond --40000000000000000000

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

const HARDHAT_DEFAULT_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

export default async function deployLSPContract() {
  const provider = new ethers.getDefaultProvider("http://127.0.0.1:8545");
  const signer = new Wallet(HARDHAT_DEFAULT_PRIVATE_KEY, provider);
  const factoryAddress = getLongShortPairCreatorAddress(1);
  const lspFactoryAbi = getLongShortPairCreatorAbi();

  const factoryInstance = new ethers.Contract(
    factoryAddress,
    lspFactoryAbi,
    signer
  );

  const fplAbi = getLongShortPairFinancialProductLibraryAbi();

  // Pulled from networks in uma/core.
  // Range Financial lib
  const fplAddress = "0xc1f4e05738E5a7B7CB1f22bB689359CCb1610DA4";

  const fplInstance = new ethers.Contract(fplAddress, fplAbi, signer);

  // LSP parameters. Pass in arguments to customize these.
  const lspParams = {
    pairName: LSP_PAIRNAME,
    expirationTimestamp: 1735718400, // Timestamp that the contract will expire at. exp time: jan 1st, 2025, midnight.

    collateralPerPair: "250000000000000000", // 0.25
    priceIdentifier: ethers.utils
      .hexlify(ethers.utils.toUtf8Bytes("UMAUSD"))
      .padEnd(66, "0"), // Price identifier to use.
    longSynthName: "UMA Cypress Test Token",
    longSynthSymbol: "UMACTT-L",
    shortSynthName: "UMA Short Cypress Test Token",
    shortSynthSymbol: "UMACTT-S",
    collateralToken: "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828", // Collateral token address, UMA in this case
    financialProductLibrary: fplAddress,
    customAncillaryData: "0x", // Default to empty bytes array if no ancillary data is passed.
    prepaidProposerReward: 0, // Default to 0 if no prepaid proposer reward is passed.
    optimisticOracleLivenessTime: 7200,
    optimisticOracleProposerBond: "40000000000000000000",
    upperBound: "12000000000000000000",
    lowerBound: "4000000000000000000",
  };

  console.log("did I get here?");

  let expectedAddress = "";
  try {
    expectedAddress = await factoryInstance.callStatic.createLongShortPair(
      lspParams
    );
  } catch (err) {
    console.log("err in EA call", err);
  }

  console.log("EA", expectedAddress);

  const lspTx = await factoryInstance.createLongShortPair(lspParams, {
    gasLimit: 12_000_000,
    gasPrice: 80_000_000_000,
  });

  console.log("lsp tx", lspTx);

  const mined = await lspTx.wait(1);

  console.log("mined", mined);

  return expectedAddress;
}
