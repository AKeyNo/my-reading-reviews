describe('queries to Google Books and community stats', () => {
  it('should display that there are no listings for "The Test Book"', () => {
    cy.visit('/search/book');
    cy.get('[data-cy="search-input-book-title"]').type('The Test Book');
    cy.get('[data-cy="search-input-book-author"]').type('Mikael Krogerus');
    cy.get('[data-cy="search-input-book-publisher"]').type(
      'Profile Books Limited'
    );
    cy.get('[data-cy="search-book-results"]').contains('The Test Book').click();
    cy.url().should('eq', `${Cypress.config().baseUrl}book/tzzloAEACAAJ`);

    cy.get('[data-cy="book-information-authors"]').contains(
      'Authors: Mikael Krogerus, Roman Tschappeler'
    );
    cy.get('[data-cy="book-information-page-count"]').contains(
      'Page Count: 208'
    );
    cy.get('[data-cy="book-information-published-date"]').contains(
      'Published: 2014'
    );
    cy.get('[data-cy="book-information-publisher"]').contains(
      'Publisher: Profile Books Limited'
    );

    cy.get('[data-cy="community-stats-average-score"]').contains(
      'Average Score: N/A'
    );
    cy.get('[data-cy="community-stats-total-listings"]').contains(
      'Total Listings: 0'
    );
    cy.get('[data-cy="community-stats-total-reviews"]').contains(
      'Total Reviews: 0'
    );
    cy.get('[data-cy="community-stats-currently-reading"]').contains(
      'Currently Reading: 0'
    );
    cy.get('[data-cy="community-stats-currently-planning"]').contains(
      'Planning to Read: 0'
    );
    cy.get('[data-cy="community-stats-currently-completed"]').contains(
      'Completed: 0'
    );
    cy.get('[data-cy="community-stats-currently-paused"]').contains(
      'Paused: 0'
    );
    cy.get('[data-cy="community-stats-currently-dropped"]').contains(
      'Dropped: 0'
    );

    cy.get('[data-cy="google-preview-button"]').should(
      'have.attr',
      'href',
      'http://books.google.com/books?id=tzzloAEACAAJ&hl=&source=gbs_api'
    );
  });
});

export {};
