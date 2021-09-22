/* eslint-disable */

// Fund 20 UMA to test account before running other tests.
describe("Fund UMA to test wallet", () => {
  it("Seeds tokens to accounts", () => {
    cy.exec(
      "HARDHAT_NETWORK=localhost node ./hardhat-scripts/seedUmaToAccounts.js"
    ).then((res) => {
      // Should be no error.
      expect(res.code).to.eq(0);
    });
  });
});
