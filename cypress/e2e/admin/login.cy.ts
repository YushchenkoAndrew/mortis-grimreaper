describe('Page /admin/login', () => {
  it('Visit /admin/login', () => {
    cy.visit('/admin/login');

    cy.contains('label', 'Username')
      .parent()
      .find('input')
      .should('be.visible')
      .type(Cypress.env('username'));

    cy.contains('label', 'Password')
      .parent()
      .find('input')
      .should('be.visible')
      .type(Cypress.env('password'));

    cy.contains('button', 'Sign in').click();
    cy.location().should('not.match', /.*\/admin\/login$/);

    cy.wait(1000).visit('/admin/login');
    cy.wait(1000).location().should('not.match', /.*\/admin\/login$/); // prettier-ignore
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
