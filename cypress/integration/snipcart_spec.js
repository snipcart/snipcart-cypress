describe("Test Ecommerce features", () => {
  it("Test Ecommerce features", () => {
    cy.viewport(1366, 900);

    cy.visit("localhost:3000");
    waitForSnipcartReady();
    cy.get("#la-gioconda").click();
    cy.get(".total").should("contain", "79.99");
    expect(cy.get(".snipcart-modal").should("exist"));
  });
});

const waitForSnipcartReady = () => {
  cy.document() // get a handle for the document
    .then({ timeout: 10000 }, ($document) => {
      return new Cypress.Promise((resolve) => {
        const onSnipcartReady = () => {
          $document.removeEventListener("snipcart.ready", onSnipcartReady); // cleanup
          resolve();
        };
        $document.addEventListener("snipcart.ready", onSnipcartReady);
      });
    });
};
