/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add('login', (location?: string) => {
  if (location) cy.visit(location);

  cy.location().should('match', /.*\/admin\/login$/);

  cy.contains('label', 'Username').parent().find('input').type(Cypress.env('username')); // prettier-ignore
  cy.contains('label', 'Password').parent().find('input').type(Cypress.env('password')); // prettier-ignore

  cy.contains('button', 'Sign in').click();

  cy.wait(1000).location().should('not.match', /.*\/admin\/login$/); // prettier-ignore
  if (location) cy.wait(1000).visit(location);
});

Cypress.Commands.add(
  'project',
  (name: string, desc?: string, footer?: string) => {
    cy.login('/admin/projects');

    cy.get('div[data-index=0]').should('be.visible');
    cy.contains('button', 'New Project').click();

    cy.contains('label', 'Project Name').parent().find('input').type(name);
    if (desc) cy.contains('label', 'Description (optional)').parent().find('textarea').type(desc); // prettier-ignore
    if (footer) cy.contains('label', 'Footer (optional)').parent().find('textarea').type(footer); // prettier-ignore

    cy.contains('button', 'Create project').click();
    cy.location().should(
      'match',
      /\/admin\/projects\/[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/,
    );
  },
);

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (/^[^(ResizeObserver loop limit exceeded)]/.test(err.message)) {
    return false;
  }
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(location?: string): Chainable<void>;
      project(name: string, desc?: string, footer?: string): Chainable<void>;
      // drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

export {};
