import { v4 as uuid } from 'uuid';

describe('Page /admin/projects/:id/new', () => {
  it('Visit /admin/projects/:id/new', () => {
    const name = uuid();
    cy.project(name);

    cy.contains('button', 'Action').should('be.visible').click();
    cy.contains('button', 'Create File').should('be.visible').click();

    cy.location().should(
      'match',
      /\/admin\/projects\/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}\/new/,
    );

    cy.contains('span', name).should('be.visible').parent().find('input').wait(2000).type('tmp/test.js', { delay: 300 }); // prettier-ignore
    cy.get('div[class=ace_content]').should('be.visible').type('itest');

    cy.contains('button', 'Create new file').click();

    cy.wait(4000)
      .location()
      .should(
        'match',
        /\/admin\/projects\/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}\/tree\/tmp\/test.js/,
      );

    cy.contains('span', 'tmp').should('be.visible');
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
