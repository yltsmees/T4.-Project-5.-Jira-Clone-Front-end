import { faker } from '@faker-js/faker';

describe('Issue create and delete', () => {
  const fakeDesc = faker.lorem.sentence();
  const fakeTitle = faker.lorem.words();

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Create a low priority, random data issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').should('contain', 'Task');
      cy.get('.ql-editor').type(fakeDesc);
      cy.get('input[name="title"]').type(fakeTitle);
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();
      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
    cy.get('[data-testid="board-list:backlog')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(fakeTitle);
        cy.get('[data-testid="icon:task"]').should('be.visible');
      });
  });

  it('Delete the issue successfully', () => {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('i[data-testid="icon:trash"][size="19"]').click();
    });

    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Delete issue').should('be.visible').click();
    });

    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.contains(fakeTitle).should('not.exist');
    cy.reload();
  });

  it('Cancel deleting process', () => {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('i[data-testid="icon:trash"][size="19"]').click();
    });

    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains('Cancel').click();
    });

    cy.get('[data-testid="modal:confirm"]').should('not.exist');
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('i[data-testid="icon:close"][size="24"]').click();
    });
    cy.contains(fakeTitle).should('be.visible');
  });
});
