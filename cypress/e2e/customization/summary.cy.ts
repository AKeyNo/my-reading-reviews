describe('manipulate summary on the profile', () => {
  const username = `summary-test-${Math.random()
    .toString(36)
    .substring(2, 10)}`;
  const password = `${Math.random().toString(36)}`;

  before(() => {
    cy.signUpCustom(username, password);
    cy.signOut();
    // cy.signIn('juliuscaesar');
  });

  beforeEach(() => {
    cy.signInCustom(username, password);
    cy.visit('/');
  });

  it('should be able to create a summary and then have a blank one', () => {
    cy.get('[data-cy="header-profile"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
    cy.get('[data-cy="summary-editor-open-button"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').type(
      'This is a test summary.'
    );
    cy.get('[data-cy="profile-summary-save-button"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
    cy.get('[data-cy="profile-summary-text"]').should(
      'have.text',
      'This is a test summary.'
    );

    cy.reload();
    cy.get('[data-cy="profile-summary-text"]').should(
      'have.text',
      'This is a test summary.'
    );
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
    cy.get('[data-cy="summary-editor-open-button"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').clear();
    cy.get('[data-cy="profile-summary-save-button"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
    cy.get('[data-cy="profile-summary-text"]').should('have.text', '');

    cy.reload();
    cy.get('[data-cy="profile-summary-text"]').should('have.text', '');
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
    cy.get('[data-cy="summary-editor-open-button"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').type(
      'Here is an interesting fact about me. I like to eat pizza.'
    );
    cy.get('[data-cy="profile-summary-save-button"]').click();
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
    cy.get('[data-cy="profile-summary-text"]').should(
      'have.text',
      'Here is an interesting fact about me. I like to eat pizza.'
    );

    cy.reload();
    cy.get('[data-cy="profile-summary-text"]').should(
      'have.text',
      'Here is an interesting fact about me. I like to eat pizza.'
    );
    cy.get('[data-cy="profile-summary-text-area"]').should('not.exist');
  });
});

export {};
