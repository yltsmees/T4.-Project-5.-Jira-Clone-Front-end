import issueDetailModal from "../../pages/IssueModal";

describe('Delete and cancel an issue', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    cy.contains(issueTitle).click();
    });
  });

  const issueTitle = 'This is an issue of type: Task.';

  // Assignment 4:  Create Deletion Tests in POM format
  it('Delete the issue successfully using POM', () => {
    issueDetailModal.clickDeleteButton();
    issueDetailModal.confirmDeletion();
    issueDetailModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    issueDetailModal.validateIssueVisibilityState(issueTitle, false)
    
  
  });


  it.only('Cancel deleting process using POM', () => {
    issueDetailModal.clickDeleteButton();
    issueDetailModal.cancelDeletion();
    issueDetailModal.closeDetailModal();
    issueDetailModal.ensureIssueIsVisibleOnBoard(issueTitle);
    issueDetailModal.validateIssueVisibilityState(issueTitle, true)
  });
});
