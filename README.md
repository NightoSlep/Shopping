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

JWT_ACCESS_SECRET=your_jwt_access_secret

JWT_REFRESH_SECRET=your_jwt_refresh_secret

Visit https://console.cloud.google.com/ and Go to https://developers.facebook.com/ to get those ID

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_REDIRECT_URL=https://localhost/api/auth/google/redirect

FACEBOOK_APP_ID=your_facebook_app_id

FACEBOOK_APP_SECRET=your_facebook_app_secret

FACEBOOK_REDIRECT_URL=https://localhost/api/auth/facebook/redirect

# Facebook OAuth
FACEBOOK_APP_ID=675946521577798
FACEBOOK_APP_SECRET=bd2e7890203f4210829f790be4c1969d
FACEBOOK_REDIRECT_URL=https://localhost/api/auth/facebook/redirect

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
