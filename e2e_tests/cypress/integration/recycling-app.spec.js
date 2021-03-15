describe('Recycling app', () => {
  beforeEach(() => {
    cy.request('POST', 'api/tests/reset')
    cy.visit('/')
  })

  it('productlist page can be opened', () => {
    cy.contains('Kotitalouden kierrätysavustin')
  })

  it('Product can be added to application', () => {
    cy.get('#productForm').click()
    cy.get('#nameInput').type('Muovipussi')
    cy.get('#addproductBtn').click()
  })

  describe('when a product is added', () => {
    beforeEach(() => {
      cy.get('#productForm').click()
      cy.get('#nameInput').type('Muovipussi')
      cy.get('#addproductBtn').click()
      cy.visit('/')
    })

    it('search returns the added product if the search term matches it', () => {
      cy.get('#searchInput').type('pussi')
      cy.get('#searchBtn').click()
      cy.contains('Muovipussi')
      cy.contains('Haulla ei löytynyt yhtään tuotetta!').should('not.exist')
    })

    it('search informs user if no items matches the search term', () => {
      cy.get('#searchInput').type('zqxwce')
      cy.get('#searchBtn').click()
      cy.contains('Haulla ei löytynyt yhtään tuotetta!')
      cy.contains('Muovipussi').should('not.exist')
    })

    describe('and the product is searched', () => {
      beforeEach(() => {
        cy.get('#searchInput').type('pussi')
        cy.get('#searchBtn').click()
      })

      it('its product information can be opened and seen', () => {
        cy.contains('Muovipussi').click()
        cy.contains('Lisää tuotteelle kierrätys ohje')
      })

      describe('and the product information is opened', () => {
        beforeEach(() => {
          cy.contains('Muovipussi').click()
        })

        it('recycling information can be added to it', () => {
          cy.get('#instructionInput').type('Tuotteen voi uudelleen käyttää roskapussina')
          cy.get('#addInstruction').click()
          cy.reload() // Reloadin voi poistaa kun otetaan taulukko käyttöön tietojen tallentamiseen

          cy.contains('Tuotteen voi uudelleen käyttää roskapussina')
        })
      })
    })
  })
})