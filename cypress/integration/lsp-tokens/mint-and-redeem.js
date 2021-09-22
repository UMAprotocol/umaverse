/* eslint-disable */
import {
  LSP_PAIRNAME,
  TEST_PUBLIC_ADDRESS,
  COLLATERAL_TO_MINT,
  COLLATERAL_EXPECTED_AFTER_MINT,
  COLLATERAL_TO_REDEEM,
  COLLATERAL_EXPECTED_AFTER_REDEEM,
} from "../../contracts/constants";
import deployLSPContract from "../../contracts/deployLSPContract";

/* 
  Note: To run this test you need a few things running:
  1) Dev API
  2) Hardhat node, forking mainnet
  3) Main app
  4) You need to make sure the test account has UMA: see uma-protocol/hardhat-test and run the seedUmaToAccounts.
  More details in the README.
*/

describe("Connects to the wallet", () => {
  let lspAddress = "";
  before(async () => {
    lspAddress = await deployLSPContract();
  });

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
  });

  it("Visits newly minted test contract", () => {
    // Give API time to load detect the contract.
    // TODO: Work to get this time down with BE devs.
    cy.wait(60_000);
    cy.visit(`localhost:3000/${lspAddress}`);
    cy.contains(LSP_PAIRNAME);
  });

  it("Wallet connects to test wallet properly.", () => {
    // Initial snapshot
    cy.contains("Your Wallet");
    cy.contains("Disconnected");
    cy.get("#connectWallet").click();
    cy.get(
      ".bn-onboard-custom.bn-onboard-prepare-button.bn-onboard-prepare-button-center"
    )
      .first()
      .click();

    cy.get(".bn-onboard-custom.bn-onboard-icon-button").eq(1).click();
    cy.get("#walletAccount").contains(TEST_PUBLIC_ADDRESS);
    cy.contains("Connected");
    cy.contains(TEST_PUBLIC_ADDRESS);
  });

  // it("Seeds tokens to accounts", () => {
  //   cy.exec(
  //     "HARDHAT_NETWORK=localhost node ./hardhat-scripts/seedUmaToAccounts.js"
  //   ).then((res) => {
  //     // Should be no error.
  //     expect(res.code).to.eq(0);
  //   });
  // });

  it("Mints tokens", () => {
    cy.get("#balanceLong").contains("0");
    cy.get("#collateralInput").type(COLLATERAL_TO_MINT);
    cy.wait(1000);
    // New deployment of contract so we have to do an infinite approval.
    cy.get("#mintButton").contains("Approve");
    cy.get("#mintButton").click();
    cy.wait(2000);
    cy.get("#mintButton").contains("Mint");
    cy.get("#mintButton").click();
    cy.get("#balanceLong").contains("4");
  });

  it("Redeems tokens", () => {
    cy.get("#RedeemTab").click();
    cy.get("#collateralInput").type(COLLATERAL_TO_REDEEM);
    cy.wait(1000);
    cy.get("#redeemButton").click();
    cy.wait(2000);
    cy.get("#collateralBalance").contains("40");
  });

  // it("Move blockchain forward to a settable state", () => {
  //   cy.exec(
  //     "HARDHAT_NETWORK=localhost node ./hardhat-scripts/advanceTimeForward.js 173581840"
  //   ).then((res) => {
  //     // Should be no error.
  //     expect(res.code).to.eq(0);
  //   });
  // });

  // it("Settles the contract", () => {
  //   cy.reload();

  //   cy.wait(1000);
  //   cy.get("#settleButton").contains("Expire");
  //   cy.get("#settleButton").click();
  //   cy.wait(1000);
  //   cy.get("#settleButton").contains("Settle");
  // });
});
