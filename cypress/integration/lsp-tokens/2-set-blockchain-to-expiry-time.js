/* eslint-disable */

// Set time forward past Jan 1st, 2025.
describe("Set time forward to expiry", () => {
  it("Move blockchain forward to a settable state", () => {
    cy.exec(
      "HARDHAT_NETWORK=localhost node ./hardhat-scripts/advanceTimeForward.js 173581840"
    ).then((res) => {
      // Should be no error.
      expect(res.code).to.eq(0);
    });
  });
});
