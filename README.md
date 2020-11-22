# Trivia

## Installation

### Database

1. Set up a PostgreSQL database
2. Set up the corresponding DB env variables in `backend/env` or in command line scripts
3. Create the tables and indices from `backend/db/definitions/db.sql`

### Code installation
```
cd frontend
npm i
cd ../backend
npm i
```

## Running

### Development
This will run the frontend on localhost:3001 and the frontend on localhost:3000:

```
cd frontend
npm start
```

```
cd backend
npm run start:dev
```