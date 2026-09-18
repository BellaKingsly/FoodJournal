@echo off
cd /d "%~dp0backend"
if "%STRIPE_SECRET_KEY%"=="" echo Warning: STRIPE_SECRET_KEY is not set. Online payment is disabled.
if exist out rmdir /s /q out
mkdir out
mvn -q dependency:copy-dependencies -DoutputDirectory=lib -DincludeScope=runtime
javac -cp "lib/*" -d out src\main\java\com\foodjournal\api\FoodJournalServer.java
start "Food Journal Java API" java -cp "out;lib/*" com.foodjournal.api.FoodJournalServer
cd /d "%~dp0frontend"
npm install
npm run dev
