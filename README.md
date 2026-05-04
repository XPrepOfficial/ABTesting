# ab-testing-service

Minimal, production-ready A/B testing microservice. Deterministic bucketing via MD5 hashing — no randomness, no modulo tricks.

---

## How Bucketing Works

```
bucket = md5(userId + experimentKey)[0]   // → one hex char: 0–f (16 buckets)
variant = experiment.bucketMap[bucket]    // → "A" | "B" | "Control" | …
```

Same `userId + experimentKey` always resolves to the same variant.

---

## Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: MongoDB (via Mongoose 7)
- **Hashing**: Node built-in `crypto` (MD5) — zero extra deps
- **Cache**: In-memory `Map` with 30-second TTL

---

## Local Setup

```bash
cp .env.example .env
npm install
npm run seed    # seed E1 and E2 demo experiments
npm start
```

Requires a running MongoDB at `MONGODB_URI` (default: `mongodb://localhost:27017/ab_testing`).

For dev with auto-reload:

```bash
npm run dev
```

---

## Docker

```bash
docker compose up --build
# then seed:
docker compose exec app node scripts/seed.js
```

---

## API

### `GET /health`
```json
{ "status": "ok", "ts": "2026-04-24T10:00:00.000Z" }
```

---

### `GET /api/variant?userId=&experimentKey=`

Assigns a single user to a variant.

```bash
curl "http://localhost:3000/api/variant?userId=user-42&experimentKey=E1"
```

```json
{ "variant": "A" }
```

---

### `POST /api/variants`

Bulk variant resolution — one DB round-trip for N experiments.

```bash
curl -X POST http://localhost:3000/api/variants \
  -H "Content-Type: application/json" \
  -d '{ "userId": "user-42", "experiments": ["E1", "E2"] }'
```

```json
{ "E1": "A", "E2": "Control" }
```

---

### `POST /api/experiment`

Create or update an experiment (upsert by `experimentKey`).

```bash
curl -X POST http://localhost:3000/api/experiment \
  -H "Content-Type: application/json" \
  -d '{
    "experimentKey": "E3",
    "enabled": true,
    "bucketMap": {
      "0": "A", "1": "A", "2": "A", "3": "A",
      "4": "A", "5": "A", "6": "A", "7": "A",
      "8": "B", "9": "B", "a": "B", "b": "B",
      "c": "Control", "d": "Control", "e": "Control", "f": "Control"
    }
  }'
```

**Validation**: `bucketMap` keys must be hex chars `0`–`f`. Invalid keys return `400`.

---

## Assignment Rules

| Condition                        | Returned Variant |
|----------------------------------|-----------------|
| Experiment not found             | `"Control"`     |
| Experiment disabled              | `"Control"`     |
| Bucket not in `bucketMap`        | `"Control"`     |
| Normal hit                       | value from map  |

---

## Collections

### `experiments`
| Field           | Type    | Notes                          |
|-----------------|---------|--------------------------------|
| `experimentKey` | String  | Unique, indexed                |
| `enabled`       | Boolean | Toggle without deleting        |
| `bucketMap`     | Map     | Keys: `0`–`f`, Values: variant |
| `createdAt`     | Date    |                                |
| `updatedAt`     | Date    |                                |

### `experiment_logs`
| Field           | Type   | Notes                     |
|-----------------|--------|---------------------------|
| `userId`        | String |                           |
| `experimentKey` | String |                           |
| `variant`       | String |                           |
| `bucket`        | String | Single hex char           |
| `timestamp`     | Date   |                           |

Indexes: `(userId, experimentKey)`, `(experimentKey, timestamp DESC)`

---

## Cache

Experiments are cached in-process for **30 seconds**. Cache is invalidated on `POST /api/experiment`. Negative lookups (unknown keys) are also cached to prevent DB storms.

---

## Project Structure

```
ab-testing-service/
├── src/
│   ├── app.js                         # Express wiring + server start
│   ├── config/
│   │   ├── database.js                # Mongoose connect
│   │   └── cache.js                   # In-memory TTL cache
│   ├── models/
│   │   ├── experiment.model.js
│   │   └── experimentLog.model.js
│   ├── services/
│   │   ├── hashing.service.js         # getBucket(userId, key) → hex char
│   │   ├── experiment.service.js      # DB + cache reads/writes
│   │   └── assignment.service.js      # Orchestrates hash → variant + logging
│   ├── controllers/
│   │   ├── variant.controller.js
│   │   └── experiment.controller.js
│   ├── routes/
│   │   ├── variant.routes.js
│   │   └── experiment.routes.js
│   └── middleware/
│       ├── asyncHandler.js
│       └── errorHandler.js
├── scripts/
│   └── seed.js
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── package.json
```
