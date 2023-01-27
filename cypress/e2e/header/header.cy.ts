describe('header buttons work', () => {
  const username = `header-test-${Math.random().toString(36).substring(2, 10)}`;
  const password = `${Math.random().toString(36)}`;

  before(() => {
    cy.signUpCustom(username, password);
    cy.signOut();
  });

  beforeEach(() => {
    cy.signInCustom(username, password);
    cy.visit('/');
  });

  it('should go to the home page when the logo is clicked', () => {
    cy.visit('/search/book');
    cy.visit('/');
    cy.get('[data-cy="header-logo"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}`);
  });

  it('should go to the profile page when the profile button is clicked', () => {
    cy.get('[data-cy="header-profile"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
  });

  it('should go to the search page when the search button is clicked', () => {
    cy.get('[data-cy="header-search"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}search/book`);
  });

  it('should go to the profile page when hovering over the username and clicking on profile', () => {
    cy.get('[data-cy="header-user-menu-username"]').trigger('mouseover');
    cy.get('[data-cy="header-profile"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
  });

  it('should log out when hovering over the username and clicking on the the logout button', () => {
    cy.get('[data-cy="header-user-menu-username"]').trigger('mouseover');
    cy.get('[data-cy="header-sign-out-button"]').click();
    cy.url().should('eq', Cypress.config().baseUrl);

    cy.get('[data-cy="header-user-menu-username"]').should('not.exist');
    cy.get('[data-cy="header-profile"]').should('not.exist');

    cy.get('[data-cy="header-sign-up-link"]').should('exist');
    cy.get('[data-cy="header-sign-in-link"]').should('exist');
  });
});

export {};
