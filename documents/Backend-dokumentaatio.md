# Backend dokumentaatio

### API

| URI | Tyyppi |  |
|---|---|---|
| api/products | GET | Palauttaa kaikki tuotteet | 
| api/products/user/:id | GET | Palauttaa käyttäjän suosikkituotteet | 
| api/products/:id | GET | Palauttaa yhden tuotteen | 
| api/products | POST | Lisää tuotteen | 
| api/products/:id/instructions | POST | Lisää tuotteelle kierrätysohjeen | 
| api/users | POST | Lisää käyttäjän |
| api/users/products/:id | POST | Lisää käyttäjälle suosikkituotteen |
| api/users/products/remove/:id | POST | Poistaa suosikkituotteen käyttäjältä |
| api/login | POST | Kirjaa käyttäjän sisään |


### Ympäristömuuttujat

## Tietokantakaavio

![Tietokantakaavio](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/staging/documents/kuvat/db-20210412.png)

