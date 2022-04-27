describe("Test Ecommerce features", () => {
  it("Test Ecommerce features", () => {
    cy.viewport(1366, 900);

    cy.visit("localhost:3000");

    // wait for document event 'snipcart.ready'
    cy.document() // get a handle for the document
      .then(($document) => {
        return new Cypress.Promise((resolve) => {
          // Cypress will wait for this Promise to resolve
          const onSnipcartReady = () => {
            $document.removeEventListener("snipcart.ready", onSnipcartReady); // cleanup
            resolve(); // resolve and allow Cypress to continue
          };
          $document.addEventListener("snipcart.ready", onSnipcartReady);
        });
      })
      .then(() => {
        // click on #la-gioconda button
        cy.get("#la-gioconda").click();
        // check if .total contains the value of the price of the product 79.99
        cy.get(".total").should("contain", "79.99");
        // check if .snipcart-modal exists
        cy.get(".snipcart-modal").should("exist");
      });
  });
});
