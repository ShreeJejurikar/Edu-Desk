# Edu-Desk
**Simplify note sharing. Empower learning.**

---

## Introduction
Edu-Desk is a full-stack web application designed for students to **create, upload, and share notes securely**. It allows users to easily manage their study materials, collaborate with peers, and access shared notes from anywhere.  

The app is ideal for **students, study groups, and educational communities** who want a lightweight, responsive platform for note sharing. Key features include secure authentication, organized note uploads, and collaborative note access.

---

## Tech Stack
- **Frontend:** Vite React, TailwindCSS   
- **Backend:** Flask, Python  
- **Database:** Cloud Firestore  
- **Storage:** R2  
- **Authentication:** Firebase Authentication (Email & Google)

---

## Project Structure
```text
Edu-Desk/
├── Backend/                    # Flask backend with APIs and utility modules
│   ├── config/                 # Example Firebase keys and config
│   ├── mainapp.py              # Main Flask application
│   ├── routes/                 # API route definitions
│   └── utils/                  # Helper modules for auth, firestore, storage, etc.
├── Frontend/                   # React frontend
│   ├── public/                 # Static assets (icons, manifest, favicon)
│   └── src/
│       ├── components/         # React components (UI elements)
│       ├── contexts/           # React context for auth
│       └── firebase/           # Firebase auth & example config
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```
---

## Prerequisites

Before running Edu-Desk locally, make sure you have the following installed:

### Tools & Environment
- **Node.js** (v16+ recommended)  
  - [Download Node.js](https://nodejs.org/)  
  - Includes `npm`, which is required for frontend dependencies.

- **Python** (v3.9+ recommended)  
  - [Download Python](https://www.python.org/)  
  - Make sure `pip` is installed.

- **Git**  
  - For cloning the repository.  
  - [Download Git](https://git-scm.com/)

---

### Firebase & R2 Storage
To use Edu-Desk fully, you need accounts and setup for:

1. **Firebase**  
   - Create a project in [Firebase Console](https://console.firebase.google.com/)  
   - Enable **Authentication** (Email/Password and Google Sign-In)  
   - Setup **Cloud Firestore**  
   - Obtain your **Firebase config** for frontend (`firebase.example.js`)  

2. **R2 Storage (Cloudflare R2)**  
   - Create a bucket for storing uploaded notes  
   - Obtain **Access Key ID** and **Secret Access Key**

  ---

  ## Installation / Setup

Follow these steps to run Edu-Desk locally:

### 1. Clone the repository

```bash
git clone https://github.com/ShreeJejurikar/Edu-Desk.git
cd Edu-Desk
```
### 2. Backend Setup

Navigate to the backend folder:
```bash
cd Backend
```
Install backend dependencies:
```bash
pip install -r requirements.txt
```
Copy the example file:
```bash
cp .env.example .env
```
Run the backend server:
```bash
python mainapp.py
```
The backend will start (default: http://127.0.0.1:5000).

### 3. Frontend Setup

Navigate to the frontend folder:
```bash
cd ../Frontend
```
Install dependencies:
```bash
npm install
```
Copy the Firebase config:
```bash
cp src/firebase/firebase.example.js src/firebase/firebase.js
```
Fill in your Firebase project config from the Firebase Console.

Start the development server:
```bash
npm run dev
```

---

## Usage

Once both the backend and frontend are running:

1. Open the frontend in your browser:  
`http://localhost:5173`

2. **Sign up or log in** using Firebase Authentication (Email/Password or Google Sign-In).

3. After logging in, you can:  
- **Upload notes** (PDFs, images, or documents)  
- **View and manage** your uploaded notes from the dashboard  
- **Access shared notes** uploaded by other users  

4. The backend runs on:  
`http://localhost:5000/`

This handles API requests for authentication, file uploads, and Firestore interactions.

---
