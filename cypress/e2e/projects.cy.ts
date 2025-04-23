describe('Projects Page Flow', () => {
  beforeEach(() => {
    // Mock API responses for auth check
    cy.intercept('GET', '/api/auth/login', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        }
      }
    });

    // Mock API response for projects list
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Project Alpha',
          description: 'This is project alpha description',
          createdDate: '2023-01-01T00:00:00.000Z',
          updatedDate: '2023-01-01T00:00:00.000Z',
          isApproved: true
        },
        {
          id: '2',
          name: 'Project Beta',
          description: 'This is project beta description',
          createdDate: '2023-02-01T00:00:00.000Z',
          updatedDate: '2023-02-01T00:00:00.000Z',
          isApproved: false
        }
      ]
    }).as('getProjects');

    // Stub localStorage to be authenticated
    cy.window().then((window) => {
      window.localStorage.setItem('accessToken', 'fake-jwt-token');
    });

    // Visit the projects page
    cy.visit('/projects');
    cy.wait('@getProjects');
  });

  it('should display projects list', () => {
    // Verify page title
    cy.get('h1').should('contain', 'Projects');
    
    // Check that the projects are displayed
    cy.contains('Project Alpha').should('be.visible');
    cy.contains('Project Beta').should('be.visible');
    
    // Check for table headers
    cy.contains('Name').should('be.visible');
    cy.contains('Description').should('be.visible');
    cy.contains('Created Date').should('be.visible');
    cy.contains('Actions').should('be.visible');
  });

  it('should filter projects with search', () => {
    // Type in the search field
    cy.get('input[type="search"]').type('Alpha');
    
    // Verify that only matching project is shown
    cy.contains('Project Alpha').should('be.visible');
    cy.contains('Project Beta').should('not.exist');
    
    // Clear search and verify both projects are visible again
    cy.get('input[type="search"]').clear();
    cy.contains('Project Alpha').should('be.visible');
    cy.contains('Project Beta').should('be.visible');
  });

  it('should open create project modal and create a new project', () => {
    // Mock API response for project creation
    cy.intercept('POST', '/api/projects', {
      statusCode: 201,
      body: {
        id: '3',
        name: 'New Test Project',
        description: 'This is a new test project',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        isApproved: false
      }
    }).as('createProject');
    
    // Update mock for projects list to include the new project
    cy.intercept('GET', '/api/projects', (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            id: '1',
            name: 'Project Alpha',
            description: 'This is project alpha description',
            createdDate: '2023-01-01T00:00:00.000Z',
            updatedDate: '2023-01-01T00:00:00.000Z',
            isApproved: true
          },
          {
            id: '2',
            name: 'Project Beta',
            description: 'This is project beta description',
            createdDate: '2023-02-01T00:00:00.000Z',
            updatedDate: '2023-02-01T00:00:00.000Z',
            isApproved: false
          },
          {
            id: '3',
            name: 'New Test Project',
            description: 'This is a new test project',
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            isApproved: false
          }
        ]
      });
    }).as('getUpdatedProjects');
    
    // Click on "New Project" button
    cy.contains('button', 'New Project').click();
    
    // Fill out the form
    cy.get('input[name="name"]').type('New Test Project');
    cy.get('textarea[name="description"]').type('This is a new test project');
    
    // Submit the form
    cy.contains('button', 'Create').click();
    
    // Wait for the API request to complete
    cy.wait('@createProject');
    cy.wait('@getUpdatedProjects');
    
    // Verify the new project is visible in the list
    cy.contains('New Test Project').should('be.visible');
  });

  it('should open project details when clicking on a project name', () => {
    // Mock API response for project details
    cy.intercept('GET', '/api/projects/1', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Project Alpha',
        description: 'This is project alpha description',
        createdDate: '2023-01-01T00:00:00.000Z',
        updatedDate: '2023-01-01T00:00:00.000Z',
        isApproved: true
      }
    }).as('getProjectDetails');
    
    // Click on the project name
    cy.contains('Project Alpha').click();
    
    // Wait for the API request to complete
    cy.wait('@getProjectDetails');
    
    // Verify we're on the project details page
    cy.url().should('include', '/projects/1');
    cy.get('h1').should('contain', 'Project Alpha');
  });

  it('should delete a project', () => {
    // Mock API response for project deletion
    cy.intercept('DELETE', '/api/projects/2', {
      statusCode: 200,
      body: {
        success: true
      }
    }).as('deleteProject');
    
    // Update mock for projects list after deletion
    cy.intercept('GET', '/api/projects', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Project Alpha',
          description: 'This is project alpha description',
          createdDate: '2023-01-01T00:00:00.000Z',
          updatedDate: '2023-01-01T00:00:00.000Z',
          isApproved: true
        }
      ]
    }).as('getProjectsAfterDelete');
    
    // Find and click the delete button for Project Beta
    cy.contains('tr', 'Project Beta')
      .find('button')
      .last() // Assuming the delete button is the last button
      .click();
    
    // Confirm deletion in the modal
    cy.contains('button', 'Delete').click();
    
    // Wait for the API request to complete
    cy.wait('@deleteProject');
    cy.wait('@getProjectsAfterDelete');
    
    // Verify Project Beta is no longer visible
    cy.contains('Project Beta').should('not.exist');
    cy.contains('Project Alpha').should('be.visible');
  });
}); 