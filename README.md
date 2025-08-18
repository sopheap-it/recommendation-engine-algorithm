# Recommendation Engine Algorithm

A Netflix-style movie recommendation system built with Next.js, TypeScript, and collaborative filtering algorithms.

## 🎯 **Recent Major Improvements (v2.0)**

### **Fixed Critical Issue: Weak Similarity Validation**
The algorithm now properly ensures that users only receive movie recommendations when they have **genuine similarity** to other users, preventing "fake" recommendations from weakly similar users.

#### **What Was Fixed:**
- ❌ **Before**: Users could get recommendations even with very low similarity scores (0.1, 0.05)
- ❌ **Before**: Movies were recommended without sufficient similar user validation
- ❌ **Before**: No minimum threshold enforcement for recommendation quality
- ✅ **Now**: Strict 20% minimum similarity threshold enforced
- ✅ **Now**: Minimum 2 similar users required for recommendations
- ✅ **Now**: Clear validation that recommendations are based on strong user relationships

#### **New Quality Controls:**
```typescript
// Production-grade thresholds for recommendation quality
private readonly MIN_SIMILARITY_THRESHOLD = 0.2;        // 20% minimum similarity
private readonly MIN_COMMON_RATINGS = 2;                 // 2+ common movies rated
private readonly MIN_SIMILAR_USERS_FOR_RECOMMENDATION = 2; // 2+ similar users needed
private readonly MIN_PREDICTED_RATING = 3.0;            // 3.0+ rating to recommend
```

## 🚀 Features

- **Collaborative Filtering**: Uses Pearson correlation to find similar users
- **Real-time Recommendations**: Get personalized movie suggestions based on user ratings
- **Interactive UI**: Beautiful, responsive interface with movie cards and ratings
- **Algorithm Visualization**: Step-by-step breakdown of how recommendations work
- **User Management**: Switch between different user profiles to see different recommendations
- **Quality Validation**: Ensures recommendations are based on genuine user similarity

## 🏗️ Architecture

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx          # Main homepage with movie recommendations
│   └── re-algorithm/     # Algorithm explanation page
├── components/            # React components
│   ├── movie-card.tsx    # Individual movie display
│   ├── movie-row.tsx     # Horizontal movie list
│   ├── movie-detail-modal.tsx # Detailed movie information
│   └── enhanced-algorithm-viz.tsx # Algorithm visualization
├── lib/
│   ├── core/
│   │   └── collaborative-filtering.core.ts # Core recommendation algorithm
│   ├── data/
│   │   └── mocks.ts      # Sample data (users, movies, ratings)
│   └── types/
│       └── type.ts       # TypeScript type definitions
```

## 🔧 How It Works

### **1. User Similarity Calculation**
- Uses **Pearson Correlation Coefficient** to measure user similarity
- Requires **minimum 2 common movie ratings** between users
- Enforces **20% minimum similarity threshold** for reliable recommendations

### **2. Recommendation Generation**
- Finds users with **strong similarity** (≥20%) to current user
- Requires **minimum 2 similar users** who rated the target movie
- Calculates **weighted average rating** based on similarity scores
- Only recommends movies with **predicted rating ≥3.0/5**

### **3. Quality Validation**
- **Confidence scoring** based on similarity strength and user count
- **Similarity distribution analysis** (min, max, average)
- **Clear feedback** on why recommendations succeed or fail
- **No fallbacks** to movie averages or weak similarity

## 📊 Example Output

```
👤 User: Sokna
   Status: ✅ CAN RECEIVE
   Reason: User has 3 similar users with sufficient similarity
   Similar Users: 3
   Recommendations: 4 movies
     1. Inception - Rating: 4.2/5, Confidence: 78.5%
        Reason: Based on 3 similar users (Bong Sak is 65.2% similar)
        Quality: 3 similar users, Avg Similarity: 58.3%

👤 User: Linna  
   Status: ❌ CANNOT RECEIVE
   Reason: User needs at least 2 similar users (found 1)
   Similar Users: 1
   ❌ No recommendations possible: User needs at least 2 similar users (found 1)
```

## 🛠️ Installation & Usage

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recommendation-engine-algorithm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🧪 Testing the Algorithm

Run the test suite to see the improved algorithm in action:

```typescript
import { testImprovedAlgorithm } from '@/lib/core/algorithm-test';
testImprovedAlgorithm();
```

## 📈 Performance & Quality

### **Before (v1.0):**
- ❌ Weak similarity users (0.1, 0.05) could contribute to recommendations
- ❌ No minimum threshold enforcement
- ❌ "Fake" recommendations from unrelated users
- ❌ Poor recommendation quality

### **After (v2.0):**
- ✅ **20% minimum similarity threshold** enforced
- ✅ **2+ similar users required** for recommendations
- ✅ **Quality validation** at every step
- ✅ **Clear feedback** on recommendation success/failure
- ✅ **Production-grade** recommendation quality

## 🌟 Key Benefits

1. **Accurate Recommendations**: Only based on genuine user similarity
2. **Transparent Process**: Clear explanation of why movies are recommended
3. **Quality Control**: Enforced thresholds prevent poor recommendations
4. **User Experience**: Users understand why they see certain suggestions
5. **Scalable**: Production-ready thresholds based on industry research

## 🔬 Technical Details

### **Similarity Calculation**
```typescript
// Pearson Correlation with minimum common ratings
if (commonRatings.length < MIN_COMMON_RATINGS) return 0;

const correlation = (pSum - (sum1 * sum2 / n)) / 
                   Math.sqrt((sum1Sq - sum1²/n) * (sum2Sq - sum2²/n));
```

### **Recommendation Validation**
```typescript
// Only recommend if sufficient similar users exist
if (relevantSimilarUsers.length < MIN_SIMILAR_USERS_FOR_RECOMMENDATION) {
  continue; // Skip this movie
}

// Only recommend if predicted rating meets threshold
if (predictedRating >= MIN_PREDICTED_RATING) {
  // Add to recommendations
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Netflix Research** for similarity threshold insights
- **Amazon Recommendation System** for quality validation approaches
- **Academic Research** on collaborative filtering best practices

---

**Built with ❤️ using Next.js, TypeScript, and collaborative filtering algorithms**
