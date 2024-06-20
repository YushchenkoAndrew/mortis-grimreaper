import { v4 as uuid } from 'uuid';

describe('Page /admin/projects/:id/tree/:...path', () => {
  it('Visit /admin/projects/:id/tree/:...path', () => {
    const name = uuid();
    cy.project(name);

    cy.contains('button', 'Action').should('be.visible').click();
    cy.contains('span', 'Main.js').should('be.visible').click();

    cy.location().should(
      'match',
      /\/admin\/projects\/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}\/tree\/Main.js/,
    );

    cy.contains('span', 'Main.js').should('be.visible');
    cy.contains('a', name).click();

    // Delete project
    cy.contains('span', 'Options').should('be.visible').click();
    cy.contains('button', 'Delete this project').should('be.visible').click();
    cy.contains('button', 'Yes, apply changes...').should('be.visible').click();

    cy.location().should('match', /\/admin\/projects/);
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
