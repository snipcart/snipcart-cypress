describe("Test Ecommerce features", () => {
  it("Test Ecommerce features", () => {
    cy.viewport(1366, 900);

    cy.visit("localhost:3000");
    waitForSnipcartReady();
    cy.get("#la-gioconda").click();
    cy.get(".total").should("contain", "79.99", { timeout: 30000 });
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
      timeout: 30000,
    }).click();

    cy.get("input[name=name]").type("John Doe");
    cy.get("input[name=email]").type("john.doe@example.com");
    cy.get("input[name=address1]").type("3671 Garfield Road", {
      force: true,
    });
    cy.get("input[name=city]").type("Neponset");
    cy.get("input[name=country-target]").type("United States", {
      force: true,
    });
    cy.get("input[name=province-target]").type("IL", { force: true });
    cy.get("input[name=postalCode]").type("61345");

    cy.get("#snipcart-billing-form button")
      .contains("Continue to shipping", { timeout: 30000 })
      .click();

    cy.get("#snipcart-checkout-step-shipping .snipcart-button-primary", {
      timeout: 30000,
    })
      .contains("Continue to payment", { timeout: 30000 })
      .click();

    // check if :nth-child(1) > .snipcart-payment-methods-list-item__button is visible
    cy.get(":nth-child(1) > .snipcart-payment-methods-list-item__button", {
      timeout: 30000,
    }).click({ timeout: 30000 });

    cy.get("form .snipcart-button-primary", { timeout: 30000 }).click();

    expect(
      cy
        .get(".snipcart-flash-message__content h2", { timeout: 30000 })
        .should("contain", "Order couldn’t be processed.")
    );
  });
});

const waitForSnipcartReady = () => {
  cy.get(".snipcart-total-price").contains("$", { timeout: 30000 });
};
