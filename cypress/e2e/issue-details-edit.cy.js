describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  //Assignment 3 - Task 1
  const priorities = [
    { value: "1", label: "Lowest" },
    { value: "2", label: "Low" },
    { value: "3", label: "Medium" },
    { value: "4", label: "High" },
    { value: "5", label: "Highest" },
  ];

  function updatePriority(priorityIndex) {
    const selectedPriority = priorities[priorityIndex].label;

    cy.get('[data-testid="select:priority"]').click("bottomRight");
    cy.get(`[data-testid="select-option:${selectedPriority}"]`).click();
    cy.get('[data-testid="select:priority"]').should(
      "have.text",
      selectedPriority
    );

    // Add a console log for each selected priority
    cy.log(`Selected Priority: ${selectedPriority}`);
  }

  it("Should update priority successfully", () => {
    const getIssueDetailsModal = () =>
      cy.get('[data-testid="modal:issue-details"]');

    getIssueDetailsModal().within(() => {
      // Ensure the priority dropdown is visible before using the function
      cy.get('[data-testid="select:priority"]').should("be.visible");

      // Loop through each priority and update the priority field
      priorities.forEach((priority, index) => {
        updatePriority(index);
      });
    });
  });

  //Assignment 3 - Task
  it("Should validate reporter name with regex", () => {
    const NameRegex = /^[A-Za-z ]*$/;
    const getReporterName = () => cy.get('[data-testid="select:reporter"]');

    getReporterName().then(($reporter) => {
      const reporterName = $reporter.text().trim();
      expect(reporterName).to.match(NameRegex);
    });
  });
});
