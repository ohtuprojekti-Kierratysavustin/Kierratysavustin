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
