# 🎬 VidNova

A modern full-stack video-sharing platform inspired by YouTube, built with the MERN stack. VidNova allows users to upload videos, create playlists, subscribe to channels, interact through likes and comments, and manage their own creator dashboard with a clean, responsive interface.


---

# ✨ Features

VidNova provides a complete video-sharing experience with secure authentication, media uploads, creator tools, playlist management, and interactive community features.

### 👤 Authentication

- Secure JWT authentication
- User registration and login
- Refresh-token authentication
- Protected routes
- Logout

### 🎥 Video Management

- Upload videos with thumbnails
- Edit video details
- Delete videos
- Publish and unpublish videos
- View-count tracking
- Responsive HTML5 video player

### ❤️ Engagement

- Like and unlike videos
- Add comments
- Edit comments
- Delete comments

### 📺 Channels

- Channel profile
- Subscribe and unsubscribe
- Subscriber count
- Channel videos
- Channel playlists

### 📂 Playlists

- Create playlists
- Update playlists
- Delete playlists
- Add videos to playlists
- Remove videos from playlists

### 📊 Creator Dashboard

- Total videos
- Total views
- Total likes
- Total subscribers
- Uploaded-video management

### 👤 User Features

- Watch history
- Liked videos
- Subscriptions
- Update profile
- Update avatar
- Update cover image
- Change password

### 🎨 UI/UX

- Modern responsive interface
- Dark theme
- Loading skeletons
- Toast notifications
- Mobile-friendly layout

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React
- React Hot Toast

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT authentication
- Multer
- Cloudinary
- Cookie Parser
- CORS

---

# 📁 Project Structure

```text
VidNova
│
├── assets
│   └── screenshots
│       ├── channel.png
│       ├── Dashboard.png
│       ├── Home.png
│       ├── Playlist.png
│       ├── Upload.png
│       └── Watch.png
│
├── backend
│   ├── public
│   ├── src
│   │   ├── controllers
│   │   ├── db
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── utils
│   │   ├── app.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── app
│   │   ├── components
│   │   ├── features
│   │   ├── hooks
│   │   ├── pages
│   │   ├── routes
│   │   └── utils
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yashKanzariya876/VidNova.git
cd VidNova
```

---

# Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

# Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

> On Windows Command Prompt, use `copy .env.example .env` instead of `cp .env.example .env`.

---

# 🔑 Environment Variables

## Backend

Create a `.env` file inside the `backend` folder:

```env
PORT=

MONGODB_URI=
DB_NAME=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CORS_ORIGIN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=
```

# 🌍 Deployment

| Service | Platform |
| --- | --- |
| Frontend | Render |
| Backend | Render |
| Database | MongoDB Atlas |
| Media Storage | Cloudinary |

---

# 🔒 Security

- JWT authentication
- Password hashing using bcrypt
- Protected API routes
- Secure cookies
- Input validation
- Authentication middleware

---

# 📈 Future Improvements

- Email verification
- Forgot-password functionality
- Video categories
- Improved recommendation algorithm
- Advanced video search
- Infinite scrolling
- Notifications
- Live streaming
- Video analytics

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a pull request.

---

# 👨‍💻 Author

**Yash Khokhaliya**

- GitHub: https://github.com/YashKhokhaliya

---

⭐ If you found this project useful, consider giving it a **Star** on GitHub!