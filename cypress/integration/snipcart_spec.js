describe("Test Ecommerce features", () => {
  it("Test Ecommerce features", () => {
    cy.viewport(1366, 900);

    cy.visit("localhost:3000");
    waitForSnipcartReady();
    cy.get("#la-gioconda").click();
    cy.get(".total").should("contain", "79.99");
    expect(cy.get(".snipcart-modal").should("exist"));
  });

  it("Test the checkout process", () => {
    cy.viewport(1366, 900);

    cy.visit("localhost:3000");

    // wait for document event 'snipcart.ready'
    waitForSnipcartReady();

    // add the product to the cart
    cy.get("#la-gioconda").click();

    cy.get("#snipcart footer button.snipcart-button-primary", {
      timeout: 10000,
    }).click();

    // Here we fill the form by running JS in the browser
    cy.window().then((win) => {
      win.Snipcart.api.cart.update({
        email: "john.doe@example.com",
        metadata: {
          customMetadataKey: "value",
        },
        billingAddress: {
          name: "John Doe",
          address1: "3671 Garfield Road",
          city: "Neponset",
          country: "US",
          province: "IL",
          postalCode: "61345",
        },
      });
    });

    cy.wait(1000);
    cy.get("#snipcart-billing-form button")
      .contains("Continue to shipping")
      .click();
    cy.wait(1000);
    cy.get("form.snipcart-form .snipcart-button-primary")
      .contains("Continue to payment")
      .click();

    // check if :nth-child(1) > .snipcart-payment-methods-list-item__button is visible
    cy.get(
      ":nth-child(1) > .snipcart-payment-methods-list-item__button"
    ).click();

    cy.get("form .snipcart-button-primary").click();

    expect(
      cy
        .get(".snipcart-flash-message__content h2")
        .should("contain", "Order couldn’t be processed.")
    );
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
