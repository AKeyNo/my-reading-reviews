describe('sign up process', () => {
  // put an invalid password, invalid confirm password, and finally submit the form
  it('should sign up a new user and log in and then sign out', () => {
    const username = `username${Math.random().toString(36).substring(2, 10)}`;
    const correctPassword = 'what makes a good password? this?';

    cy.visit('/signup');
    cy.get('[data-cy="username-input"]').type(username);
    cy.get('[data-cy="email-input"]').type(`${username}@example.com`);
    cy.get('[data-cy="password-input"]').type('password');
    cy.get('[data-cy="password-error"]').contains(
      'The password must be at least 12 characters long.'
    );
    cy.get('[data-cy="confirm-password-input"]').type('password');
    cy.get('[data-cy="sign-up-submit-button"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}signup`);

    cy.get('[data-cy="password-input"]').clear().type(correctPassword);
    cy.get('[data-cy="confirm-password-error"]').contains(
      'These passwords do not match!'
    );
    cy.get('[data-cy="sign-up-submit-button"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}signup`);
    cy.get('[data-cy="confirm-password-input"]').clear().type(correctPassword);

    cy.get('[data-cy="username-error"]').should('have.value', '');
    cy.get('[data-cy="email-error"]').should('have.value', '');
    cy.get('[data-cy="password-error"]').should('have.value', '');
    cy.get('[data-cy="confirm-password-error"]').should('have.value', '');

    cy.get('[data-cy="sign-up-submit-button"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}`);
    cy.get('[data-cy="header-user-menu-username"]').contains(`${username}`);
    cy.get('[data-cy="header-user-menu"]').trigger('mouseover');
    cy.get('[data-cy="header-sign-out-button"]').click();

    cy.get('[data-cy="header-sign-in-link"]').contains('Sign In');
    cy.get('[data-cy="header-sign-up-link"]').contains('Sign Up');
  });

  it('should be able to sign in to the default user provided in the env and then sign out', () => {
    const username = 'juliuscaesar';

    cy.signIn(username);
    cy.url().should('eq', `${Cypress.config().baseUrl}`);
    cy.get('[data-cy="header-user-menu-username"]').contains(`${username}`);
    cy.signOut();
    cy.get('[data-cy="header-sign-in-link"]').contains('Sign In');
    cy.get('[data-cy="header-sign-up-link"]').contains('Sign Up');
  });
});

export {};
