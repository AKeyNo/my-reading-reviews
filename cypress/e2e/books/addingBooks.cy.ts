describe('manipulating read list', () => {
  const username = `adding-books-test-${Math.random()
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

  after(() => {
    // cy.signOut();
  });

  it('should add search a book, add it, be available on the profile page, and remove it', () => {
    const userBookInformation = {
      status: 'Completed',
      score: '8',
      pagesRead: '256',
      startDate: '2020-01-01',
      finishDate: '2020-01-31',
      timesReread: '2',
      notes: 'This book was great!',
    };

    const {
      status,
      score,
      pagesRead,
      startDate,
      finishDate,
      timesReread,
      notes,
    } = userBookInformation;

    let beforeAverageScore: number = -1,
      beforeTotalListings: number = -1;

    cy.get('[data-cy="header-search"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}search/book`);
    cy.get('[data-cy="search-input-book-title"]').type('The Hobbit');
    cy.get('[data-cy="search-book-results"]').contains('The Hobbit').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}book/pD6arNyKyi8C`);
    cy.get('[data-cy="community-stats-total-listings"]')
      .then(($totalListings) => {
        beforeTotalListings = parseInt(
          $totalListings.text().split('Total Listings: ')[1]
        );
      })
      .then(() => {
        cy.get('[data-cy="community-stats-average-score"]').then(
          ($averageScore) => {
            beforeAverageScore = parseInt(
              $averageScore.text().split('Average Score: ')[1]
            );
          }
        );
      })
      .then(() => {
        cy.get('[data-cy="add-to-list-button"]').click();
        cy.get('[data-cy="list-editor-status"]').should(
          'have.value',
          'Reading'
        );
        cy.get('[data-cy="list-editor-score"]').should('have.value', '0');
        cy.get('[data-cy="list-editor-pages-read"]').should('have.value', '0');
        cy.get('[data-cy="list-editor-start-date"]').should('have.value', '');
        cy.get('[data-cy="list-editor-finish-date"]').should('have.value', '');
        cy.get('[data-cy="list-editor-times-reread"]').should(
          'have.value',
          '0'
        );
        cy.get('[data-cy="list-editor-notes"]').should('have.value', '');

        cy.get('[data-cy="list-editor-status"]').select(status);
        // should autofill pages read
        cy.get('[data-cy="list-editor-pages-read"]').should(
          'have.value',
          pagesRead
        );
        // calls invoke because .clear() doesn't work, same as lower down
        cy.get('[data-cy="list-editor-score"]').invoke('val', '').type(score);
        cy.get('[data-cy="list-editor-start-date"]').type(startDate);
        cy.get('[data-cy="list-editor-finish-date"]').type(finishDate);
        cy.get('[data-cy="list-editor-times-reread"]')
          .invoke('val', '')
          .type(timesReread);
        cy.get('[data-cy="list-editor-notes"]').type(notes);
        cy.get('[data-cy="list-editor-save-button"]').click();

        cy.get('[data-cy="add-to-list-button"]').contains('Edit Entry').click();
        cy.get('[data-cy="list-editor-status"]').should('have.value', status);
        cy.get('[data-cy="list-editor-score"]').should('have.value', score);
        cy.get('[data-cy="list-editor-pages-read"]').should(
          'have.value',
          pagesRead
        );
        cy.get('[data-cy="list-editor-start-date"]').should(
          'have.value',
          startDate
        );
        cy.get('[data-cy="list-editor-finish-date"]').should(
          'have.value',
          finishDate
        );
        cy.get('[data-cy="list-editor-times-reread"]').should(
          'have.value',
          '2'
        );
        cy.get('[data-cy="list-editor-notes"]').should('have.value', notes);
        cy.get('[data-cy="list-editor-close-button"]').click();

        cy.get('[data-cy="community-stats-average-score"]').contains(
          `Average Score: ${(
            (beforeAverageScore * beforeTotalListings + parseInt(score)) /
            (beforeTotalListings + 1)
          ).toFixed(2)}`
        );

        cy.get('[data-cy="community-stats-total-listings"]').contains(
          `Total Listings: ${beforeTotalListings + 1}`
        );
      });

    cy.get('[data-cy="header-profile"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
    cy.get('[data-cy="profile-recent-activity"]').contains(
      `${username} has completed The Hobbit! 256/256`
    );
    cy.get(
      `[data-cy="recent-activity-user-${username}-book-pD6arNyKyi8C"]`
    ).click();

    cy.get('[data-cy="add-to-list-button"]').contains('Edit Entry').click();
    cy.get('[data-cy="list-editor-delete-button"]').contains('Delete').click();
    cy.get('[data-cy="header-profile"]').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
    cy.get('[data-cy="profile-recent-activity"]').should(
      'not.have.value',
      `${username} has completed The Hobbit! 256/256`
    );
  });

  it('should be able to favorite multiple books and be available on the user page', () => {
    cy.get('[data-cy="header-search"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}search/book`);
    cy.get('[data-cy="search-input-book-title"]').type('A Tale of Two Cities');
    cy.get('[data-cy="search-book-results"]')
      .contains('A Tale of Two Cities')
      .click();

    cy.url().should('eq', `${Cypress.config().baseUrl}book/w88oAwAAQBAJ`);
    cy.get('[data-cy="add-to-list-button"]').click();
    cy.get('[data-cy="list-editor-favorite-button"]').click();
    cy.get('[data-cy="list-editor-save-button"]').click();
    cy.get('[data-cy="header-search"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}search/book`);
    // NeMtSAAACAAJ is the book id for To Kill a Mockingbird
    cy.get('[data-cy="search-input-book-title"]').type('NeMtSAAACAAJ');
    // regex means contains exactly 'To Kill a Mockingbird'
    cy.get('[data-cy="search-book-results"]')
      .contains(/^To Kill a Mockingbird$/)
      .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}book/NeMtSAAACAAJ`);
    cy.get('[data-cy="add-to-list-button"]').click();
    cy.get('[data-cy="list-editor-favorite-button"]').click();
    cy.get('[data-cy="list-editor-save-button"]').click();
    cy.get('[data-cy="header-profile"]').click();

    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
    // A Tale of Two Cities
    cy.get('[data-cy="profile-favorite-book-w88oAwAAQBAJ"]');
    // To Kill a Mockingbird
    cy.get('[data-cy="profile-favorite-book-NeMtSAAACAAJ"]');

    // now unfavorite A Tale of Two Cities
    cy.get('[data-cy="profile-favorite-book-w88oAwAAQBAJ"]').click();
    cy.get('[data-cy="add-to-list-button"]').contains('Edit Entry').click();
    cy.get('[data-cy="list-editor-favorite-button"]').click();
    cy.get('[data-cy="list-editor-save-button"]').click();
    cy.get('[data-cy="header-profile"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
    cy.get('[data-cy="profile-favorite-book-w88oAwAAQBAJ"]').should(
      'not.exist'
    );
    cy.get('[data-cy="profile-favorite-book-NeMtSAAACAAJ"]');
    cy.get('[data-cy="profile-recent-activity"]').contains(
      `${username} is reading A Tale of Two Cities! 0/304`
    );

    // now unfavorite To Kill a Mockingbird
    cy.get('[data-cy="profile-favorite-book-NeMtSAAACAAJ"]').click();
    cy.get('[data-cy="add-to-list-button"]').contains('Edit Entry').click();
    cy.get('[data-cy="list-editor-favorite-button"]').click();
    cy.get('[data-cy="list-editor-save-button"]').click();
    cy.get('[data-cy="header-profile"]').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
    cy.get('[data-cy="profile-favorite-book-NeMtSAAACAAJ"]').should(
      'not.exist'
    );
    cy.get('[data-cy="profile-recent-activity"]').contains(
      `${username} is reading To Kill a Mockingbird! 0/384`
    );
  });
});

export {};
