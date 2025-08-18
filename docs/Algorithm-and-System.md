## Recommendation Engine Assignment

## Team Information

**Group 5**  
**Bachelor of Software Engineering - Year IV Semester I**  
**Major AI Assignment**  
**Academic Year: 2025-2026**

**Lecturer:**
- Chen Sovan

**Team Members:**
- Sopheap Om
- Try Segech
- Nao Sokna

---

### Executive Summary
This document explains the algorithm, architecture, configuration, UI flow, and tuning guidelines for the revamped recommendation engine built with Next.js 15. It uses user‑based collaborative filtering with Pearson correlation and production‑sane thresholds. The same initializer is reused across pages, and per‑movie quality logic is reflected consistently in the UI.

---

### Algorithm Details

1) Similarity (Pearson correlation)

\[ r = \frac{\sum (x - \bar{x})(y - \bar{y})}{\sqrt{\sum (x - \bar{x})^2} \cdot \sqrt{\sum (y - \bar{y})^2}} \]

- Only computed on co‑rated items
- Require at least `SIMILARITY.MIN_COMMON_RATINGS`; else `r = 0`
- Range: −1…1 (we keep non‑negative values that clear the threshold)

2) Rating prediction (weighted average of neighbors who rated the movie)

\[ \hat{r}_{u,i} = \frac{\sum_{v \in N_i(u)} s(u,v)\, r_{v,i}}{\sum_{v \in N_i(u)} s(u,v)} \]

Where `N_i(u)` are similar users of `u` who have rated item `i` and pass `MIN_THRESHOLD`.

3) Confidence score (shown in modal)
- `avgSimilarity = mean(similarity of relevant neighbors)`
- `userCountBonus = min(0.2, 0.05 × neighborCount)`
- `similarityPenalty` reduces score when avgSimilarity is barely above threshold
- `confidence = clamp01(avgSimilarity × (1 − penalty) + userCountBonus)`

4) Quality gates (per movie)
- At least `SIMILARITY.MIN_SIMILAR_USERS` neighbors who rated the movie
- Predicted rating ≥ `RATING.MIN_PREDICTED`

---

### Configuration (Single Source of Truth)
File: `src/lib/config/recommendation-config.ts`

- `SIMILARITY.MIN_THRESHOLD`: 0.2–0.3 (start 0.2)
- `SIMILARITY.MIN_COMMON_RATINGS`: 3–5 (demo can use 2; prefer ≥3 for stability)
- `SIMILARITY.MIN_SIMILAR_USERS`: 2–5 (start 2)
- `PERFORMANCE.MAX_SIMILAR_USERS`: 40–100 (50 used; 40 is a common default)
- `RATING.MIN_PREDICTED`: 3.0–3.5 (raise to 3.5 for higher precision)
- `PERFORMANCE.CONFIDENCE_THRESHOLD`: 0.4–0.6 (0.4 used)

