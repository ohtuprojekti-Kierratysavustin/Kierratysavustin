#!/bin/bash
cd mongo

echo "Käynnistetään dockerissa mongo ja mongo-express"
# Mongon tulostukset näkyy konsolissa ja
# jäädään odottamaan sammuttamista (Ctrl-C),
docker-compose up

echo ""
echo "Poistetaan mongo ja mongo-express"
# Tämä komento ajetan vasta Ctrl-C jälken
docker-compose down

echo ""
echo ""
echo "mongo ja mongo-express sammutettu ja poistettu!"

# Ctrl-C pitäisi toimia tässä tapauksessa näin, mutta
# joissain tapauksissa Ctrl-C saattaa pysäyttää tämän koko
# skriptin toimnnan. Oikean lopputuloksen näkee siitä, että
# lopuksi tulostuu:
#
# Stopping mongo-express ... done
# Stopping mongo         ... done
#
# Poistetaan mongo ja mongo-express
# Removing mongo-express ... done
# Removing mongo         ... done
# Removing network mongo_default
#
#
# mongo ja mongo-express sammutettu ja poistettu!
#
# Jos näkyy pelkkästään
#
# Stopping mongo-express ... done
# Stopping mongo         ... done
#
# Jää verkkoyhteydet yms. edelleen käyntiin ja tulee ajaa erikseen
# mongo kansiossa komento: docker-compose down
