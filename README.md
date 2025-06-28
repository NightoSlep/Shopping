# 🛒 Technology Store Web Application

This is a fullstack web application for a technology e-commerce store.  
Built with **Angular** (frontend) and **NestJS** (backend), using **PostgreSQL** as the database. Cloudinary is used for image uploads, and Google OAuth2 for authentication.

---

## 📁 Project Structure

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
**📦 Install dependencies**
cd backend
npm install

**🔐 Configure environment variables**
Create a .env file in /backend directory. Example:

JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
**Adjust values to match your local or production setup.**

**🧪 Run database migrations (if needed) and seed data**
#Run the seed script
npm run seed

**▶️ Start the backend server**
npm run start:dev

**Frontend**
**📦 Install dependencies**
cd frontend
npm install

**⚙️ Configure environment variables**
Check or create the environment file at:
bash
Copy
Edit
src/environments/environment.ts

**▶️ Start the Angular development server**
bash
Copy
Edit
ng serve

You can now access the full app by navigating to the frontend URL. It will communicate with your backend via the configured apiUrl.
