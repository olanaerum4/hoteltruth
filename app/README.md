# HotelTruth

Run two terminals:

```bash
# Terminal 1 — backend (Apify + Express)
npm run server

# Terminal 2 — frontend (Vite)
npm run dev
```

Open http://localhost:3456

The `.env` file already has your Apify token set.

## How it works

1. You type a hotel name and hit "Get the truth"
2. The frontend calls `POST /api/analyze` on the Express backend
3. The backend runs the **apify/google-maps-scraper** actor with your query
4. Apify scrapes up to 200 real reviews from Google Maps (~60–120 sec)
5. `server/processor.js` categorises complaints, computes the honest score, and finds what's actually good
6. Results render live in the dashboard

## Honest score formula

- Pull all reviews (newest first)
- Average star rating × 2 → /10 scale
- "Advertised" = Google Maps aggregate rating × 2
- Complaint categories are detected by keyword matching in 1–3★ reviews
