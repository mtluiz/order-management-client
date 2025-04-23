describe('Login Flow', () => {
  beforeEach(() => {
    // Mock API responses for login
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        accessToken: 'fake-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      }
    }).as('loginRequest');

    // Visit the login page
    cy.visit('/login');
  });

  it('should display login form', () => {
    // Check that the form elements are visible
    cy.get('h1').should('contain', 'Login');
    cy.get('form').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.contains('Don\'t have an account?').should('be.visible');
    cy.contains('Sign up').should('be.visible');
  });

  it('should show validation errors for empty form submission', () => {
    // Submit the form without any values
    cy.get('button[type="submit"]').click();

    // Check for validation errors
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });

  it('should show validation error for invalid email', () => {
    // Enter invalid email and valid password
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check for validation error for email
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should successfully log in with valid credentials', () => {
    // Enter valid credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@loginRequest');

    // Verify redirection to dashboard
    cy.url().should('include', '/');

    // Verify user is logged in
    cy.window().its('localStorage')
      .invoke('getItem', 'accessToken')
      .should('eq', 'fake-jwt-token');
  });

  it('should handle login failure', () => {
    // Mock API error response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials'
      }
    }).as('loginFailure');

    // Enter credentials
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('wrong-password');
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@loginFailure');

    // Check for error message
    cy.contains('Invalid credentials').should('be.visible');
    
    // Verify we're still on the login page
    cy.url().should('include', '/login');
  });

  it('should navigate to registration page when clicking signup link', () => {
    // Click on the signup link
    cy.contains('Sign up').click();
    
    // Verify redirection to registration page
    cy.url().should('include', '/register');
  });
}); 