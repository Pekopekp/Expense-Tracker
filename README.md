# Personal Expense Tracker

A full-stack, aesthetically premium web application built with **Next.js (App Router)**, **FastAPI**, and **SQLite**.

## 📁 Project Structure
- `frontend/` - Next.js React application featuring a glassmorphic UI, responsive dashboard, and Recharts.
- `backend/` - FastAPI Python application with JWT authentication and SQLAlchemy ORM.

## 🛠 Prerequisites
- Node.js (v18+)
- Python (3.9+)

---

## 🚀 Setup Instructions

### 1. Backend Setup (FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables (.env)**:
   - Create a file named `.env` in the `backend/` folder.
   - Copy the contents from `.env.example` into `.env`.
   - The default configuration uses a local SQLite database (`expense_tracker.db`), so no complex database setup is required!
5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will run on `http://localhost:8000`. API docs are available at `http://localhost:8000/docs`.*

### 2. Frontend Setup (Next.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Environment Variables (.env)**:
   - Create a file named `.env.local` in the `frontend/` folder.
   - Copy the contents from `.env.local.example` into `.env.local`.
4. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

---


   - In the hosting provider's dashboard, go to the "Environment Variables" section.
   - Add `NEXT_PUBLIC_API_URL` to your frontend host.
   - Add `SECRET_KEY` and `DATABASE_URL` (if using a production database like PostgreSQL instead of SQLite) to your backend host.
