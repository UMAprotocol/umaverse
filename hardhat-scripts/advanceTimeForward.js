/* eslint-disable */

const hre = require("hardhat");
const ethers = hre.ethers;

// KNOWN LSP Contract ends: 1630447200 (GMT: Tuesday, August 31, 2021 10:00:00 PM)
// argv[2] should be the time you want to increase to.
// EX: HARDHAT_NETWORK=localhost node ./scripts/advanceTimeForward.js 1630447300
// const time = 1630447300;

async function main() {
  // 2 months roughly
  const timeToAdvance = 31_536_000 * 4;
  // const timeToAdvance = 1735818400;
  const hardHatID = "31337";

  try {
    // await hre.network.provider.send({
    //   jsonrpc: "2.0",
    //   method: "evm_increaseTime",
    //   params: [timeToAdvance],
    //   id: hardHatID,
    // });
    // const tx = await hre.network.provider.request({
    //   jsonrpc: "2.0",
    //   method: "evm_mine",
    //   params: [Number(process.argv[2])],
    //   id: hardHatID,
    // });
    // const tx = await hre.network.provider.send({
    //   jsonrpc: "2.0",
    //   method: "evm_mine",
    //   params: [],
    //   id: hardHatID,
    // });
    await network.provider.send("evm_setNextBlockTimestamp", [
      Number(process.argv[2]),
    ]);
    const tx = await network.provider.send("evm_mine"); // this one will have 2021-07-01 12:00 AM as its timestamp, no matter what the previous block has
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