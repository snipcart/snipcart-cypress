
# Testing Your Frontend with Cypress.io Framework


Clone [https://github.com/nelitow/snipcart-cypress](https://github.com/nelitow/snipcart-cypress)

Open the folder in the terminal, then run `npm install`

Cypress was added to this project with `npm install cypress –save-dev`

  

Then on the `package.json` you can see the available commands. You can run Cypress directly from the npm commands, like `npm run test` or run cypress directly with `npx cypress open`

  

If you already have a server running, you will need to run cypress only, but in the case of this sample project you can run the default server with `npm run test`

  

The default test is at `cypress/integration/snipcart_spec.js`

You can click on it to run:

![](https://lh4.googleusercontent.com/3wU4yqgxTKL7N-tuvFZVDBqPCc3rc2hSbakLBcRSg_Ao0G8b9V0riqmnMMFOwoFt6KohlXgK8LSSxKuhVsjDiyQ4uV0NCONPyma-JADLggzj9ZRx-12KHWqcZicJ8myGxkzISmN9)

  

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
    
    const waitForSnipcartReady= () => {
	    cy.document() // get a handle for the document
	    .then({ timeout: 10000 }, ($document) => {
		    return  new  Cypress.Promise((resolve) => {
			    const  onSnipcartReady  = () => {
				    $document.removeEventListener("snipcart.ready", onSnipcartReady); // cleanup
				    resolve();
			    };
			    $document.addEventListener("snipcart.ready", onSnipcartReady);
		    });
	    });
    };

  

The above test visits our local page in a 1366x900 viewport.

  

Then we create a promise to wait for the Snipcart script to finish loading by capturing the `snipcart.ready` event.

  

All of Cypress’s functionality is available under the global `cy` object you can see above. There is no need for any async/await or any asynchronous nonsense. Tests execute one step at a time, waiting for the previous step to complete, except for waiting for the Snipcart event, as for this we need to capture the running document.

There are functions to retrieve DOM elements like `get()` as well as to find text on the page using contains(). You can write the tests in Behavior Driven Development style and focus on the high-level actions the user is performing like login/logout using standard JavaScript functions to hide the details.

> Tip: Remember to always keep the intention of your tests clear. If you
> want to group several related steps, you can do so in a function. In
> the above example, we are testing that if the user adds a product to
> the cart, the cart price total increases the correct amount. You can
> hide irrelevant details like the exact buttons clicked in private
> functions to reduce the noise.

  

Now we can add another test to check the full checkout process. You need to add it inside the describe() function after or before the other it()

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

  

Running the code should result in an error in the payment process, but that is expected behavior, so we use this to make sure is errors out as expected:


    expect(
      cy
        .get(".snipcart-flash-message__content h2")
        .should("contain", "Order couldn’t be processed.")
    );