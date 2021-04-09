describe("Recycling app", () => {
  beforeEach(() => {
    cy.request("POST", "api/tests/reset")
    cy.visit("/")
  })

  it("productlist page can be opened", () => {
    cy.contains("Kotitalouden kierrätysavustin")
  })

  it("user can register to the application", () => {
    cy.get("#registerButton").click()
    cy.get("#usernameInput").type("Kayttaja")
    cy.get("#passwordInput").type("kayttaja")
    cy.get("#registerSubmit").click()
    cy.contains("Rekisteröityminen onnistui")
  })

  describe("when user has registered", () => {
    beforeEach(() => {
      cy.get("#registerButton").click()
      cy.get("#usernameInput").type("Kayttaja")
      cy.get("#passwordInput").type("kayttaja")
      cy.get("#registerSubmit").click()
    })

    it("user can log in to the application", () => {
      cy.get("#loginButton").click()
      cy.get("#usernameInput").type("Kayttaja")
      cy.get("#passwordInput").type("kayttaja")
      cy.get("#loginSubmit").click()
      cy.wait(10)
      cy.contains("kirjaudu ulos")
    })

    describe("and logged in", () => {
      beforeEach(() => {
        cy.get("#loginButton").click()
        cy.get("#usernameInput").type("Kayttaja")
        cy.get("#passwordInput").type("kayttaja")
        cy.get("#loginSubmit").click()
      })

      it("Product can be added to application", () => {
        cy.get("#productForm").click()
        cy.get("#nameInput").type("Muovipussi")
        cy.get("#addproductBtn").click()
        cy.get("#productList").click()
        cy.contains("Muovipussi")
      })

      describe("when a product is added", () => {
        beforeEach(() => {
          cy.get("#productForm").click()
          cy.get("#nameInput").type("Muovipussi")
          cy.get("#addproductBtn").click()
          cy.visit("/")
        })

        it("search returns the added product if the search term matches it", () => {
          cy.get("#searchInput").type("pussi")
          cy.get("#searchBtn").click()
          cy.contains("Muovipussi")
          cy.contains("Haulla ei löytynyt yhtään tuotetta!").should("not.exist")
        })

        it("search informs user if no items matches the search term", () => {
          cy.get("#searchInput").type("zqxwce")
          cy.get("#searchBtn").click()
          cy.contains("Haulla ei löytynyt yhtään tuotetta!")
          cy.contains("Muovipussi").should("not.exist")
        })

        describe("and the product is searched", () => {
          beforeEach(() => {
            cy.get("#searchInput").type("pussi")
            cy.get("#searchBtn").click()
          })

          it("its product information can be opened and seen", () => {
            cy.contains("Muovipussi").click()
            cy.contains("Lisää tuotteelle kierrätysohje")
          })

          describe("and the product information is opened", () => {
            beforeEach(() => {
              cy.contains("Muovipussi").click()
            })

            it("recycling information can be added to it", () => {
              cy.get("#instructionText").type(
                "Tuotteen voi uudelleen käyttää roskapussina"
              )
              cy.get("#addInstruction").click()
              cy.contains("Tuotteen voi uudelleen käyttää roskapussina")
            })
          })
        })
      })
    })
  })
})
