# Arkkitehtuurista ja koodeista

## Yleistä

Arkkitehtuuri on yksinkertainen ja tuttu fullstack-kurssilta. React frontend kutsuu serverin rajapintaa. Serverillä mongodb tietokanta.

## Poikkeustenhallinta

Tavoitteena poikkeustenhallinnassa on, että backend antaa frontendille selkeän virheviestin, jonka voi näyttää suoraan käyttäjälle.
Pyritään myös siihen, että ei-toiminnalliset virheet pääsisivät läpi ja "kaataisivat" sovelluksen. Nämä virheet ovat ohjelmoijan virheitä ja niiden pitääkin kaataa ohjelma selkeällä virheviestillä. Näin virhe huomataan ajoissa ja ohjelma voidaan korjata mahdollisimman nopeasti. Nämä virheet tulevat läpi clientiin vain devi- ja testiympäristössä. Tuotannossa käyttäjä näkee aina vain tiiviin ja selkeän virheilmoituksen. Dev- ja testiympäristössä virheen viestin näkee tällä hetkellä tarkastelemalla virheen aiheuttanutta kutsua. Stack trace ei siis todennäköisimmin räjähdä näytölle, vaan näkyy ilmoitus odottamattomasta virheestä. 

### Backend 

Virheiden hallinta backendissa tapahtuu [yliajettujen](https://expressjs.com/en/guide/error-handling.html) express.js [virheenhallitsijoiden](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/error/errorHandler.js) kautta. Nämä ovat erilaisia ympäristöstä riippuen.

Sillä toiminnalliset virheet halutaan palauttaa aina käyttäjälle selkeässä muodossa, käytetään poikkeuspohjaa. [ErrorBase.js](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/error/errorBase.js) on js errorista jatkettu *KierratysAvustinError*, jonka kaikki [exceptions.js](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/error/exceptions.js) määritellyt tarkemmat poikkeukset 'perivät' ja tarvittaessa täydentävät. Poikkeuksissa on default viesti, sekä HTTP-statuskoodi, jotka voi tarvittaessa yliajaa.

Aina kun logiikka sitä vaatii, heitetään jokin näistä määritellyistä virheistä selvällä viestillä. Virhe valuu expressin yliajettuun virheenhallitsijaan, joka tarkastelee virhettä. Jos virhe on toiminnallinen, lähtee vastaus yksinkertaisen virheviestin kera. Jos kyseessä on ei-toiminnallinen virhe (esim. bugi) se ympäristöstä riippuen, joko lähetetään stack tracen kanssa clientille, tai logataan (tulevaisuudessa) virhelogiin ja lähetetään käyttäjäystävällinen virhe clientille.

Järjestelmän tilaa muuttavien kutsujen vastaukset, niin virheet kuin onnistuneet, ovat muotoa: 
{
    error: undefined | VirheenTyyppi
    validationErrorObject: undefined | ValidationErrorObject
    message: "Suoraan käyttäjälle näytettävä viesti"
    resource: Object (esim. juuri lisätty tuote)
}

GET-kutsut palauttavat vain kysytyn resursin.

### Frontend

Frontend ottaa *catch* avulla kaikki kyselyvirheet kiinni, ja yksinkertaisesti näyttää vastauksesta virheen viestin vatauksen message kentästä. Onnistuneiden kyselyjen viesti voidaan näyttää yhtä suoraviivaisesti message kentästä.

## Validointi

Validoinnissa nojataan paljolti mongoosen skeemoihin liitettyihin validaattoreihin. Jokainen resurssi ottaa kiinni kaikki Mongoosen heittämät Cast- ja ValidationErrorit. Nämä virheet muunnetaan aina *ValidationException* erroriksi, jonka avulla saadaan lähetettyä vastaus tietyssä muodossa.
Mongoose skeemoille on määritelty [custom validaattoreita](https://mongoosejs.com/docs/validation.html) tiedostossa [validation.js](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/utils/validation.js). Mongoosen default validaattoreiden virheviestejä on myös kustomoitu, jotta ne voidaan heittää suoraan käyttäjälle. Tarvittaessa validointi tehdään itse ja heitetään validoinnin epäonnistuessa itse rakennettu uusi *ValidationException*.


## Autentikointi

### Backend

Kirjautuneen käyttäjän autentikointi tapahtuu resurssin alussa seuraavasti:

```
let user = await authUtils.authenticateRequestReturnUser(req)
```

authenticateRequestReturnUser tarkastaa kyselyn mukana annetun Bearer-tokenin oikeellisuuden ja palauttaa käyttäjän, jolle token on luotu. Jos token ei ole validi tai käyttäjää ei löydy, heitetään virhe. 
**Huom!** Pitää kutsua await kanssa! Muuten suoritus ohittaa autentikoinnin ja invalidilla tokenilla voi ehtiä suorittaan jotain, mitä ei pitäisi.

Kutsusta myös versio, joka ei palauta käyttäjää vaan vain autentikoi tokenin. 

```
await authUtils.authenticateRequest(req)
```

## Autorisointi

### Backend

Jos käytetään vain autentikointitarkastusta, voi kuka tahansa kirjautunut käyttäjä käyttää resurssia. Jos halutaan rajata resurssi tietyille rooleille, tulee autentikoinnin jälkeen tarkastaa käyttäjän rooli kutsumalla:

```
let user = await authUtils.authenticateRequestReturnUser(req)
authUtils.authorizeUser(user, USER_ROLES.Moderator)
```

Tässä esimerkkinä resurssi, joka on tarkoitettu moderaattori-roolin käyttäjille tai moderaattori-roolia korkeammille rooleille. 

Roolit on määritelty enumina tiedostossa [roles.js](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/enum/roles.js). Roolin on tällä hetkellä mahdollista periä yhden toisen roolin oikeudet. Esimerkiksi tällä hetkellä Admin-roolilla on oikeudet kaikkialle, ja rooli perii Moderator-roolin oikeudet. Sillä Moderator perii User-roolin oikeidet, niin Admin käyttäjä läpäisee niin yllä olevan autorisoinnin, kuin myös seuraavan autorisoinnin:

```
let user = await authUtils.authenticateRequestReturnUser(req)
authUtils.authorizeUser(user, USER_ROLES.User)
```

Resurssiin kohdistuvan operaation autorisoiminen tapahtuu kutsumalla *authorizeOperationOnResource*. Esim ohjeen poistamisen yhteydessä on tarkistus:

```
authUtils.authorizeOperationOnResource(instruction._doc, user, USER_ROLES.Moderator, 'Vain ohjeen luoja voi poistaa ohjeen!')
```

Tässä tapauksessa ohjeen voi poistaa vain ohjeen luoja, tai vähintään Moderator-roolin omaava käyttäjä. 


## Tilastointi

### Laskurit

Kierrätystilastointi pohjautuu hankinta- ja kierrätyslaskureihin. [Laskurin käsittelijä](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/controllers/counters.js). Käsittelijä päivittää päiväkohtaiseen tapahtumaan laskurin määrän. Siis jokaisella päivällä, jolloin on kierrätetty tai hankittu, on tapahtuma, jossa laskurin arvo on viimeisin sinä päivänä ollut laskurin arvo. Päiväkohtainen rakenne on luotu kierrätysastegraafin piirtämistä varten.

### Graafi ja taulukot

[Tilastokyselyt](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/controllers/statistics.js) muuntavat laskuridatan tarvittavaan muotoon. Kuten mainittu, laskuridata tallennetaan muodossa, jossa päivittäisen kierrätysastedatan muodostava kysely on mahdollisimman suoraviivainen.

## Kierrätys.info integraatio

Kierrätys.info rajapinta on integroitu kierrätyspisteiden näyttämistä varten. Tällä hetkellä kaikki käyttäjät käyttävät kutsuissa samaa avainta, joka on haettu kierratysavustin@gmail.com sähköpostille. Tulevaisuudessa on hyvä harkita pitäisikö jokaisella käyttäjällä olla oma avain, joka haetaan käyttäjän sähköpostilla.

## Testeistä

Kommunikointi rajapinnan kanssa piilotettu service objekteihin. Nämä on mahdollista mockata komponentteja testatessa. Esimerkkinä [ProductUserCountFormTest](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/client/src/tests/ProductUserCountForm.test.tsx) jossa service mockattu.