describe('Recycling app', function() {
  it('productlist page can be opened', function() {
    cy.visit('/')
    cy.contains('Kotitalouden kierrätysavustin')
  })
  it('Product can be added to application', function() {
    cy.visit('/')
    cy.get('#productForm').click()
    cy.get('#nameInput').type('Muovipussi')
    cy.get('#descriptionInput').type('Muovia')
    cy.get('#addproductBtn').click()
  })
  it('search returns products', function() {
    cy.visit('/')
    cy.reload()
    cy.get('#searchInput').type('pussi')
    cy.get('#searchBtn').click()
    cy.contains('Muovipussi')
  })
  it('product can be clicked and instruction can be added', function(){
    //cy.visit('/')
    //cy.contains('Haulla ei löytynyt yhtään tuotetta!')
    cy.contains('Muovipussi').click()
    cy.get('#instructionInput').type('Tuotteen voi uudelleen käyttää roskapussina')
    cy.get('#addInstruction').click()
    cy.reload() // Reloadin voi poistaa kun otetaan taulukko käyttöön tietojen tallentamiseen
 
    cy.contains('Tuotteen voi uudelleen käyttää roskapussina')
  })
})