/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      signUpCustom(username: string, password: string): Chainable<void>;
      signIn(username: string): Chainable<void>;
      signOut(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('signUpCustom', (username: string, password: string) => {
  cy.visit('/signup');
  cy.get('[data-cy="username-input"]').type(`${username}`);
  cy.get('[data-cy="email-input"]').type(`${username}@example.com`);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="confirm-password-input"]').type(password);

  cy.get('[data-cy="sign-up-submit-button"]').click();
  cy.get('[data-cy="user-menu-username"]').contains(username);
});

Cypress.Commands.add('signIn', (username: string) => {
  username = username.toUpperCase();
  cy.visit('/signin');

  cy.get('[data-cy="email-input"]').type(Cypress.env(`${username}_EMAIL`));
  cy.get('[data-cy="password-input"]').type(
    Cypress.env(`${username}_PASSWORD`)
  );
  cy.get('[data-cy="sign-in-submit-button"]').click();
  cy.get('[data-cy="user-menu-username"]').contains(
    `${username.toLowerCase()}`
  );
});

Cypress.Commands.add('signOut', () => {
  // sign out button should be available on any page at the top
  cy.get('[data-cy="user-menu"]').trigger('mouseover');
  cy.get('[data-cy="sign-out-button"]').click();
});

export {};
