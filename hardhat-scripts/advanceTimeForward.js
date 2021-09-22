/* eslint-disable */

const hre = require("hardhat");
const ethers = hre.ethers;
const hardHatID = "31337";

// KNOWN LSP Contract ends: 1630447200 (GMT: Tuesday, August 31, 2021 10:00:00 PM)
// argv[2] should be the time you want to increase to.
// EX: HARDHAT_NETWORK=localhost node ./scripts/advanceTimeForward.js 1630447300

async function main() {
  try {
    const tx = await hre.network.provider.request({
      jsonrpc: "2.0",
      method: "evm_mine",
      params: [Number(process.argv[2])],
      id: hardHatID,
    });

    console.log("Tx?", tx);
  } catch (err) {
    console.log("err in evm_increaseTime", err);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
