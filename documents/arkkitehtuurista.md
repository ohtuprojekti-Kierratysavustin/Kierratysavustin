# Arkkitehtuurista ja koodeista

## Poikkeustenhallinta

Tavoitteena poikkeustenhallinnassa on, että backend antaa frontendille selkeän virheviestin, jonka voi näyttää suoraan käyttäjälle.
Pyritään myös siihen, että ei-toiminnalliset virheet pääsisivät läpi ja "kaataisivat" sovelluksen. Nämä virheet ovat ohjelmoijan virheitä ja niiden pitääkin kaataa ohjelma selkeällä virheviestillä. Näin virhe huomataan ajoissa ja ohjelma voidaan korjata mahdollisimman nopeasti. Nämä virheet tulevat läpi clientiin vain devi- ja testiympäristössä. Tuotannossa käyttäjä näkee aina vain tiiviin ja selkeän virheilmoituksen.

## Backend 
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

## Frontend

Frontend ottaa *catch* avulla kaikki kyselyvirheet kiinni, ja yksinkertaisesti näyttää vastauksesta virheen viestin vatauksen message kentästä. Onnistuneiden kyselyjen viesti voidaan näyttää yhtä suoraviivaisesti message kentästä.

## Validointi
Validoinnissa nojataan paljolti mongoosen skeemoihin liitettyihin validaattoreihin. Jokainen resurssi ottaa kiinni kaikki Mongoosen heittämät Cast- ja ValidationErrorit. Nämä virheet muunnetaan aina *ValidationException* erroriksi, jonka avulla saadaan lähetettyä vastaus tietyssä muodossa.
Mongoose skeemoille on määritelty [custom validaattoreita](https://mongoosejs.com/docs/validation.html) tiedostossa [validation.js](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/server/utils/validation.js). Mongoosen default validaattoreiden virheviestejä on myös kustomoitu, jotta ne voidaan heittää suoraan käyttäjälle. Tarvittaessa validointi tehdään itse ja heitetään validoinnin epäonnistuessa itse rakennettu uusi *ValidationException*.