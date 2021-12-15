# Paikallinen testaaminen

Kaikkia testejä varten on hyvä käynnistää kaikki sovelluksen osat paikallisesti.
[Screen tiedostolla](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/.screenrc) määritelty screen avaa yhden ylimääräisen terminaalin testaamista varten.

## Client

Testit ajetaan *client* kansiossa komennolla `npm test`

## Backend
Käynnistettävä komennolla `npm run start:test`. Tällöin määriteltynä kannan tyhjentävä api-resurssi.

Testit ajetaan *server* kansiossa komennolla `npm test`

## E2E

Testejä varten backend pitää käynnistää komennolla npm run start:test, jotta tiedetään käyttää testitietokantaa. 
Cypress testit ajetaan e2e_tests kansiossa. 
Komennolla npm run test:e2e käytetään cypress.json teidostossa valmiiksi määriteltyä CYPRESS_BASE_URL osoitetta eli http://localhost:3000. Tällöin cypress olettaa, että sovelluksen frontend pyörii osoitteessa localhost:3000. Tätä komentoa käytetään siis kun sovellusta ajetaan kehitysaikaisessa tilassa. 
 
Komentoa npm run test:e2e:prod käytetään lähinnä vain github actioneissa. Tällöin cypress testit ajetaan asettaen CYPRESS_BASE_URL=http://localhost:3001. Komennolla npm run start:test voidaan sovellus halutessaan käynnistää samaan tyyliin kuin github actioneissa. Komento tekee clientissä buildin, joka kopioidaan server kansioon, eli saadaan aikaiseksi production build. Komento käynnistää serverin (joka nyt siis sisältää myös clientin buildin) komennolla npm run start:test, jolloin serverin NODE_ENV=test, jotta tiedetään käyttää testitietokantaa. 
 
Jos halutaan ajaa testit ns. staging buildille, eli kun sovellus on käynnistetty komennolla ./docker-setup.sh, käytetään komentoa npm run start:e2e:staging, jolloin cypressin baseurliin lisätään stagingissa käytetty polku /kierrätysavustin (CYPRESS_BASE_URL=http://localhost:3001/kierrätysavustin) 
