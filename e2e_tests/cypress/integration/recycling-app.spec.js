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
    cy.get('#productList').click()
    cy.contains('Muovipussi')
  })
  it('search returns products with existing search term', function() {
    cy.visit('/')
    cy.get('#searchInput').type('pussi')
    cy.get('#searchBtn').click()
    cy.contains('Muovipussi')
  })
  it('search informs user if nothing was found', function() {
    cy.visit('/')
    cy.get('#searchInput').type('zqxwce')
    cy.get('#searchBtn').click()
    cy.contains('Haulla ei löytynyt yhtään tuotetta!')
  })
  it('existing product information can be opened and seen', function(){
    cy.visit('/')
    cy.get('#searchInput').type('pussi')
    cy.get('#searchBtn').click()
    cy.contains('Muovipussi').click()
    cy.contains('Lisää tuotteelle kierrätysohje')
  })
  it('recycling information can be added to a product', function(){
    cy.visit('/')
    cy.get('#searchInput').type('pussi')
    cy.get('#searchBtn').click()
    cy.contains('Muovipussi').click()
    cy.get('#instructionInput').type('Tuotteen voi uudelleen käyttää roskapussina')
    cy.get('#addInstruction').click()
    cy.reload() // Reloadin voi poistaa kun otetaan taulukko käyttöön tietojen tallentamiseen
 
    cy.contains('Tuotteen voi uudelleen käyttää roskapussina')
  })
})