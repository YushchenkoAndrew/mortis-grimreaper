describe('Page /admin/projects', () => {
  it('Visit /admin/projects', () => {
    cy.login('/admin/projects');

    cy.get('div[data-index=0]').should('be.visible');
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
