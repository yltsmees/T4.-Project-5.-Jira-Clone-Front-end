describe("Delete and cancel an issue", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]').should("be.visible");
  const getConfirmationModal = () => cy.get('[data-testid="modal:confirm"]');

  // Assignment 3: Test 1 - Deleting an issue and asserting that it doesn't exist anymore
  it("Delete the issue successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('i[data-testid="icon:trash"][size="19"]').click();
    });
    getConfirmationModal().within(() => {
      cy.contains("Delete issue").should("be.visible").click();
    });
    getConfirmationModal().should("not.exist");
    cy.contains("This is an issue of type: Task.").should("not.exist");
    cy.reload();
  });

  // Assignment 3: Test 2 - Starting the deleting issue process but canceling this action
  it("Cancel deleting process", () => {
    getIssueDetailsModal().within(() => {
      cy.get('i[data-testid="icon:trash"][size="19"]').click();
    });
    getConfirmationModal().within(() => {
      cy.contains("Cancel").click();
    });
    getConfirmationModal().should("not.exist");
    getIssueDetailsModal().within(() => {
      cy.get('i[data-testid="icon:close"][size="24"]').click();
    });
    cy.contains("This is an issue of type: Task.").should("be.visible");
  });
});
