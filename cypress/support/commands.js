// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("solveReCAPTCHA", () => {
  // Wait until the iframe (Google reCAPTCHA) is totally loaded
  cy.wait(500);

  cy.get("iframe[src*='recaptcha']").then(($iframe) => {
    const $body = $iframe.contents().find("body");
    cy.wrap($body)
      .find(".recaptcha-checkbox-border")
      .should("be.visible")
      .click();

    cy.wait(500);
  });
});

Cypress.Commands.add("login", (user, pass, recaptcha, err) => {
  if (user) cy.get("input[name=user]").clear().type(user);
  else cy.get("input[name=user]").clear();

  if (pass) cy.get("input[name=pass]").clear().type(pass);
  else cy.get("input[name=pass]").clear();

  if (recaptcha) cy.solveReCAPTCHA();
  cy.get("button").click();

  if (err) {
    cy.get("small[class=text-danger]")
      .should("be.visible")
      .should("have.text", err);
  }
});

Cypress.Commands.add(
  "inputValue",
  (name, value, required = false, expect = null) => {
    cy.get(`input[name=${name}]`)
      .parent("div")
      .within(() => {
        if (required) cy.get("div").should("be.visible");
        cy.get("input")
          .clear()
          .type(value, { parseSpecialCharSequences: false })
          .should("have.value", expect ?? value)
          .blur();
      });
  }
);

Cypress.Commands.add("checkValue", (name, expect) => {
  cy.get(`input[name=${name}]`).should("have.value", expect);
});
