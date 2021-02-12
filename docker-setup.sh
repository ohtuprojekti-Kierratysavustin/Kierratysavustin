docker build --build-arg PUBLIC_URL=/kierratysavustin -t kierratysavustin-local .
docker-compose up -d
echo ""
echo ""
echo "Sovellus pyörii osoitteessa http://localhost:3001/kierratysavustin"
echo "Sammuta sovellus painamalla Enter"
read -p ""
echo ""
docker-compose down
