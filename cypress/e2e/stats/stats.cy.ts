describe('populate the home page with stats', () => {
  const generateUsername = () =>
    `stats-test-${Math.random().toString(36).substring(2, 10)}`;
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

  it('should show the latest activity', () => {
    cy.get('[data-cy=latest-activity]').should('be.visible');
  });
});

export {};
