# Forkcast - Smart Meal Planner & AI Nutrition Assistant

A comprehensive full-stack React and Express application designed to help households manage their kitchen inventory, discover personalized recipes, track nutrition, and generate dynamic AI-powered meal recommendations. The app actively works to reduce food waste, align with daily macro targets (protein/fat/carbs), and adapt meals based on the user's daily training/activity schedule.

## Core Features

### 1. AI-Powered Recipe Discovery (Gemini AI)
- **Generative AI Meals:** Uses Google's Gemini AI to dynamically generate personalized recipes based on current preferences, constraints, macros, and inventory.
- **Smart Pantry Scanning:** Utilizes Gemini Vision capabilities to scan photos of your fridge or pantry, automatically detecting and adding items to your inventory.
- **Context-Aware Recommendations:** Automatically tailors meal suggestions depending on the user's daily training logs (e.g., suggesting high-carb meals for "Long/Race Days" and adjusting if the user has already maxed out their daily carb limits).
- **AI Image Generation:** Automatically pre-generates appetizing, high-quality images for newly AI-generated recipes using Gemini's image generation capabilities.

### 2. Intelligent Inventory & Substitution
- **Perishable Tracking & Expiration:** Tracks expiration dates and visually flags items that need to be used soon.
- **Smart Swaps:** Recommends "Smart Swaps" for missing ingredients using items you already own, prioritizing perishables.

### 3. Nutrition & Training Tracking
- **Macro Goals:** Tracks daily macro intake (Carbs, Protein, Fat) against a user's defined goals based on weight and activity level.
- **Adaptive Guidance:** Integrates closely with the AI backend to avoid suggesting high-carb meals if the user has already hit their carb limit for the day, prioritizing what's missing instead.
- **Dietary Constraints:** Supports multi-person households with individual restrictions (Vegan, Keto, Gluten-Free), translating these constraints directly to the AI generation prompt.

### 4. Background Workers & Cloud Infrastructure
- **Server-Side API (`server.ts`):** A robust Node/Express backend that securely proxies all Gemini AI interactions, keeping API keys hidden from the client.
- **Automated Notifications:** Backend services manage offline background cron-style jobs for notifications, tracking expiring ingredients, and reminding users of their weekly plans.
- **Firestore Persistence:** Secure, robust cloud persistence using Firebase Firestore for user profiles, training logs, inventory, and globally generated recipes.

## Technical Architecture

- **Frontend:** React 18 with Vite, TypeScript, Tailwind CSS, and Framer Motion.
- **Backend:** Node.js with Express, compiled via ESBuild.
- **AI Integration:** `@google/genai` (Server-side only).
- **Database:** Firebase Firestore & Firebase Auth.
- **Icons:** Lucide React.
