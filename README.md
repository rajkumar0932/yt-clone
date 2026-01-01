# Video Hosting Backend 

A robust and scalable backend for a video hosting platform similar to YouTube. Built with **Node.js**, **Express.js**, and **MongoDB**, this project features a complete set of RESTful APIs for managing videos, users, tweets, playlists, and social interactions like comments and likes.

## 🚀 Features

### 👤 User Management
* **Authentication**: Secure Signup, Login, and Logout using **JWT** (Access & Refresh Tokens) and **bcrypt** for password hashing.
* **Profile**: Update user details, avatar, and cover image.
* **Security**: Standard practices including password encryption and secure cookie handling.

### 📹 Video Management
* **Uploads**: Upload videos and thumbnails seamlessly using **Multer** and **Cloudinary**.
* **Publishing**: Toggle video publication status (public/private).
* **CRUD Operations**: Create, Read, Update, and Delete videos.

### 📱 Social Interaction
* **Comments**: Add, update, and delete comments on videos.
* **Likes**: Toggle likes on videos, comments, and tweets.
* **Subscriptions**: Subscribe/Unsubscribe to channels and view subscriber lists.
* **Tweets**: Create and manage text-based tweets/posts.

### 📂 Organization
* **Playlists**: Create playlists, add/remove videos, and manage playlist visibility.
* **Dashboard**: View channel statistics including total views, subscribers, video counts, and likes.
* **Search & History**: Watch history tracking and aggregated user data.

## 🛠️ Tech Stack

* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
* **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcrypt](https://www.npmjs.com/package/bcrypt)
* **File Storage**: [Cloudinary](https://cloudinary.com/)
* **File Upload**: [Multer](https://www.npmjs.com/package/multer)
* **Utilities**: `cookie-parser`, `cors`, `dotenv`

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/rajkumar0932/yt-clone.git](https://github.com/rajkumar0932/yt-clone.git)
cd yt-clone
