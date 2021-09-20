/* eslint-disable */
import { LSP_PAIRNAME, TEST_PUBLIC_ADDRESS } from "../contracts/constants";
import deployLSPContract from "../contracts/deployLSPContract";

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
    // cy.visit("localhost:3000");
    // cy.setLocalStorage("cypress-testing", true);
  });

  it("Visits newly minted test contract", () => {
    // Give API time to load detect the contract.
    // TODO: Work to get this time down with BE devs.
    cy.wait(35_000);
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
});
