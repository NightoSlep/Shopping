# 🛒 Technology Store Web Application

This is a full-stack web application for a technology e-commerce store.  

Built with **Angular** (frontend) and **NestJS** (backend), using **PostgreSQL** as the database. Cloudinary is used for image uploads, and Google OAuth 2.0 is used for authentication.

---

## 📁 Project Structure

### 🖥️ Backend (`/backend`)

- `src/`
  - `product/`
    - `controller/` → Contains route handlers (e.g. GET, POST)
    - `dto/` → Data Transfer Objects (request/response schemas)
    - `entities/` → Database models (typically with decorators like @Entity)
    - `services/` → Business logic, called from controller
    - `product.module.ts` → Main module file that ties everything together
  - `app.module.ts` → Root module
  - `main.ts`

### 🌐 Frontend (`/frontend`)

- `src/app/`
  - `components/`
    - `admin/` → Admin pages (dashboard, product mgmt...)
    - `client/` → Client-facing UI (homepage, product list...)
  - `services/`
    - `admin/` → API services for admin features
    - `client/` → API services for client side
    - `shared/` → Reusable services (e.g., auth, toast)
  - `guards/` → Route guards (auth, role-based access)
  - `interceptor/` → HTTP interceptors (e.g., token injection)
  - `models/` → Interface and types (Product, User...)
  - `shared/` → Shared components (e.g., confirm dialog)
  - `app.component.*` → Root app component (HTML/CSS/TS)

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

#### 📦 Install dependencies

```
cd backend

npm install
```

**🔐 Configure environment variables**

Create a .env file in /backend directory. Example:
```
JWT_ACCESS_SECRET=your_jwt_access_secret

JWT_REFRESH_SECRET=your_jwt_refresh_secret

Visit https://console.cloud.google.com/ and go to https://developers.facebook.com/ to get those ID

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

GOOGLE_REDIRECT_URL=https://localhost/api/auth/google/redirect

FACEBOOK_APP_ID=your_facebook_app_id

FACEBOOK_APP_SECRET=your_facebook_app_secret

FACEBOOK_REDIRECT_URL=https://localhost/api/auth/facebook/redirect

```

**Adjust values to match your local or production setup.**

**🧪 Run database migrations (if needed) and seed data**

#Run the seed script
```
npm run seed
```
**▶️ Start the backend server**
```
npm run start:dev
```
**Frontend**

**📦 Install dependencies**
```
cd frontend

npm install
```
**⚙️ Configure environment variables**

Create the environment file at:

src/environments/environment.ts
```
export const environment = {

  production: false,
  
  googleClientId: 'your_google_client_id',
  
  facebookAppId: 'your_facebook_app_id',
  
  apiUrl: '/api'
  
};
```
**▶️ Start the Angular development server**
```
ng serve
```
You can now access the full app by navigating to the frontend URL. It will communicate with your backend via the configured apiUrl.
