# 🍽️ FoodHub Frontend

Frontend client for the **FoodHub Meal Marketplace** platform.  
Users can browse meals, place orders, and providers can manage their meals through a modern dashboard UI.

🔗 **Live Site:** https://foodhub-client-six.vercel.app/  

---

# 🚀 Features

### 👤 User Features
✔ Browse all meals  
✔ Search, filter & sort meals  
✔ View meal details  
✔ Add to cart & place orders  
✔ Authentication system (Login/Register)  

### 👨‍🍳 Provider Features
✔ Add new meals  
✔ Update own meals  
✔ Delete meals  
✔ Manage orders  
✔ Provider dashboard  

### 👑 Admin Features
✔ Manage users  
✔ Control meals  
✔ Monitor orders  
✔ Dashboard analytics  

---

# 🛠️ Tech Stack

- **Next.js (App Router)**
- **React.js**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**
- **React Query**
- **JWT Authentication**
- **Vercel Deployment**

---

# 📦 Installation & Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/foodhub-client.git
cd foodhub-client
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://food-hub-server-five.vercel.app/api
```

### 4️⃣ Run development server

```bash
npm run dev
```

App will run on:

```
http://localhost:3000
```

---

# 📁 Project Structure

```
src/
 ┣ app/
 ┣ components/
 ┣ services/
 ┣ hooks/
 ┣ lib/
 ┗ types/
```

---

# 🔐 Authentication Flow

1. User logs in or registers  
2. Backend returns JWT token  
3. Token stored in cookies/local storage  
4. Protected routes verified via middleware  

---

# 🌍 Deployment

This frontend is deployed on **Vercel**.

To deploy manually:

```bash
vercel --prod
```

---

# 📸 Screenshots

*(Add dashboard / homepage screenshots here for better GitHub appearance)*

---

# 🤝 Contribution

Pull requests are welcome.  
For major changes, open an issue first to discuss improvements.

---

# 👨‍💻 Author

**Md Abu Bakar Siddique**  
Full Stack MERN Developer

- LinkedIn: *(add link)*
- Portfolio: *(add link)*

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub  
and share feedback to improve it further!