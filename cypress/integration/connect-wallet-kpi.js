/* eslint-disable */
import {
  LSP_PAIRNAME,
  TEST_PUBLIC_ADDRESS,
  COLLATERAL_TO_MINT,
  COLLATERAL_EXPECTED_AFTER_MINT,
} from "../contracts/constants";
import deployLSPContract from "../contracts/deployLSPContract";

describe("Connects to the wallet", () => {
  let lspAddress = "0xF8D29f295725606c11D9f2C7c67db32e7A1Dfa7f";
  before(async () => {
    lspAddress = await deployLSPContract();
  });

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.visit("localhost:3000");
    // cy.setLocalStorage("cypress-testing", true);
  });

  it("Visits newly minted test contract", () => {
    // Give API time to load detect the contract.
    // TODO: Work to get this time down with BE devs.
    cy.wait(60_000);
    cy.visit(`localhost:3000/${lspAddress}`);
    cy.contains(LSP_PAIRNAME);
  });

  it("Wallet connects to test wallet properly.", () => {
    cy.visit(`localhost:3000/${lspAddress}`);
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
    // cy.window().then((win) => {
    //   console.log(win.ethereum);
    // });
    cy.get("#walletAccount").contains(TEST_PUBLIC_ADDRESS);
    cy.contains("Connected");
    cy.contains(TEST_PUBLIC_ADDRESS);
  });

  it("Mints tokens", () => {
    cy.get("#collateralInput").type(COLLATERAL_TO_MINT);
    cy.wait(1000);
    cy.get("#mintButton").contains("Approve");
    cy.get("#mintButton").click();
    cy.wait(2000);
    cy.get("#mintButton").contains("Mint");
    cy.get("#mintButton").click();
    cy.get("#balanceLong").contains("4");
  });
});
