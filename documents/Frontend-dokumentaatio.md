# Frontend-dokumentaatio

## Käytetyt teknologiat

Projektin frontend toimii selaimessa, joka takaa toiminnallisuuden useissa laitteissa. Projektin frontend-osaan valitut teknologiat ja käytänteet ovat tuttuja kurssilta [Fullstack Open](https://fullstackopen.com/). Ohjelman helppokäyttöisyys on tärkeässä asemassa, jonka takia olemme valinneet valmiin tyylikirjaston **[React-Bootstrap](https://react-bootstrap.github.io/)**, jotta frontend noudattaa samanlaista tyyliä joka paikassa.

Lomakkeiden tekemiseen käytetään [Formik](https://formik.org/)-kirjastoa, ja niiden hyväksymiskriteerien määrittelemiseen eli validoimiseen kirjastoa YUP.

Frontendissa käytetään React kirjastoa. Reactin tilan (State) hallintaan käytössä on [Zustand](https://github.com/pmndrs/zustand)-kirjasto.

## Frontendin käymmistäminen paikallisesti

Frontend käynnistetään kansiossa *client* komennolla

`npm start`
