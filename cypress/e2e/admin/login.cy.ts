describe('Page /admin/login', () => {
  it('Visit /admin/login', () => {
    cy.login('/admin/projects');

    cy.wait(1000).visit('/admin/login');
    cy.wait(1000).location().should('not.match', /.*\/admin\/login$/); // prettier-ignore
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
