/* eslint-disable */
import deployLSPContract from "../helpers/deployLSPContract";

describe("Connects to the wallet", () => {
  let lspAddress = "";
  before(async () => {
    lspAddress = await deployLSPContract();
    // const lspBytecode = getLongShortPairBytecode();
    // const lspAbi = getLongShortPairAbi();
    // const provider = new ethers.getDefaultProvider("http://127.0.0.1:8545");

    // const signer = new Wallet(HARDHAT_DEFAULT_PRIVATE_KEY, provider);
    // const factory = new ethers.ContractFactory(lspAbi, lspBytecode, signer);
    // contract = await factory.deploy();
  });

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    // cy.visit("localhost:3000");
    // cy.setLocalStorage("cypress-testing", true);
  });

  it("Visits localhost", () => {
    cy.wait(30_000);
    cy.visit(`localhost:3000/${lspAddress}`);
    cy.contains("Your Wallet");
    cy.get("#connectWallet").click();
    cy.get(
      ".bn-onboard-custom.bn-onboard-prepare-button.bn-onboard-prepare-button-center"
    )
      .first()
      .click();

    cy.get(".bn-onboard-custom.bn-onboard-icon-button").eq(1).click();
    cy.window().then((win) => {
      console.log(win.ethereum);
    });
  });
});
