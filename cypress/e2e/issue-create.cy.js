import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });


  const fakeDesc = faker.lorem.sentence();
  const fakeTitle = faker.lorem.word();
  



  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      
      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
          .trigger('click');
            
      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

//Assignment 2: Test 1
  it("Should create an issue and validate it successfully", () => {
    //Create a bug ticket
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      //time added due slow website connection and it just doesnt load the options properly
      cy.wait(1000);
      cy.get('[data-testid="select-option:Bug"]').trigger("click");
      cy.wait(1000);
      cy.get(".ql-editor").type("fakeDesc");
      cy.get('input[name="title"]').type("MyBug");
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    //Reload and check if its created
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");
    cy.get('[data-testid="board-list:backlog')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("MyBug");
        cy.get('[data-testid="icon:bug"]').should("be.visible");
      });
  });

//Assignment 2: Test 2
it("Should create an issue and validate it successfully", () => {
  //Create a bug ticket
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('[data-testid="select:type"]').should('contain', 'Task');
    cy.get(".ql-editor").type(fakeDesc);
    cy.get('input[name="title"]').type(fakeTitle);
    cy.get('[data-testid="select:reporterId"]').click();
    cy.get('[data-testid="select-option:Baby Yoda"]').click();
    cy.get('[data-testid="select:priority"]').click();
    cy.get('[data-testid="select-option:Low"]').click();
    cy.get('button[type="submit"]').click();
  });
  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  //Reload and check if its created
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
  cy.get('[data-testid="board-list:backlog')
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get('[data-testid="list-issue"]')
        .should("have.length", "5")
        .first()
        .find("p")
        .contains(fakeTitle);
      cy.get('[data-testid="icon:task"]').should("be.visible");
    });
});

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
});
