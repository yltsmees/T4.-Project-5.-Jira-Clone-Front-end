describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });


//Sprint 2: Assignment 1
    it.only('create, edit, delete', () => {
        const comment = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        const comment_edit = 'Sed in ornare turpis. Suspendisse potenti.';
        const issue_comment = '[data-testid="issue-comment"]'
        const modal_confirm = '[data-testid="modal:confirm"]'
        
        getIssueDetailsModal().within(() => {
            //Create a new comment and verify that it exists
            cy.contains('Add a comment...').click();
            cy.get('textarea[placeholder="Add a comment..."]').type(comment);
            cy.contains('button', 'Save').should('be.visible').click().should('not.exist');
            cy.contains('Add a comment...').should('exist');
            cy.get(issue_comment).should('contain', comment);

            
            //Edit the comment
            cy.get(issue_comment).first().contains('Edit').click().should('not.exist');
            cy.get('textarea[placeholder="Add a comment..."]').should('contain', comment).clear().type(comment_edit);
            cy.contains('button', 'Save').should('be.visible').click().should('not.exist');
            cy.get(issue_comment).should('contain', 'Edit').and('contain', comment_edit);

            //Delete the comment
            cy.get(issue_comment).contains('Delete').click();
        });    
            cy.get(modal_confirm).contains('button', 'Delete comment').click().should('not.exist');
            
            // Verify the comment is deleted
            getIssueDetailsModal().contains(comment_edit).should('not.exist');
    });



    
    // it('Should create,edit and delete comment successfully', () => {
    //     const comment = 'TEST_COMMENT';
    //     const comment_edited = 'TEST_COMMENT_EDITED';

    //     getIssueDetailsModal().within(() => {
    //         //add comment
    //         cy.contains('Add a comment...').click();
    //         cy.get('textarea[placeholder="Add a comment..."]').type(comment);
    //         cy.contains('button', 'Save').click().should('not.exist');
    //         cy.contains('Add a comment...').should('exist');
    //         cy.get('[data-testid="issue-comment"]').should('contain', comment);

    //         //edit comment
    //         cy.get('[data-testid="issue-comment"]').first().contains('Edit')
    //             .click().should('not.exist');
    //         cy.get('textarea[placeholder="Add a comment..."]')
    //             .should('contain', comment).clear().type(comment_edited);
    //         cy.contains('button', 'Save').click().should('not.exist');
    //         cy.get('[data-testid="issue-comment"]').should('contain', 'Edit')
    //             .and('contain', comment_edited);

    //         //delete comment
    //         cy.contains('Delete').click();
    //     });

    //         cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete comment')
    //             .click().should('not.exist');
    //         getIssueDetailsModal().contains(comment_edited).should('not.exist');

    // });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });
});
