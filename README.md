# 🌿 Scent Hive - A Fragrance Community

Scent Hive is a **Fragrantica-inspired web application** where users can **explore, review, and track their favorite fragrances**. Built using the **PERN stack (PostgreSQL, Express.js, React, Node.js)**, this platform allows fragrance enthusiasts to **discover new scents, share reviews, and build a personal collection**.

## **🚀 Features**
✅ **User Authentication** - Sign up, log in, and manage your profile  
✅ **Fragrance Database** - Browse perfumes with detailed scent notes, brand info, and user reviews  
✅ **User Reviews & Ratings** - Leave written reviews and rate fragrances  
✅ **Wishlist & Collection** - Save fragrances to your personal collection or wishlist  
✅ **Search & Filters** - Find scents by brand, notes, or rating  
✅ **Community Engagement** - Comment on reviews and interact with other users  

## **🛠️ Tech Stack**
- **Frontend:** React, React Router, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JSON Web Tokens (JWT), bcrypt  
- **Hosting:** Frontend on Vercel, Backend on Render  

## **📦 Installation & Setup**
### **🔧 Prerequisites**
- Install **Node.js** and **PostgreSQL** on your machine

### **🛠 API Endpoints**
### **🔧 User Authentication**
POST /api/auth/register  # Register a new user
POST /api/auth/login     # Log in and receive a token
GET  /api/users/me       # Fetch logged-in user data

### **🔧 Fragrance Management**
GET  /api/fragrances         # Get all fragrances
GET  /api/fragrances/:id     # Get fragrance details
POST /api/fragrances         # Add a new fragrance (Admin only)

### **🔧 User Reviews and Comments**
POST   /api/reviews                # Submit a review
GET    /api/reviews/:fragranceId   # Get reviews for a fragrance
DELETE /api/reviews/:id            # Delete own review
