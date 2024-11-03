## Cypress test automation framework explanation

When I set out to build this test automation framework in Cypress, my main goal was to create something that would comprehensively cover the various login scenarios in a clear, modular, and reusable way. I chose Cypress for this project because, it provides a very developer-friendly environment for writing and running tests interactively and easy installation. Here’s a closer look at how the framework is structured, the practices I followed, and the specific scenarios it addresses.

### Design Practices Followed

To keep the framework organized and maintainable, I structured the tests using logical groupings within Cypress’s `describe` blocks, each representing different types of login scenarios. For instance, I separated tests into categories like **Valid Login Scenarios**, **Invalid Login Scenarios**, **Session Management and Security**, and **UI and Accessibility**. This approach makes it easy for me or anyone else using the framework to quickly understand what each test category covers and to run specific groups of tests as needed.

I also focused on modularity by defining reusable commands in the `cypress/support/commands.js` file. For example, I created a `loginWithUI` command, which abstracts the login steps and makes the test scripts more readable. By using this command, I only need to specify the credentials and can leave the actual login steps to be handled consistently by this reusable command. This ensures that if the login steps ever change, I only have to update the command once, rather than across multiple tests.

### Best Practices Implemented

In building this framework, I made it a priority to follow Cypress best practices. Here are some of the key practices I implemented:

1. **Custom commands for reusability**:
   Creating custom commands like `loginWithUI` allows for DRY (Don’t Repeat Yourself) principles, where the same logic isn’t duplicated across multiple tests. By centralizing login logic in one place, it’s easier to maintain and update as needed.

2. **Effective use of fixtures for test data**:
   I utilised the `cypress/fixtures` folder to store user data in JSON format. This keeps the test data separate from the test code itself, making it easy to modify credentials or add new test users without altering the tests directly. It also allows for parameterisation, where tests can run with different sets of data to cover various login scenarios.

3. **Grouping tests by scenario**:
   The use of `describe` blocks to group tests by type not only makes the tests easier to read but also supports selective running of specific test groups, which can save time and resources in CI/CD pipelines or during local development.

4. **Clear assertions**:
   Each test includes clear, meaningful assertions that validate expected behaviours, like verifying the presence of specific elements or text. I’ve also included meaningful error messages to clarify what each assertion is validating, which can help pinpoint issues when tests fail.

### Test cases covered
Here’s an overview of what’s covered:

1. **Valid login scenario**:
   - **Successful Login**: Tests that a user with valid credentials can log in successfully and is redirected to the dashboard with a welcome message.

2. **Invalid login scenarios**:
   - **Incorrect password**: Verifies that login fails when a valid username is paired with an incorrect password, displaying an appropriate error message.
   - **Invalid username**: Ensures that login attempts with a non-existent username fail and display a “User not found” error.
   - **Inactive user**: Tests that an inactive user receives a “Contact support” message.
   - **Empty fields**: Validates that both the username and password fields are required and that meaningful validation errors are shown if left blank.
   - **Invalid email format**: Tests that an invalid email format triggers a validation error, ensuring the application doesn’t accept improperly formatted email addresses.

3. **Session management and security**:
   - **Logout functionality**: Confirms that a logged-in user can log out successfully and is redirected to the login page with a “Logged out” confirmation message.
   - **Remember me functionality**: Tests that when the “Remember Me” option is selected, the session persists even after closing and reopening the browser.
   - **Account lockout**: Validates that after multiple failed login attempts, the account is locked to prevent brute-force attacks, and an appropriate error message is shown.

4. **UI and accessibility**:
   - **Keyboard navigation**: Ensures that users can navigate the login form using the keyboard (Tab and Enter keys).
   - **Responsive form validation**: Verifies that the login form responds to invalid data inputs and provides feedback for accessibility.

### Challenges
1. **Handling DOM Elements inside iframes**:
   - Cypress generally doesn’t support interacting directly with elements inside iframes, which posed a bit of a challenge. To work around this, I used keyboard actions as an alternative way to interact with the application when needed, which allowed me to automate specific steps without needing direct access to iframe elements.

2. Working with Alerts:
   - Cypress automatically handles browser alerts, but testing the content within alerts is still a challenge. In cases where I needed to verify alert text, I captured the text element and added assertions to validate it. However, for scenarios that required testing multiple consecutive alerts, Cypress struggled to manage these interactions sequentially. This required some experimentation and adjustments in the test flow to handle alerts more effectively.

### Potential cases for future implementation

Here are some potential areas for improvement:

1. **Enhanced security tests**:
   - **Session expiration**: Test session expiration by verifying that users are logged out automatically after a period of inactivity.
   - **Concurrent login restrictions**: Prevent multiple concurrent logins with the same credentials to enforce single-session policies.
   - **Password complexity requirements**: Test the strength of passwords by verifying that weak passwords trigger validation errors.

2. **Comprehensive password reset flow**:
   While I included a basic placeholder test for the password reset feature, this could be extended to fully automate the password reset process. This would involve sending a reset request, verifying email receipt (probably with a mock email service), and setting a new password.

3. **Better reporting functionalities**:
   Currently I have implemented mochawesome reports. In future the automation can be scheduled and reports could be parsed into html templates and mailed automatedly to improve efficiency.

### Final thoughts

This framework was built with flexibility, reusability, and maintainability in mind. By focusing on modular design, clear assertions, and structured test data, I believe this framework is well-prepared to handle a variety of login scenarios.
Future expansions could continue to enhance its coverage and resilience, making it adaptable to evolving application requirements.
