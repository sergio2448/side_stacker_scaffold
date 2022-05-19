describe('Navigation', () => {
  it('should navigate to the home page', () => {
    // Start from the index page
    cy.visit('/')

    // Find a link with an href attribute containing "about" and click it
    cy.get('input').first().type('test')
    cy.get('button').first().click()

    // The new url should include "/game"
    cy.url().should('include', '/game')

  })
})