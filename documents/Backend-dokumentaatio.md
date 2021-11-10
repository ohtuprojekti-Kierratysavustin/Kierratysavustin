# Backend dokumentaatio

### API

| URI | Tyyppi | Kuvaus |
|---|---|---|
| api/products | GET | Palauttaa kaikki tuotteet |
| api/products/user/:id | GET | Palauttaa käyttäjän suosikkituotteet |
| api/products/:id | GET | Palauttaa yhden tuotteen |
| api/products | POST | Lisää tuotteen |
| api/products/:id/instructions | POST | Lisää tuotteelle kierrätysohjeen |
| api/users | POST | Lisää käyttäjän |
| api/users/likes | GET | Palauttaa kierrätysohjeet joista käyttäjä on tykännyt |
| api/users/likes/:id | POST | Lisää id:tä vastaavan kierrätysohjeen käyttäjän tykkäyksiin |
| api/users/likes/:id | PUT | Poistaa id:tä vastaavan kierrätysohjeen käyttäjän tykkäyksistä  |
| api/users/likes | GET | Palauttaa kierrätysohjeet joista käyttäjä on ei-tykännyt |
| api/users/dislikes/:id | POST | Lisää id:tä vastaavan kierrätysohjeen käyttäjän ei-tykkäyksiin |
| api/users/dislikes/:id | PUT | Poistaa id:tä vastaavan kierrätysohjeen käyttäjän ei-tykkäyksistä |
| api/users/products/:id | POST | Lisää id:tä vastaavan tuotteen käyttäjän suosikkeihin |
| api/users/products/:id | PUT | Poistaa id:tä vastaavan tuotteen käyttäjän suosikeista |
| api/login | POST | Kirjaa käyttäjän sisään |

| Kun NODE_ENV === 'test' | | |
|---|---|---|
| api/tests/reset | POST | Poistaa tietokannasta käyttäjät, tuotteet ja kierrätysohjeet |


### Käynnistysohjeet

Tietokanta (mongodb) käynnistetään *server*-kansiossa komennolla `npm run start:mongo` (docker ja docker-compose tulee olla asennettuna)

Backend käynnistetään *server*-kansiossa seuraavin komennoin:

`npm start` kun devataan

`npm run start:test` kun testataan

Tuotantoversio käynnistetään komennolla `npm run start:prod`


## Tietokantakaavio

![Tietokantakaavio](./kuvat/db-20211108.png)
