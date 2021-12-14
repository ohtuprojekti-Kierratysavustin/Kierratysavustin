# Tekninen velka

Tämän dokumentin tarkoituksena on informoida seuraavaa ryhmää projektin nykyisestä tilasta ja eritellä asioita, joiden koemme tarvitsevan parantelua/korjausta.


## Korjattavat asiat

#### Tuotelistaus puolikkaan sivun näkymässä

Kun tietokoneella selainikkunan asettaa puolikkaan näytön kokoiseksi (tai pienemmäksi), menevät "Hanki"- ja "Kierrätä"-napit päällekkäin.

#### Pitkä kierrätysohje ei näy kokonaisuudessaan

Yksittäisen tuotteen näkymässä kierrätysohjeiden listauksessa pitkä kierrätysohje katkeaa kesken, eikä ohjetta ole mahdollista tarkastella kokonaisuudessaan. Joko ohjelistauksessa tulisi näyttää koko ohje tai vaihtoehtoisesti esimerkiksi ohjetta painamalla tulisi koko ohje näkyviin.

#### Pitkä virhe- tai onnistumisilmoitus peittää kirjautumispainikkeen

Ilmoitus virheestä tai onnistumisesta esitetään sovelluksen yläpalkissa ja mikäli ilmoituksessa on paljon tekstiä, jää oikean ylänurkan kirjautumispainike ilmoituksen alle piiloon.



## Paranneltavat asiat

#### Sovelluksen ulkoasu

Sovelluksen ulkoasu ei tällä hetkellä skaalaudu kovin täydellisesti eri kokoisille näytöille. Muun muassa puhelimelta sovellusta käyttäessä yksittäisen tuotteen näkymässä on paljon parannettavaa. Lisäksi yksittäisen tuotteen näkymä alkaa olla hieman sekavan näköinen, sillä siellä on kohtuullisen paljon erilaisia elementtejä.

#### Kirjautuminen ja rekisteröityminen

Tällä hetkellä rekisteröityessä kysytään käyttäjän salasana kerran, virheiden välttämiseksi sen voisi kysyä kahdesti.

#### Kuvan/tiedostojen lataaminen

Tarkempi validointi?, sekä erityisesti kattavammat testit

## Refaktoroitavat asiat

#### Formit

Tällä hetkellä koodissa on kahdenlaisia lomakkeita: on lomakkeita, jotka käyttävät kirjastoa Formik, sekä lomakkeita, jotka käyttävät Reaction omaa Formia. Näiden yhtenäistäminen on ollut backlogilla, mutta sitä ei olla ehditty tekemään.