Why these ranges
- Neighborhood size defaults around `k=40` are standard in neighborhood CF (Surprise KNN defaults). See the Surprise docs: [KNN inspired algorithms](https://surprise.readthedocs.io/en/stable/knn_inspired.html)
- Requiring ≥3–5 co‑rated items stabilizes Pearson. See Recommender Systems Handbook (Ricci, Rokach, Shapira).
- Positive/“good” rating cutoffs of 3.5–4.0 are common in MovieLens literature. See GroupLens: [MovieLens](https://grouplens.org/datasets/movielens/).

Tuning guidance
- Offline: grid‑search ranges above; optimize NDCG@K/MAP@K with coverage guardrails
- Online: A/B test 2–3 configs (e.g., `MIN_PREDICTED` 3.0 vs 3.5; `MIN_THRESHOLD` 0.2 vs 0.3)

---

### UI Contract

Home page
- Renders Top‑N recommendations (excludes already rated movies)
- Uses `getRecommendations(userId, MAX_RECOMMENDATIONS)`; sorted primarily by confidence, secondarily by predicted rating

Movie Detail Modal (Algorithm tab)
- Predicted rating and Confidence score
- Recommendation Quality Analysis:
  - Similar Users (count)
  - Avg / Min / Max similarity
  - Overall gate: RECOMMENDABLE vs NOT RECOMMENDABLE
- Enhanced step‑by‑step visualization of the algorithm
- Similar user details can be expanded inline (no separate section)

---

### System Initialization (Reusable)

```ts
// src/lib/data/mocks.ts
export async function initializeRecommendationSystem() {
  const { CollaborativeFiltering } = await import('@/lib/core/collaborative-filtering.core');
  const cf = new CollaborativeFiltering();
  sampleUsers.forEach(u => cf.addUser(u));
  moviesWithRatings.forEach(m => cf.addMovie(m));
  sampleRatings.forEach(r => cf.addRating(r));
  return cf;
}
```

Used by pages

```ts
// src/app/page.tsx
useEffect(() => {
  initializeRecommendationSystem().then(cf => {
    setCf(cf);
    setCurrentUser(sampleUsers[0]);
  });
}, []);
```

---

### References
- Surprise KNN defaults (k≈40): [surprise.readthedocs.io](https://surprise.readthedocs.io/en/stable/knn_inspired.html)
- Recommender Systems Handbook (Springer): best practices for neighborhood CF
- GroupLens / MovieLens datasets and papers: [grouplens.org](https://grouplens.org/datasets/movielens/)
- Herlocker et al., Evaluating Collaborative Filtering Recommender Systems (ACM)
- Amazon item‑to‑item CF (IEEE Internet Computing): Linden et al., 2003

### Technical Resources and Online Articles

 - GeeksforGeeks. What Is a Recommendation Engine and How Does It Work? (2025). `https://www.geeksforgeeks.org/machine-learning/what-is-a-recommendation-engine/`

 - IBM. Collaborative filtering (Think). `https://www.ibm.com/think/topics/collaborative-filtering`

 - W3Schools. Python Tutorial. `https://www.w3schools.com/python/`

---

### Project Structure & Responsibilities

Codebase map (major files)

```
.
├── next.config.ts                       # Next.js config (headers, compression, standalone output)
├── eslint.config.mjs                    # ESLint setup
├── tsconfig.json                        # TypeScript configuration
├── public/                              # Static assets (icons, svgs)
├── docs/
│   ├── Algorithm-and-System             # This document
└── src/
    ├── app/
    │   ├── page.tsx                    # Home page: Top‑N recommendations, opens detail modal
    │   ├── re-algorithm/page.tsx       # Algorithm showcase (education + step-by-step)
    │   ├── globals.css                 # Global styles
    │   └── layout.tsx                  # Root layout (fonts, metadata)
    ├── components/
    │   ├── enhanced-algorithm-viz.tsx  # Step-by-step visualization (neighbors + math + gates)
    │   ├── movie-detail-modal.tsx      # Modal: prediction, confidence, quality metrics, viz
    │   ├── detailed-similarity-calc.tsx# Expandable Pearson math for a user pair
    │   ├── similarity-card.tsx         # Compact similarity summary
    │   ├── algorithm-visualization.tsx # Auxiliary visualization (reference)
    │   └── rating-summary-table.tsx    # Tabular summaries
    └── lib/
        ├── core/
        │   └── collaborative-filtering.core.ts  # CF engine: similarities, predictions, quality, Top‑N
        ├── config/
        │   └── recommendation-config.ts         # Thresholds, performance caps, UI decimals, helpers
        ├── data/
        │   └── mocks.ts                         # sampleUsers/movies/ratings + initializer
        └── types/
            └── type.ts                          # Types for User, Movie, Rating, etc.
```

Responsibilities & interactions
- `src/lib/config/recommendation-config.ts`: single source for thresholds (similarity, minimum common ratings, min predicted) and display decimals.
- `src/lib/core/collaborative-filtering.core.ts`:
  - `findSimilarUsers(userId, k)`: Pearson similarity with minimum common ratings
  - `predictRating(userId, movieId)`: weighted average of relevant neighbors
  - `getRecommendations(userId, n)`: excludes user‑rated movies, applies gates, sorts by confidence then rating
  - `getRecommendationQualityMetrics(userId, movieId)`: neighbor count, avg/min/max similarity, canRecommend
- `src/lib/data/mocks.ts`:
  - `moviesWithRatings`: movies with average and count precomputed
  - `sampleUsers`, `sampleRatings`: demo dataset
  - `initializeRecommendationSystem()`: returns a ready `CollaborativeFiltering` instance
- `src/app/page.tsx`:
  - Initializes system once
  - Renders Top‑N and opens `MovieDetailModal`
  - Supplies per‑movie neighbors so Confidence matches Avg Similarity
- `src/app/re-algorithm/page.tsx`:
  - Education page; mirrors thresholds from config and shows all predictions
- `src/components/movie-detail-modal.tsx`:
  - Shows predicted rating, Confidence, quality metrics
  - Embeds `EnhancedAlgorithmViz`
- `src/components/enhanced-algorithm-viz.tsx`:
  - Similar User Discovery with per‑user “View Details” to expand Pearson math
  - Reflects config thresholds; caps top neighbors for readability

Notes
- Confidence and Avg Similarity use the same per‑movie neighbor set; only rounding can differ.
- Changing any config (e.g., `RATING.MIN_PREDICTED`) uniformly updates gates and displays.

---

### Created by
Group 5 — Bachelor of Software Engineering — Year IV Semester I — Academic Year 2025-2026

Lecturer: Chen Sovan


