import { v4 as uuid } from 'uuid';

describe('Page /admin/dashboard', () => {
  it('Visit /admin/dashboard', () => {
    const [name, task, desc] = [uuid().toUpperCase(), uuid(), uuid()];
    const [tag, link] = [uuid(), uuid()];

    cy.login('/admin/dashboard');

    // Create new Stage
    cy.contains('span', 'Add new stage').click();
    cy.contains('label', 'Stage Name').parent().find('input').type(name);
    cy.contains('button', 'Create Stage').click();

    cy.get(`input[value=${name}]`).should('be.visible');

    // Create new task
    cy.get(`input[value=${name}]`).parents('div[class*=w-64]').contains('span', 'Add new task').click(); // prettier-ignore
    cy.contains('div', 'Create new task').should('be.visible');

    cy.contains('label', 'Task Name').parent().find('input').type(task);
    cy.contains('label', 'Description (optional)').parent().find('textarea').type(desc); // prettier-ignore

    // Create random link
    cy.contains('span', 'Links').click();
    cy.contains('span', 'Key').parent().find('input').type(link);
    cy.contains('span', 'Value').parent().find('input').type('http://localhost:8000'); // prettier-ignore
    cy.contains('span', 'Links').parents('button[class*=group]').parent().find('svg[class*=fa-plus]').click(); // prettier-ignore
    cy.contains('span', link).should('be.visible');

    // Create random tag
    cy.contains('span', 'Tags').click();
    cy.contains('span', 'Tags').parents('button[class*=group]').parent().find('input').type(tag); // prettier-ignore
    cy.contains('span', 'Tags').parents('button[class*=group]').parent().find('svg[class*=fa-plus]').click(); // prettier-ignore
    cy.contains('span', tag).should('be.visible');

    cy.contains('button', 'Create Task').click();

    // Preview / update task
    cy.contains('div', task).should('be.visible').click();

    cy.get(`input[value=${task}]`).should('be.visible');
    cy.contains('textarea', desc).should('be.visible');
    cy.contains('button', name).should('be.visible');

    cy.contains('span', tag).should('be.visible');
    cy.contains('span', link).should('be.visible');

    // // Delete stage
    // cy.get(`input[value=${task}]`).type('{esc}'); // prettier-ignore
    // cy.get(`input[value=${name}]`).parents('div[class*=w-64]').find('button').click(); // prettier-ignore
    // cy.contains('button', 'Delete Stage').click();
    // cy.contains('button', 'Yes, apply changes...').click();

    // cy.get(`input[value=${name}]`).should('not.exist');
  });
});

// Prevent TypeScript from reading file as legacy script
export {};
