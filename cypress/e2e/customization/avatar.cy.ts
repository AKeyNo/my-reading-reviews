describe('avatar upload and deletion', () => {
  const username = `avatar-test-${Math.random().toString(36).substring(2, 10)}`;
  const password = `${Math.random().toString(36)}`;

  before(() => {
    cy.signUpCustom(username, password);
    cy.signOut();
  });

  beforeEach(() => {
    cy.signInCustom(username, password);
    cy.visit('/');
  });

  it(
    'should check the profile for a blank avatar and create a review showing off the blank avatar,' +
      'upload the avatar and check both places,' +
      'delete it and do the same,' +
      'and then finally upload a new one and check it again and delete it',
    () => {
      // check profile for the blank avatar
      cy.get('[data-cy="header-profile"]').click();
      cy.get('[data-cy="profile-avatar-image"]')
        .should('have.attr', 'src')
        .should('include', 'blankAvatar');
      cy.get('[data-cy="profile-avatar-image"]').should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );

      // create a review and check that the blank avatar is visible
      // book is Avatar: The Last Airbender - The Promise Part 1
      cy.visit('/book/07MwcN48SCkC');
      cy.get('[data-cy="add-to-list-button"]').click();
      cy.get('[data-cy="list-editor-status"]').select('Completed');
      cy.get('[data-cy="list-editor-save-button"]').click();

      cy.get('[data-cy="create-review-button"]').click();
      cy.get('[data-cy="review-text-area"]').type('I love this book!');
      cy.get('[data-cy="review-submit-button"]').click();
      cy.get(`[data-cy="review-avatar-${username}-image"]`)
        .should('have.attr', 'src')
        .should('include', 'blankAvatar');
      cy.get(`[data-cy="review-avatar-${username}-image"]`).should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );
      cy.get(`[data-cy="review-avatar-${username}"]`).click();

      // upload avatar and visible on profile
      cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
      cy.get('[data-cy="profile-avatar"]').click();
      cy.get('[data-cy="change-avatar-dialog').should('be.visible');
      cy.get('[data-cy="avatar-upload-button').should(
        'have.css',
        'pointer-events',
        'none'
      );
      cy.get('[data-cy="avatar-upload-input"]').attachFile(
        'images/avatars/firstAvatar.jpg'
      );
      cy.get('[data-cy="avatar-upload-button"]').click();
      cy.get('[data-cy="change-avatar-dialog"]').should('not.exist');
      cy.get('[data-cy="profile-avatar-image"]')
        .should('have.attr', 'src')
        .should('not.include', 'blankAvatar');
      cy.get('[data-cy="profile-avatar-image"]').should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );

      // avatar visible on the review
      cy.visit('/book/07MwcN48SCkC');
      cy.get(`[data-cy="review-avatar-${username}-image"]`)
        .should('have.attr', 'src')
        .should('not.include', 'blankAvatar');
      cy.get(`[data-cy="review-avatar-${username}-image"]`).should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );
      cy.get(`[data-cy="review-avatar-${username}"]`).click();

      // delete avatar and check that the blank avatar is visible on profile and review
      cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
      cy.get('[data-cy="profile-avatar"]').click();
      cy.get('[data-cy="change-avatar-dialog').should('be.visible');
      cy.get('[data-cy="avatar-upload-button').should(
        'have.css',
        'pointer-events',
        'none'
      );
      cy.get('[data-cy="avatar-delete-button"]').click();
      cy.get('[data-cy="change-avatar-dialog"]').should('not.exist');
      cy.get('[data-cy="profile-avatar-image"]')
        .should('have.attr', 'src')
        .should('include', 'blankAvatar');
      cy.get('[data-cy="profile-avatar-image"]').should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );

      cy.visit('/book/07MwcN48SCkC');
      cy.get(`[data-cy="review-avatar-${username}-image"]`)
        .should('have.attr', 'src')
        .should('include', 'blankAvatar');
      cy.get(`[data-cy="review-avatar-${username}-image"]`).should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );

      // upload new avatar and check that it is visible on profile and review
      cy.get('[data-cy="header-profile"]').click();
      cy.get('[data-cy="profile-avatar"]').click();
      cy.get('[data-cy="change-avatar-dialog').should('be.visible');
      cy.get('[data-cy="avatar-upload-button').should(
        'have.css',
        'pointer-events',
        'none'
      );
      cy.get('[data-cy="avatar-upload-input"]').attachFile(
        'images/avatars/secondAvatar.jpg'
      );
      cy.get('[data-cy="avatar-upload-button"]').click();
      cy.get('[data-cy="change-avatar-dialog"]').should('not.exist');
      cy.get('[data-cy="profile-avatar-image"]')
        .should('have.attr', 'src')
        .should('not.include', 'blankAvatar');
      cy.get('[data-cy="profile-avatar-image"]').should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );

      cy.visit('/book/07MwcN48SCkC');
      cy.get(`[data-cy="review-avatar-${username}-image"]`)
        .should('have.attr', 'src')
        .should('not.include', 'blankAvatar');
      cy.get(`[data-cy="review-avatar-${username}-image"]`).should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );
      cy.get(`[data-cy="review-avatar-${username}"]`).click();

      // delete it again
      cy.url().should('eq', `${Cypress.config().baseUrl}user/${username}`);
      cy.get('[data-cy="profile-avatar"]').click();
      cy.get('[data-cy="change-avatar-dialog').should('be.visible');
      cy.get('[data-cy="avatar-upload-button').should(
        'have.css',
        'pointer-events',
        'none'
      );
      cy.get('[data-cy="avatar-delete-button"]').click();
      cy.get('[data-cy="change-avatar-dialog"]').should('not.exist');
      cy.get('[data-cy="profile-avatar-image"]')
        .should('have.attr', 'src')
        .should('include', 'blankAvatar');
      cy.get('[data-cy="profile-avatar-image"]').should(
        'have.attr',
        'alt',
        `${username}'s avatar`
      );
    }
  );

  it('should not be able to upload non image files', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('[data-cy="header-profile"]').click();
    cy.get('[data-cy="profile-avatar"]').click();
    cy.get('[data-cy="change-avatar-dialog').should('be.visible');
    cy.get('[data-cy="avatar-upload-button').should(
      'have.css',
      'pointer-events',
      'none'
    );
    cy.get('[data-cy="avatar-upload-input"]')
      .attachFile('images/avatars/notAnAvatar.txt')
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('File is not an image!');
      });

    cy.get('[data-cy="change-avatar-close-button"]').click();
    cy.get('[data-cy="change-avatar-dialog"]').should('not.exist');
    cy.get('[data-cy="profile-avatar-image"]')
      .should('have.attr', 'src')
      .should('include', 'blankAvatar');
    cy.get('[data-cy="profile-avatar-image"]').should(
      'have.attr',
      'alt',
      `${username}'s avatar`
    );
  });

  it('should not be able to upload files larger than 1MB', () => {
    const stub = cy.stub();
    cy.on('window:alert', stub);

    cy.get('[data-cy="header-profile"]').click();
    cy.get('[data-cy="profile-avatar"]').click();
    cy.get('[data-cy="change-avatar-dialog').should('be.visible');
    cy.get('[data-cy="avatar-upload-button').should(
      'have.css',
      'pointer-events',
      'none'
    );
    cy.get('[data-cy="avatar-upload-input"]')
      .attachFile('images/avatars/avatarTooBig.jpg')
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('File must be less than 1MB!');
      });

    cy.get('[data-cy="change-avatar-close-button"]').click();
    cy.get('[data-cy="change-avatar-dialog"]').should('not.exist');
    cy.get('[data-cy="profile-avatar-image"]')
      .should('have.attr', 'src')
      .should('include', 'blankAvatar');
    cy.get('[data-cy="profile-avatar-image"]').should(
      'have.attr',
      'alt',
      `${username}'s avatar`
    );
  });
});

export {};
