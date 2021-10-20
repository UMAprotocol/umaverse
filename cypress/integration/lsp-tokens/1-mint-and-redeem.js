/* eslint-disable */
import {
  LSP_PAIRNAME,
  TEST_PUBLIC_ADDRESS,
  COLLATERAL_TO_MINT,
  COLLATERAL_EXPECTED_AFTER_MINT,
  COLLATERAL_TO_REDEEM,
  COLLATERAL_EXPECTED_AFTER_REDEEM,
} from "../../utils/constants";
import createCustomizedBridge from "../../utils/CustomizedBridge";
import deployLSPContract from "../../utils/deployLSPContract";

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
    cy.get('[data-cypress="connectWallet"]').click();
    cy.get(
      ".bn-onboard-custom.bn-onboard-prepare-button.bn-onboard-prepare-button-center"
    )
      .first()
      .click();

    cy.get(".bn-onboard-custom.bn-onboard-icon-button").eq(1).click();
    cy.get('[data-cypress="walletAccount"]').contains(TEST_PUBLIC_ADDRESS);
    cy.contains("Connected");
    cy.contains(TEST_PUBLIC_ADDRESS);
  });

  it("Mints tokens", () => {
    cy.get('[data-cypress="balanceLong"]').contains("0");
    cy.get('[data-cypress="collateralInput"]').type(COLLATERAL_TO_MINT);
    cy.wait(1000);
    // New deployment of contract so we have to do an infinite approval.
    cy.get("#mintButton").contains("Approve");
    cy.get("#mintButton").click();
    cy.wait(2000);
    cy.get("#mintButton").contains("Mint");
    cy.get("#mintButton").click();
    cy.get('[data-cypress="balanceLong"]').contains("4");
  });

  it("Redeems tokens", () => {
    cy.get("RedeemTab").click();
    cy.get('[data-cypress="collateralInput"]').type(COLLATERAL_TO_REDEEM);
    cy.wait(1000);
    cy.get("#redeemButton").click();
    cy.wait(2000);
    cy.get('[data-cypress="collateralBalance"]').contains(
      COLLATERAL_EXPECTED_AFTER_REDEEM
    );
  });
});
