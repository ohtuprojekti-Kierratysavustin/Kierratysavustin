# Asennusohjeet

## Asennus paikalliseen ympäristöön (ilman dockeria)

1. Kloonaa projektin github repositorio ja siirry sovelluksen kansioon

```
git clone https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin.git
cd Kierratysavustin/
```

2. Asenna serverin npm paketit

```
cd server/
npm install
cd ..
```

3. Asenna clientin npm paketit

```
cd client/
npm install
cd ..
```

4. Asenna end to end testit

```
cd e2e_tests/
npm install
cd ..
```


## Asennus paikallisesti dockeriin

Projekti sisältää linux ja mac ympäristöissä toimivan skriptin docker asennukseen:

```
./docker-setup.sh
```

Skripti luo ja käynnistää paikallisen docker imagen ja sammuttaa ja poistaa sen lopuksi

Docker imagen voi luoda myös manuaalisesti projektin kansiossa komennolla

```
docker build --build-arg PUBLIC_URL=/kierratysavustin -t kierratysavustin-local .
```

## Ympäristömuuttujat
Kierrätys-info-api vaatii toimiakseen api-avaimen. Paikallisessa asennuksessa avain tulee sijoittaa .env -tiedostoon server-kansiossa. Staging- ja tuotantopalvelimilta .env tiedoston sijainti on määritetty sovelluksen käynnistävässä docker-compose.yml -tiedostossa.


## Käynnistysohjeet

### Paikallinen (Ei kontissa)
Sovelluksen paikallista käynnistämistä varten on hyvä avata kolme erillistä komentorivi-ikkunaa (tietokantaa, frontendiä ja backendiä varten). 

Kehitysaikainen tietokanta (mongodb) käynnistetään *server*-kansiossa komennolla `npm run start:mongo` (docker ja docker-compose tulee olla asennettuna. Komento tekee mongo kansiossa docker-compose up ja lopettaessa docker-compose down)

Backend käynnistetään *server*-kansiossa seuraavin komennoin:
`npm start` kun devataan
`npm run start:test` kun testataan (kannan tyhjentävä api-resurssi)
Tuotantoversio käynnistetään komennolla `npm run start:prod`

Frontend käynnistetään *client*-kansiossa komennolla `npm start`

Tämän jälkeen sovelluksen tulisi pyöriä selaimen osoitteessa http://localhost:3000/

Repon juuressa on myös [screenrc tiedosto](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/.screenrc). Jos [Screen](https://www.gnu.org/software/screen/) on konfiguroitu käyttämään kyseistä tiedostoa, tapahtuu paikallinen käynnistäminen käynnistämällä terminaalissa screen komennolla `screen`

### Paikallinen (Kontti)

Stagingia imitoivan buildin saa ajettua juurikansiossa komennolla `./docker-setup.sh`
 
(komento luo uuden docker imagen, käynnistää sen ja mongo tietokannan. Server käynnistetään antamalla sille baseUrl=/kierratysavustin, jolloin sovelluksen osoitteeseen lisätään /kierrätysavustin, kuten staging serverillä. Serverille annetaan myös NODE_ENV=production, jolloin serverin config.js tiedostossa tiedetään käyttää oikeaa tietokantaosoitetta. 
 
### Staging ja Tuotanto

Stagingiin ja tuotantoon julkaiseminen tapahtuu samalla tavalla. Github repositorioon on määritelty [Github-actions tiedostot](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/tree/main/.github/workflows). 

[staging_pull_request.yml](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/.github/workflows/staging_pull_request.yml): Kun luodaan pull request Staging haaraan niin Github ajaa haaralle kaikki testit. Pull requestissa ilmoitetaan, jos testit eivät mene läpi

[staging_push.yml](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/.github/workflows/staging_push.yml): Kun staging haaraan pusketaan, ajetaan kaikki testit ja niiden mennessä läpi luodaan Docker-kontti, joka pusketaan Docker Hubiin. Staging serveri tarkkailee Docker Hubia ja vetää muutoksen huomatessaan sovelluksen uuden version pyörimään serverille.

[main_push.yml](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/blob/main/.github/workflows/main_push.yml): Kun main haaraan pusketaan. Samat temput kuin stagingissa, mutta julkaisu tuotannon serverille.
