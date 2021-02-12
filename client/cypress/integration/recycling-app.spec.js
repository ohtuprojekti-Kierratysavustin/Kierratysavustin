describe('Recycling app', function() {
  it('productlist page can be opened', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Kotitalouden kierrätysavustin')
  })
  it('productlist contains products', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Mustamakkarakastike pullo')
    cy.contains('Maitotölkki')
    cy.contains('Sanomalehti')
  })
  it('product recycling information can be opened by clicking button', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Mustamakkarakastike pullo')
    const stub = cy.stub()
    cy.on ('window:alert', stub)
    cy.get('button').contains('Näytä kierrätysohje').click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Mustamakkarakastike pullo - Irrota korkki, huuhtele pullo. Laita pullo ja korkki muovinkeräykseen erillään toisistaan.')
      })
  })
  it('product form contains all input fields', function(){
    cy.visit('http://localhost:3000')
    cy.contains('Tuotteen nimi')
    cy.contains('Tuotteen selitys')
    cy.contains('lisää')
  })
})