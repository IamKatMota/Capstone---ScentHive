# 🌿 Scent Hive - A Fragrance Community

Scent Hive is a **Fragrantica-inspired web application** where users can **explore, review, and track their favorite fragrances**. Built using the **PERN stack (PostgreSQL, Express.js, React, Node.js) & TailwindCSS**, this platform allows fragrance enthusiasts to **discover new scents, share reviews, and build a personal collection**.

## **🚀 Features**
✅ **User Authentication** - Sign up, log in, and manage your profile  
✅ **Fragrance Database** - Browse perfumes with detailed scent notes, brand info, and user reviews  
✅ **User Reviews & Ratings** - Leave written reviews and rate fragrances  
✅ **Wishlist & Collection** - Save fragrances to your personal collection or wishlist  
✅ **Search & Filters** - Find scents by brand, notes, or rating  
✅ **Admin Dashboard** – Full user and content management for site administrators  
  

## **🛠️ Tech Stack**
- **Frontend:** React, React Router, TailwindCSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JSON Web Tokens (JWT), bcrypt  
- **Deployment:**  
  - 🌐 **Frontend:** [Vercel](https://scenthive.vercel.app/)  
  - 🔧 **Backend:** [Render](https://scenthive.onrender.com)


### **🛠 API Endpoints**
### **🔧 User Authentication**
POST   /api/auth/register      # Register a new user  
POST   /api/auth/login         # Log in and receive a token  
GET    /api/users/me           # Fetch current user info  

### **🔧 Fragrance Management**
GET  /api/fragrances         # Get all fragrances
GET  /api/fragrances/:id     # Get fragrance details

### **🔧 User Reviews **
POST   /api/reviews                # Submit a review  
GET    /api/reviews/:fragranceId   # Get reviews for a fragrance  
DELETE /api/reviews/:id            # Delete a review (if owner)  

### **🔧 Admin (Protected) **
GET    /api/admin/users                   # View all users  
PATCH  /api/admin/users/:id/promote       # Promote user to admin  
PATCH  /api/admin/users/:id/demote        # Demote admin to user  
DELETE /api/admin/users/:id               # Delete a user  

GET    /api/admin/reviews                 # View all reviews  
PUT    /api/admin/reviews/:id             # Edit a review  
DELETE /api/admin/reviews/:id             # Delete a review  

GET    /api/admin/fragrances              # View all fragrances  
PUT    /api/admin/fragrances/:id          # Edit a fragrance  
DELETE /api/admin/fragrances/:id          # Delete a fragrance  

## 🔮 Future Enhancements

Scent Hive is just getting started! Here are some planned features and ideas for expanding the platform’s functionality:

- **👃 Notes Explorer Page**  
  A dedicated page to browse all fragrance notes (e.g., vanilla, bergamot, oud). Clicking a note will show a list of all fragrances that feature it.

- **🧑‍🎨 Perfumers Directory**  
  A searchable directory of all perfumers featured in the database, including their bios, brands they've worked with, and all their listed creations.

- **💬 Community Interactions**  
  - Ability for users to **like** or **react to reviews**  
  - **Comment threads** under reviews for discussion and sharing impressions  
  - Notifications for replies or likes

- **🔖 Tags & Fragrance Categories**  
  Categorize fragrances by season, occasion, longevity, and projection (e.g., “Beast Mode”, “Office Safe”).

- **🎯 Personalized Recommendations**  
  Suggest fragrances based on user preferences, reviews, and what others with similar tastes have rated highly.

- **📈 User Profiles with Public Collections**  
  Let users showcase their collection, wishlist, and reviews publicly — turning profiles into scent diaries.

- **🧭 Fragrance Compare Tool**  
  Compare two or more fragrances side-by-side based on notes, longevity, ratings, and user sentiment.

---

Have an idea or feature you'd love to see? Open an issue or drop a suggestion — Scent Hive is built by and for the fragrance-loving community.