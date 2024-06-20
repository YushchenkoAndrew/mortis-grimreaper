describe('Page /projects/:id', () => {
  it('Visit /projects/:id', () => {
    cy.visit('/projects');

    cy.get('div[data-index=0]')
      .should('be.visible')
      .find('a[class*=block]')
      .should('be.visible')
      .click();

    cy.location().should(
      'match',
      /\/projects\/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/,
    );

    cy.get('iframe', { timeout: 1000 }).should('be.visible');
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
