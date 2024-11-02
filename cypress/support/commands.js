import 'cypress-real-events/support';


Cypress.Commands.add('loginWithUI', (username, password) => {
    // Enter email if not empty
    if (username) {
        cy.get('#email').type(username);
    }

    // Enter password if not empty
    if (password) {
        cy.get('#password').type(password);
    }

    // Click login button
    cy.get('button[type="submit"]').click();
    
});


  