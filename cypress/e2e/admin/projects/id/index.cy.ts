import { v4 as uuid } from 'uuid';

describe('Page /admin/projects/:id', () => {
  it('Visit /admin/projects/:id', () => {
    const [name, desc, footer] = [uuid(), uuid(), uuid()];
    const [tag, link] = [uuid(), uuid()];

    cy.project(name, desc, footer);

    cy.contains('a', name).should('be.visible');
    cy.contains('span', desc).should('be.visible');
    cy.contains('span', footer).should('be.visible');

    cy.contains('span', 'About').parent().find('svg').click();

    // Create random tag
    cy.contains('label', 'Tags (optional)').parent().find('input').type(tag);
    cy.contains('label', 'Tags (optional)').parent().find('svg[class*=fa-plus]').click(); // prettier-ignore

    cy.contains('span', tag).should('be.visible');

    // Create random link
    cy.contains('span', 'Key').parent().find('input').type(link);
    cy.contains('span', 'Value').parent().find('input').type('http://localhost:8000'); // prettier-ignore
    cy.contains('label', 'Links (optional)').parent().find('svg[class*=fa-plus]').click(); // prettier-ignore

    cy.contains('button', 'Save changes').click();

    cy.contains('a', link).should('be.visible');
    cy.contains('span', tag).should('be.visible');

    // Check if project status change
    cy.contains('span', 'Active').should('be.visible').click();
    cy.contains('span', 'Inactive').should('be.visible').click();

    // Delete project
    cy.contains('span', 'Options').should('be.visible').click();
    cy.contains('button', 'Delete this project').should('be.visible').click();
    cy.contains('button', 'Yes, apply changes...').should('be.visible').click();

    cy.location().should('match', /\/admin\/projects/);
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
