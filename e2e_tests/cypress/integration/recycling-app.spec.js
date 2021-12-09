const PRODUCT_USER_COUNT_REQUEST_TYPE = {
  RECYCLE: 'recycleCount',
  PURCHASE: 'purchaseCount'
}

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
    cy.contains("Kirjaudu sisään")
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
      cy.contains("Kirjaudu ulos")
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

        it("user can see statistics about their recycling quantities", () => {
          cy.visit("/products")
          cy.contains("Hanki").click().click()
          cy.contains("Hanki").click()
          cy.contains("Kierrätä").click()
          cy.get("#recyclingStats").click()
          cy.contains("Muovipussi3133 %")
          cy.contains("Kokonaiskierrätysaste: 33.3 %")
        })

        describe("and the product is searched", () => {
          beforeEach(() => {
            cy.get("#searchInput").type("pussi")
            cy.get("#searchBtn").click()
          })

          it("its product information can be opened and seen", () => {
            cy.contains("Muovipussi").click()
            cy.contains("Lisää uusi ohje")
          })

          it("can be removed by the user", () => {
            cy.get("#deleteItem").click()
            cy.contains("Tuote 'Muovipussi' poistettiin onnistuneesti!")
            cy.contains("Ei tuotteita!")
          })

          describe("and the product information is opened", () => {
            beforeEach(() => {
              cy.contains("Muovipussi").click()
            })

            it("recycling information can be added to it", () => {
              cy.get("#instructionButton").click()
              cy.get("#instructionText").type(
                "Tuotteen voi uudelleenkäyttää roskapussina"
              )
              cy.get("#addInstruction").click()
              cy.contains("Tuotteen voi uudelleenkäyttää roskapussina")
            })

            describe("and the product has one recycling instruction", () => {
              beforeEach(() => {
                cy.get("#instructionButton").click()
                cy.get("#instructionText").type(
                  "Tuotteen voi uudelleenkäyttää roskapussina"
                )
                cy.get("#addInstruction").click()
              })

              it("recycling information can be liked", () => {
                cy.get("[id^=likeButton]").click()
              })
              it("recycling information can be disliked", () => {
                cy.get("[id^=dislikeButton]").click()
              })
              it("recycling information can be deleted by the user", () => {
                cy.get("[id^=deleteInstructionButton]").click()
                cy.contains("Ohje 'Tuotteen voi uudelleenkäyttää roskapussina' poistettiin onnistuneesti!")
              })
            })

            /*
            it("recycling information list order changes when liked or disliked", () => {
              cy.get("#instructionButton").click()
              cy.get("#instructionText").type(
                "Ohje 1"
              )
              cy.get("#addInstruction").click()

              cy.get("#instructionButton").click()
              cy.get("#instructionText").type(
                "Ohje 2"
              )
              cy.get("#addInstruction").click()
              cy.get("#top-score").contains("Ohje 1")

              cy.get('[id^=dislikeButton]').eq(0).click()
              cy.get("#top-score").contains("Ohje 2")

              cy.get('[id^=likeButton]').eq(1).click()
              cy.get("#top-score").contains("Ohje 1")
            })
            */

            it("it can be added to favorites", () => {
              cy.get("#addToFavorites").click()
              cy.get("#addToFavorites").contains('Poista suosikeista')
            })

            it("and it can be removed from favorites", () => {
              cy.get("#addToFavorites").click()
              cy.get("#addToFavorites").click()
              cy.get("#addToFavorites").contains('Lisää suosikkeihin')
            })

            it("can be removed by the user", () => {
              cy.get("#deleteItem").click()
              cy.contains("Tuote 'Muovipussi' poistettiin onnistuneesti!")
              cy.contains("Ei tuotteita!")
            })

            // Purchase/Recycling stats
            it("its purchase stat adds 1 by default", () => {
              cy.contains("Hankittu 0 kpl")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.contains("Hankittu 1 kpl")
            })

            it("its purchase stat can be added to with a user typed number", () => {
              cy.contains("Hankittu 0 kpl")
              cy.get("[id^=countInput][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").focus().clear().type("245")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.contains("Hankittu 245 kpl")
            })

            it("its purchase stat can be subtracted from", () => {
              cy.contains("Hankittu 0 kpl")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.contains("Hankittu 1 kpl")
            })

            it("its purchase stat can be subtracted from with a user typed number", () => {
              cy.contains("Hankittu 0 kpl")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=countInput][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").focus().clear().type("3")
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.contains("Hankittu 3 kpl")
            })

            it("its recycling stat can be added to if there is a purchase", () => {
              cy.contains("Kierrätetty 0 kpl")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").click()
              cy.contains("Kierrätetty 1 kpl")
            })

            it("its recycling stat can not be negative", () => {
              cy.contains("Kierrätetty 0 kpl")
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").click()
              cy.contains("Kierrätetty 0 kpl")
            })

            it("its purchase stat can not be negative", () => {
              cy.contains("Hankittu 0 kpl")
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.contains("Hankittu 0 kpl")
            })

            it("its recycling stat can be subtracted from", () => {
              cy.contains("Kierrätetty 0 kpl")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").click()
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").click()
              cy.contains("Kierrätetty 2 kpl")
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").click()
              cy.contains("Kierrätetty 1 kpl")
            })

            it("its recycling stat can not be bigger than purchase stat", () => {
              cy.contains("Kierrätetty 0 kpl")
              cy.contains("Hankittu 0 kpl")
              cy.get("[id^=countInput][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").focus().clear().type("245")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").click()
              cy.contains("Hankittu 245 kpl")
              cy.get("[id^=countInput][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").focus().clear().type("246")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").click()
              cy.contains("Kierrätetty 0 kpl")
            })

            it("its purchase buttons are disabled if user typed a non-integer", () => {
              cy.get("[id^=countInput][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").focus().clear().type("gafwaid")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").should("be.disabled")
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.PURCHASE + "]").should("be.disabled")
            })

            it("its recycle buttons are disabled if user typed a non-integer", () => {
              cy.get("[id^=countInput][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").focus().clear().type("gafwaid")
              cy.get("[id^=addCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").should("be.disabled")
              cy.get("[id^=subtractCountButton][id$=" + PRODUCT_USER_COUNT_REQUEST_TYPE.RECYCLE + "]").should("be.disabled")
            })

          })
        })
      })
    })
  })
})
