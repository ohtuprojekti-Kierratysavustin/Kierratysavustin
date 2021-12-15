# Tekninen velka

Tämän dokumentin tarkoituksena on informoida seuraavaa ryhmää projektin nykyisestä tilasta ja eritellä asioita, joiden koemme tarvitsevan parantelua/korjausta.

# Yleistä asiaa

Asiakkaalta kannattaa kysyä olemassaolevien käyttäjätarinoiden priorisointia. Tästä priorisoinnista saattaa riippua, mihin suuntaan sovelluksen arkkitehtuuria tai yksittäisiä paloja kannattaa jatkokehittää. Esimerkiksi asiakkaalla on toiveena, että tulevaisuudessa käyttäjä voisi kuulua ryhmään. Toimintoja voitaisiin tällöin suorittaa ryhmäkohtaisena. Ryhmän kierrättämisestä saisi tilastoja, ja lähimmät kierrätyspisteet voisi löytää ryhmän perusteella.

## Korjattavat asiat

#### Tuotelistaus puolikkaan sivun näkymässä

Kun tietokoneella selainikkunan asettaa puolikkaan näytön kokoiseksi (tai pienemmäksi), menevät "Hanki"- ja "Kierrätä"-napit päällekkäin.

#### Pitkä kierrätysohje ei näy kokonaisuudessaan

Yksittäisen tuotteen näkymässä kierrätysohjeiden listauksessa pitkä kierrätysohje katkeaa kesken, eikä ohjetta ole mahdollista tarkastella kokonaisuudessaan. Joko ohjelistauksessa tulisi näyttää koko ohje tai vaihtoehtoisesti esimerkiksi ohjetta painamalla tulisi koko ohje näkyviin.

#### Pitkä virhe- tai onnistumisilmoitus peittää kirjautumispainikkeen

Ilmoitus virheestä tai onnistumisesta esitetään sovelluksen yläpalkissa ja mikäli ilmoituksessa on paljon tekstiä, jää oikean ylänurkan kirjautumispainike ilmoituksen alle piiloon.

Ilmoitus olisi hyvä saada näkyviin aina riippumatta, siitä onko scrollattu alas. Nyt ilmoitus näkyy aina sivun yläosassa.

## Paranneltavat asiat

#### Sovelluksen ulkoasu

Sovelluksen ulkoasu ei tällä hetkellä skaalaudu kovin täydellisesti eri kokoisille näytöille. Muun muassa puhelimelta sovellusta käyttäessä yksittäisen tuotteen näkymässä on paljon parannettavaa. Lisäksi yksittäisen tuotteen näkymä alkaa olla hieman sekavan näköinen, sillä siellä on kohtuullisen paljon erilaisia elementtejä.

Käyttöliittymää kehitettäessä on hyvä testata näkymää eri kokoisilla näytöillä, kuten myös eri selaimilla.

#### Kirjautuminen ja rekisteröityminen

Tällä hetkellä rekisteröityessä kysytään käyttäjän salasana kerran, virheiden välttämiseksi sen voisi kysyä kahdesti. Salasanan vahvuudelle voisi asettaa myös paremmat kriteerit.

#### Kuvan/tiedostojen lataaminen

Tarkempi validointi?, sekä erityisesti kattavammat testit

#### Frontend virheenhallinta

Voi kartoittaa olisiko rakennettava yhteneväinen systeemi

#### Frontend tyypityksen parantaminen/lisääminen

## Refaktoroitavat asiat

#### Serverin osoitteiden ja parametrien antamisen yhtenäistäminen

URL:t eivät välttämättä noudata kaikkialla samaa rakennetta. Parametreja saatetaan myös antaa vaihtelevasti joko urlissa tai bodyssa. Voi käydä läpi ja yhtenäistää jos haluaa.

#### Formit

Tällä hetkellä koodissa on kahdenlaisia lomakkeita: on lomakkeita, jotka käyttävät kirjastoa Formik, sekä lomakkeita, jotka käyttävät Reactin omaa Formia. Näiden yhtenäistäminen on ollut backlogilla, mutta sitä ei olla ehditty tekemään.

#### Testit

Joissain testeissä toisteisuutta

Api ja e2e testien erottamista

Kaikkien frontend testien tyypittäminen

#### Riippuvuuksien päivittäminen

Monista riippuvuuksista on käytössä vanha versio ja päivitys olisi hyvä tehdä pikimmiten. Päivitystä yritettiin [tässä haarassa](https://github.com/ohtuprojekti-Kierratysavustin/Kierratysavustin/tree/yarn-kayttoon), jossa yritettiin vaihtaa npm tilalle yarn. Moni päivityksistä ei kuitenkaan ole taaksepäin yhteensopiva ja kyseisen haaran sovellus onkin hajalla. Korjaamista ehdittiin edistämään hieman.
