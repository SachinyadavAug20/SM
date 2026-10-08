# Society Management System (SM)

A web-based Society Management System developed for the Java Fullstack course. The application features a Spring Boot REST API backend and a Next.js frontend, backed by MariaDB using Spring Data JPA.

Team: Sachin yadav, Yash kadam, Akash yadav, and Prince yadav .

---

## 1. Features in Detail

### Society Member Portal
- Authentication: Secure login as a Society Member.
- Maintenance Bills: View monthly maintenance charges and current payment status (PAID or PENDING).
- Maintenance Payment: Dedicated Pay Maintenance button that redirects to Google Pay (pay.google.com) and updates payment status in the database.
- Complaint Management:
  - Submit issues with a title and detailed description (e.g., "Lift not working").
  - Track complaint status in real-time (PENDING / RESOLVED).
- Society Notice Board: View official announcements and circulars posted by the society committee.

### Committee Member Portal
- Authentication: Secure login as a Committee Member.
- Overview Dashboard: Real-time statistics showing total members, paid maintenance count, pending bills count, and unresolved complaints.
- Member Directory & Billing Records: Tabular view of all registered society flats, owner names, emails, maintenance amounts, and payment statuses.
- Complaints Resolution: View all resident complaints and update their status to RESOLVED once addressed.
- Notice Broadcast: Compose and publish society-wide notices instantly visible to all members.

---

## 2. Technology Stack

### Backend
- Language: Java 21 (OpenJDK)
- Framework: Spring Boot 3.3.4
- Data Access: Spring Data JPA (Hibernate ORM)
- Database Driver: MySQL Connector / J
- Build Tool: Apache Maven 3.9+
- Architecture: Layered Controller -> Service -> Repository -> Model design pattern
- Cross-Origin Resource Sharing (CORS): Configured for frontend on http://localhost:3000

### Frontend
- Framework: Next.js 14
- Library: React 18
- Routing: Next.js Pages Router
- Styling: Plain responsive CSS (zero external UI dependencies)

### Database
- Engine: MariaDB / MySQL
- Database Name: student_crud_db
- Auto Schema Generation: Hibernate ddl-auto=update

---

## 3. Installation Guide

### Option A: Arch Linux Installation

Open your terminal and run:

1. Update package database:
```bash
sudo pacman -Syu
```

2. Install Java 21, Maven, Node.js, and npm:
```bash
sudo pacman -S jdk21-openjdk maven nodejs npm
```

3. Set Java 21 as default (if multiple Java versions are present):
```bash
sudo archlinux-java set java-21-openjdk
```

4. Install MariaDB:
```bash
sudo pacman -S mariadb
```

5. Initialize MariaDB data directory (required on Arch Linux before starting service):
```bash
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
```

---

### Option B: Ubuntu / Debian Installation

Open your terminal and run:

1. Update package database:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Java 21, Maven, Node.js, and npm:
```bash
sudo apt install openjdk-21-jdk maven nodejs npm -y
```

3. Install MariaDB Server and Client:
```bash
sudo apt install mariadb-server mariadb-client -y
```

---

## 4. MariaDB Setup and Password Configuration

### 1. Start and Enable MariaDB Service

On both Arch Linux and Ubuntu:

```bash
# Start MariaDB server
sudo systemctl start mariadb

# Enable MariaDB to start on boot
sudo systemctl enable mariadb

# Check status to make sure it is running
sudo systemctl status mariadb
```

### 2. Configure Database, Root Username, and Password

The backend is configured in `backend/src/main/resources/application.properties` with:
- Username: `root`
- Password: `root123`
- Database: `student_crud_db`

To configure this in MariaDB:

1. Connect to MariaDB as system root:
```bash
sudo mariadb
```

2. Inside the MariaDB prompt, run the following SQL statements:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';
CREATE DATABASE IF NOT EXISTS student_crud_db;
FLUSH PRIVILEGES;
EXIT;
```

3. Verify connection with the new username and password:
```bash
mariadb -u root -proot123 -e "SHOW DATABASES;"
```
You should see `student_crud_db` listed in the output.

---

## 5. How to Run the Project

### 1. Start the Backend (Spring Boot)

Navigate to the `backend` directory and run:

```bash
cd backend
mvn clean spring-boot:run
```

The Spring Boot backend will start on:
```
http://localhost:8080
```

On first launch, default sample data (members, committee user, sample notices, and complaints) is automatically seeded into the database.

### 2. Start the Frontend (Next.js)

In a new terminal window, navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The Next.js frontend will start on:
```
http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 6. Preconfigured Demo Accounts

Use these accounts to test the application or use the one-click demo buttons on the login page:

### Committee Member Account
- Role: Committee Member
- Email: `admin@society.com`
- Password: `admin123`
- Permissions: Manage complaints, review member bills, publish notices.

### Society Member Account
- Role: Society Member
- Email: `sachin@society.com`
- Password: `sachin123`
- Permissions: View maintenance bill, pay maintenance via Google Pay, register complaints, view notices.
