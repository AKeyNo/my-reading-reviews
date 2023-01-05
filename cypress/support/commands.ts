/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      signIn(username: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('signIn', (username: string) => {
  username = username.toUpperCase();
  cy.visit('/signin');

  cy.get('[data-cy="email-input"]').type(Cypress.env(`${username}_EMAIL`));
  cy.get('[data-cy="password-input"]').type(
    Cypress.env(`${username}_PASSWORD`)
  );
  cy.get('[data-cy="sign-in-submit-button"]').click();
});

export {};
