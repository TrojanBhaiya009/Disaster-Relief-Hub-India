<<<<<<< HEAD
# 🇮🇳 Disaster Relief Hub India

A centralized platform designed to **coordinate disaster relief operations** across India — connecting volunteers, managing resources, and providing real-time disaster insights.

---

## 🌍 Overview

**Disaster Relief Hub India** is a web-based coordination system that enables efficient disaster management by bringing together data, volunteers, and authorities.  
It helps reduce response time, visualize real-time data, and ensure faster communication between communities and responders.

---

## 🚀 Features

- 📊 **Interactive Dashboard** — Real-time statistics on disasters, people affected, volunteers, and resources.
- 🗺️ **Needs Map (Leaflet.js)** — Displays active disaster regions across India with filters by region and status.
- 👨‍👩‍👧‍👦 **Volunteer Registration System** — Secure form to collect and store volunteer details.
- 📩 **Contact Form** — Allows users or organizations to reach out with queries or emergency information.
- 🌗 **Light/Dark Mode** — Modern theme toggle for better accessibility.
- 📈 **Dynamic Chart (Chart.js)** — Visual representation of disaster trends (weekly, monthly, yearly).
- 🧭 **Fully Responsive UI** — Works seamlessly across devices.

---

## 🧠 Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Visualization** | Chart.js, Leaflet.js |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Hosting** | Vercel (Frontend) + Local/Cloud MySQL (Backend) |
| **Version Control** | Git & GitHub |

---


---
## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<TrojanBhaiya009>/Disaster-Relief-Hub-India.git
cd Disaster-Relief-Hub-India-Repo 
Install dependencies
npm install

3️⃣ Configure .env

Create a .env file in the project root and add your MySQL credentials:

DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=reliefhub
PORT=5500

4️⃣ Start the server
node server.js

5️⃣ Visit in browser

Frontend: http://localhost:5500

🧩 API Endpoints
Endpoint	Method	Description
/api/health	GET	Checks database and server health
/api/volunteer	POST	Registers a new volunteer
/api/contact	POST	Stores contact form messages
💾 Database Schema

Volunteers Table

CREATE TABLE volunteers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  state VARCHAR(100),
  city VARCHAR(100),
  skills VARCHAR(255),
  availability VARCHAR(100),
  notes TEXT,
  consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


Contact Messages Table

CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🌐 Deployment

Frontend: Deployed on Vercel

Backend: Node.js + Express server hosted locally or on Render/Heroku

Database: MySQL (local or cloud instance)

📽️ Demo Video

🎥 Coming soon! 

💡 Future Enhancements

Integration with real-time disaster alert APIs

AI-based prediction for resource distribution

Admin dashboard for NGO/government management

SMS/email alert system for critical updates

👥 Contributors

[Nayansh Jain] – Developer & Designer

🏁 Conclusion

The Disaster Relief Hub India is a modern, scalable, and user-friendly solution to enhance disaster response.
By connecting affected communities, volunteers, and coordinators in real time, the platform reduces response time, improves resource allocation, and empowers communities to act effectively during emergencies.

🛠️ License

This project is licensed under the MIT License – feel free to use and improve it!
=======
# Disaster-Relief-Hub-India
Disaster Relief Coordination Hub: Built a system mapping needs and available resources during crisis events, ensuring quick and effective disaster response leveraging local volunteers.
>>>>>>> 5ea757564165624b3aafbc03568d64f1caaa1f09
