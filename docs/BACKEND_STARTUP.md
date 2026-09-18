# Backend startup

## Requirements

- Java 21
- Maven 3.9 or later

The API stores local data in `backend/data/food-journal.db`

## Configure payment

Copy `backend/.env.example` to `backend/.env` only when Stripe checkout is needed

```sh
cp backend/.env.example backend/.env
```

Set `STRIPE_SECRET_KEY` in `backend/.env`

## Start the API on macOS or Linux

From the project root, run

```sh
./run-mac.sh
```

This command downloads runtime dependencies, compiles the server, and starts the API at `http://localhost:8081/api`

## Start only the backend

```sh
cd backend
mvn -q dependency:copy-dependencies -DoutputDirectory=lib -DincludeScope=runtime
javac -cp "lib/*" -d out src/main/java/com/foodjournal/api/*.java
java -cp "out:lib/*" com.foodjournal.api.FoodJournalServer
```

## Check that the API is running

```sh
curl http://localhost:8081/api/health
```

The expected response contains `"status":"ok"`

## Stop the API

Press `Ctrl+C` in the terminal that is running the server
