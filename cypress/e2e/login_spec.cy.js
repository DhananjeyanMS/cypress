// Set default command timeout for all tests
Cypress.config('defaultCommandTimeout', 10000);

describe('Login Functionality', () => {
    // Load fixture data before each test suite
    beforeEach(() => {
        cy.fixture('users').as('userData'); // Alias fixture data for easy access
    });

    // Test valid login scenario
    describe('Valid Login Scenarios', () => {
        it('Allows a user to log in with valid credentials', function() {
            cy.visit('/login'); // Visit login page
            cy.loginWithUI(this.userData.validUser.username, this.userData.validUser.password); // Perform login
            cy.url().should('include', '/'); // Verify URL after login
            cy.contains(`Welcome, ${this.userData.validUser.username}`); // Confirm successful login message
        });
    });

    // Test invalid login scenarios
    describe('Invalid Login Scenarios', () => {
        beforeEach(() => {
            cy.visit('/login'); // Visit login page before each invalid test case
        });

        it('Prevents login with invalid credentials', function() {
            cy.loginWithUI(this.userData.validUser.username, this.userData.invalidUser.password); // Attempt login with invalid password
            cy.on('window:alert', (text) => {
                expect(text).to.include('Invalid password'); // Check for invalid password alert
            });
        });

        it('Prevents login for non-existing user', function() {
            cy.loginWithUI(this.userData.invalidUser.username, this.userData.invalidUser.password); // Attempt login with non-existing user
            cy.on('window:alert', (text) => {
                expect(text).to.include('User not found'); // Check for "User not found" alert
            });
        });

        it('Prevents login for inactive user', function() {
            cy.loginWithUI(this.userData.inactiveUser.username, this.userData.inactiveUser.password); // Attempt login with inactive user
            cy.on('window:alert', (text) => {
                expect(text).to.include('Account is locked. Please contact support.'); // Check for account locked alert
            });
        });

        it('Shows error for empty credentials', function() {
            // Attempt login with empty password
            cy.loginWithUI(this.userData.inactiveUser.username, ""); 
            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/login'); // Ensure it stays on login page
            cy.get('#password:invalid').should('have.length', 1); // Check password field validation
            cy.get('#password:invalid').then((input) => {
                expect(input[0].validationMessage).to.eq("Please fill out this field."); // Verify validation message
            });

            // Attempt login with empty username
            cy.loginWithUI("", this.userData.inactiveUser.password);
            cy.get('button[type="submit"]').click();
            cy.get('#email:invalid').should('have.length', 1); // Check email field validation
            cy.get('#email:invalid').then((input) => {
                expect(input[0].validationMessage).to.eq("Please fill out this field.");
            });
        });

        it('Shows error for invalid email format', function() {
            cy.loginWithUI(this.userData.invalidemail.username, ""); // Attempt login with invalid email format
            cy.get('button[type="submit"]').click();
            cy.get('#email:invalid').should('have.length', 1); // Check email format validation
            cy.get('#email:invalid').then((input) => {
                expect(input[0].validationMessage).to.eq("Please include an '@' in the email address. 'lockedexample.com' is missing an '@'.");
            });
        });
    });

    // Test session management and security
    describe('Session Management and Security', () => {
        beforeEach(() => {
            cy.visit('/login'); // Visit login page before each session test
        });

        it('Allows the user to log out successfully', function() {
            cy.loginWithUI(this.userData.validUser.username, this.userData.validUser.password); // Login with valid credentials
            cy.contains(`Welcome, ${this.userData.validUser.username}`);
            cy.get('a[href="/logout"]').click(); // Perform logout
            cy.on('window:alert', (text) => {
                expect(text).to.include('You have been logged out'); // Verify logout alert
            });
            cy.url().should('include', '/login'); // Check redirection to login page
        });

        it('Retains session with Remember Me functionality', function() {
            cy.get('#email').type(this.userData.validUser.username);
            cy.get('#password').type(this.userData.validUser.password);
            cy.get('#remember').check(); // Select "Remember Me" option
            cy.get('button[type="submit"]').click();
            cy.url().should('include', '/'); // Check successful login

            cy.reload(); // Simulate page reload
            cy.visit('/'); // Revisit the dashboard
            cy.url().should('include', '/'); // Verify session retention
            cy.contains(`Welcome, ${this.userData.validUser.username}`);
        });
    });

    // Test UI and accessibility features
    describe('UI and Accessibility', () => {
        it('Allows login form navigation with keyboard', function() {
            cy.visit('/login');
            cy.get('#email').focus().type(this.userData.validUser.username);
            cy.realPress('Tab'); // Move to next field with Tab key
            cy.focused().should('have.attr', 'id', 'password').type(this.userData.validUser.password); // Type password in focused field
            cy.realPress('Enter'); // Submit form with Enter key
            cy.url().should('include', '/'); // Verify login success
            cy.contains(`Welcome, ${this.userData.validUser.username}`);
        });
    });

    // Test password management functionality
    describe('Password Management', () => {
        it('Handles password reset flow', () => {
            cy.visit('/reset_password'); // Visit password reset page
            cy.on('window:alert', (text) => {
                expect(text).to.include('Password reset functionality is not implemented yet.'); // Check for reset alert
            });
            cy.url().should('include', '/login'); // Ensure redirection to login page
        });
    });

    // Test security-related login lockout mechanism
    describe('Security - Login Lockout Mechanism', () => {
        beforeEach(() => {
            cy.visit('/login'); // Visit login page before each lockout test
        });

        // Sequential failed login attempts to trigger lockout
        for (let i = 1; i <= 3; i++) {
            it(`login attempt ${i} with invalid credentials`, function() {
                const { username } = this.userData.validUser;
                cy.loginWithUI(username, 'wrongpassword'); // Attempt login with incorrect password
                cy.on('window:alert', (text) => {
                    expect(text).to.include('Invalid password'); // Verify alert for invalid password
                });
            });
        }

        it('Locks the user out after multiple failed login attempts', function() {
            const { username } = this.userData.validUser;
            cy.loginWithUI(username, 'wrongpassword'); // Attempt login after 3 failed attempts
            cy.on('window:alert', (text) => {
                expect(text).to.include('Account is locked due to too many failed attempts.'); // Verify lockout alert
            });
        });
    });
});
