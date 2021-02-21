describe('Recycling app', function() {
  it('productlist page can be opened', function() {
    cy.visit('/')
    cy.contains('Kotitalouden kierrätysavustin')
  })
  it('productlist contains products', function() {
    cy.visit('/')
    cy.contains('Mustamakkarakastike pullo')
    cy.contains('Maitotölkki')
    cy.contains('Sanomalehti')
  })
  it('product recycling information can be viewed', function() {
    cy.visit('/products/1')
    cy.contains('Mustamakkarakastike pullo')

    cy.contains('Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.')
  })
  it('product form contains all input fields', function(){
    cy.visit('/new')
    cy.contains('Tuotteen nimi')
    cy.contains('Tuotteen selitys')
    cy.contains('lisää')
  })
  it('recycling istruction can be viewwed', function() {
    cy.visit('/products/1')
    cy.contains('Lisää tuotteelle kierrätys ohje')
    cy.contains('Kierrätys ohje:')
    cy.get('button').contains('lisää').click()
  })
})