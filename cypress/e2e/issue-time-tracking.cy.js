import IssueModal from "../pages/IssueModal";

Cypress.Commands.add(
  "debounced",
  { prevSubject: true },
  (input, action, value) => {
    cy.clock();
    cy.wrap(input)[action](value);
    cy.tick(1000);
  }
);

describe("Time Tracking Test Cases using POM, kinda", () => {
  const getTimeTracking = () => cy.get('[data-testid="modal:tracking"]');
  const getStopwatch = () => cy.get('[data-testid="icon:stopwatch"]').next();
  const getPlaceNumber = (index) => cy.get('input[placeholder="Number"]').eq(index).clear();
  const expectedAmountIssues = "5";

  const timeAdd = {
    OrigEstimate: "10",
    Update: "20",
  };

  const timeRemove = {
    Spent: "2",
    Remaining: "5",
  };

  const issueDetails = {
    title: "Üllar time travel tracking",
    type: "Story",
    description: "Something about time travel...",
    assignee: "Lord Gaben",
  };

  describe("Time Tracking Test Cases", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
          //open issue creation modal
          cy.visit(url + "/board?modal-issue-create=true");
          IssueModal.createIssue(issueDetails);
          IssueModal.ensureIssueIsCreated(expectedAmountIssues, issueDetails);
          cy.contains(issueDetails.title).click();
        });
    });

    it("Time estimation functionality - Add 10, update to 20 and then remove all", () => {
      //Add estimation 10
      IssueModal.getIssueDetailModal().within(() => {
        cy.contains("No time logged").should("be.visible");
        getPlaceNumber(0).debounced("type", timeAdd.OrigEstimate);
        cy.contains(timeAdd.OrigEstimate + "h estimated").should("be.visible");
      });
      IssueModal.closeDetailModal();

      //Update estimation 20
      cy.contains(issueDetails.title).click();
      IssueModal.getIssueDetailModal().within(() => {
        getPlaceNumber(0).debounced("type", timeAdd.Update);
        cy.contains(timeAdd.Update + "h estimated").should("be.visible");
      });
      IssueModal.closeDetailModal();

      //Remove estimation
      cy.contains(issueDetails.title).click();
      IssueModal.getIssueDetailModal().within(() => {
        getPlaceNumber(0).debounced("clear");
        cy.contains(timeAdd.Update + "h estimated").should("not.exist");
      });
      IssueModal.closeDetailModal();
    });
  
    it("Time logging functionality: Log time and Remove logged time ", () => {
      // Add time to Log time
      IssueModal.getIssueDetailModal().within(() => {
        cy.contains("No time logged").should("be.visible");
        getStopwatch().click();
      });
      getTimeTracking().within(() => {
        getPlaceNumber(0).debounced("type", timeRemove.Spent);
        getPlaceNumber(1).debounced("type", timeRemove.Remaining);

        // Check for logged time
        cy.contains(timeRemove.Spent + "h logged").should("be.visible");
        cy.contains(timeRemove.Remaining + "h remaining").should("be.visible");
        cy.get('div[width*="28.57"]').should("exist");
        cy.contains("button", "Done").click().should("not.exist");
      });
      // Remove added time
      IssueModal.getIssueDetailModal().within(() => {
        getStopwatch().click();
      });
      getTimeTracking().within(() => {
        getPlaceNumber(0).debounced("clear");
        getPlaceNumber(1).debounced("clear");

        // Check for removed time
        cy.contains("No time logged").should("be.visible");
        cy.get('div[width*="28.57"]').should("not.exist");
        cy.contains("button", "Done").click().should("not.exist");
      });
      IssueModal.closeDetailModal();
    });
  });
});
