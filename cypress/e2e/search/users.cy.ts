describe('search users', () => {
  const generateUsername = () =>
    `search-test-${Math.random().toString(36).substring(2, 10)}`;
  const generatePassword = () => `${Math.random().toString(36)}`;

  // generate usernames and passwords for three users into an array
  const users = Array.from({ length: 3 }, () => ({
    username: generateUsername(),
    password: generatePassword(),
  }));

  before(() => {
    for (const user of users) {
      cy.signUpCustom(user.username, user.password);
      cy.signOut();
    }
  });

  beforeEach(() => {
    cy.visit('/');
  });

  it('should be able to search for users', () => {
    // search for user[1]
    cy.signInCustom(users[0].username, users[0].password);
    cy.get('[data-cy=header-user-search]').contains('Users').click();
    cy.get('[data-cy=search-username-input]').type(users[1].username);
    cy.get(`[data-cy=search-result-${users[1].username}-username]`)
      .contains(users[1].username)
      .click();
    cy.get('[data-cy=profile-username]').contains(users[1].username);

    // search for user[2]
    cy.get('[data-cy=header-user-search]').contains('Users').click();
    cy.get('[data-cy=search-username-input]').type(users[2].username);
    cy.get(`[data-cy=search-result-${users[2].username}-username]`)
      .contains(users[2].username)
      .click();
    cy.get('[data-cy=profile-username]').contains(users[2].username);

    // search for user[0]
    cy.get('[data-cy=header-user-search]').contains('Users').click();
    cy.get('[data-cy=search-username-input]').type(users[0].username);
    cy.get(`[data-cy=search-result-${users[0].username}-username]`)
      .contains(users[0].username)
      .click();
    cy.get('[data-cy=profile-username]').contains(users[0].username);
  });
});

export {};
