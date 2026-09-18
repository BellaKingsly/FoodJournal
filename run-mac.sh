#!/bin/bash
set -e
cd "$(dirname "$0")"
if [[ -f backend/.env ]]; then
	set -a
	source backend/.env
	set +a
fi
if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
	echo "Warning: STRIPE_SECRET_KEY is not set. Menu and cart work, but online payment is disabled."
fi
(cd backend && mvn -q dependency:copy-dependencies -DoutputDirectory=lib -DincludeScope=runtime && rm -rf out && mkdir -p out && javac -cp "lib/*" -d out src/main/java/com/foodjournal/api/*.java && java -cp "out:lib/*" com.foodjournal.api.FoodJournalServer) &
BACKEND_PID=$!
trap 'kill $BACKEND_PID 2>/dev/null || true' EXIT
cd frontend
npm install
npm run dev
