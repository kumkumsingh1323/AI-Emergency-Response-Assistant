# AI Emergency Response Assistant

This is a complete, hackathon-ready web application designed to help emergency responders process incoming reports and manage incidents using AI.

## Technologies Used
- Frontend: React + Vite + Tailwind CSS + Leaflet Maps
- Backend: Node.js + Express
- Database: MongoDB
- AI: Google Gemini API

## Prerequisites
1. **Node.js**: Ensure Node.js is installed.
2. **MongoDB**: You need a running MongoDB instance. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a free cloud database. Get your connection string (URI).
3. **Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/).

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and set your `MONGODB_URI` and `GEMINI_API_KEY`.*
4. (Optional) Load sample demo data:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Demo Scenario Walkthrough
Once both servers are running:
1. Open the Frontend app in your browser (usually `http://localhost:5173`).
2. Go to the "Submit Report" page.
3. Use the **Hackathon Demo Prompts** at the bottom to submit sequential reports about the "Velachery MRTS" incident.
4. Watch how the AI automatically groups these separate text messages into a single continuously updating incident rather than creating 5 different incidents.
5. Go back to the Dashboard to see real-time updates and the map view.
