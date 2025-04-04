# Email Builder - Full Stack Web Application

## Overview

The **Email Builder** project is a full-stack web application that allows users to create email templates dynamically. The application consists of a **React frontend** and a **NestJS backend** with **MongoDB** as the database. Users can edit email content, upload images, and generate downloadable email templates.

## Features

- Fetch email layout from the backend.
- Rich text editing for email title, content, and footer.
- Upload images and store them in the backend.
- Save and retrieve email templates from the database.
- Generate a downloadable email template.

## Tech Stack

### **Frontend (React)**

- React (TypeScript)
- Axios (for API calls)
- React-Quill (for rich text editing)
- React-Dropzone (for file uploads)
- Tailwind CSS (for styling)

### **Backend (NestJS)**

- NestJS (TypeScript)
- MongoDB (via Mongoose)
- Multer (for image uploads)
- AWS S3 (for storing images)
- PM2 (for process management)

### **Database**

- MongoDB (MongoDB Atlas or self-hosted on AWS EC2)

### **Deployment**

- Frontend: **Vercel or AWS S3 + CloudFront**
- Backend: **AWS EC2 (Ubuntu) + PM2 + Nginx**
- Database: **MongoDB Atlas or Self-hosted MongoDB on EC2**

---

## Project Structure

```plaintext
email-builder/
│── backend/ (NestJS)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── email/
│   │   │   ├── email.module.ts
│   │   │   ├── email.controller.ts
│   │   │   ├── email.service.ts
│   │   │   ├── email.schema.ts
│   │   │   ├── email.dto.ts
│   ├── package.json
│── frontend/ (React)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── EmailEditor.tsx
│   ├── package.json
```

---

## Installation & Setup

### **1. Clone the repository**

```bash
git clone https://github.com/your-repo/email-builder.git
cd email-builder
```

### **2. Backend Setup (NestJS)**

```bash
cd backend
npm install
```

#### **Setup Environment Variables (.env file)**

```env
MONGO_URI=mongodb+srv://your-mongodb-uri
PORT=3001
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-s3-bucket
```

#### **Run the NestJS Server**

```bash
npm run start:dev
```

### **3. Frontend Setup (React)**

```bash
cd frontend
npm install
npm start
```

---

## Deployment

### **Backend Deployment on AWS EC2**

1. **Launch an AWS EC2 instance** (Ubuntu 22.04)
2. **Connect to the instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```
3. **Install Node.js and PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   npm install -g pm2
   ```
4. **Clone your repository on EC2:**
   ```bash
   git clone https://github.com/your-repo/email-builder.git
   cd email-builder/backend
   npm install
   ```
5. **Run the backend server using PM2:**
   ```bash
   pm2 start dist/main.js --name email-builder
   ```
6. **Set up Nginx as a reverse proxy:**

   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add the following configuration:

   ```nginx
   server {
       listen 80;
       server_name your-ec2-ip;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Restart Nginx:

   ```bash
   sudo systemctl restart nginx
   ```

### **Frontend Deployment on Vercel**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```
2. **Deploy React App:**
   ```bash
   cd frontend
   vercel --prod
   ```

---

## API Endpoints

| Method | Endpoint                 | Description                       |
| ------ | ------------------------ | --------------------------------- |
| GET    | /email/getEmailLayout    | Fetch email template layout       |
| POST   | /email/uploadImage       | Upload image file                 |
| POST   | /email/uploadEmailConfig | Save email template configuration |

---

## How to Use

1. Open the frontend application.
2. Edit email content using the rich text editor.
3. Upload images to be used in the email.
4. Save the template.
5. Generate and download the final email.

---

## Future Enhancements

✅ Drag & Drop Sections (React DnD)
✅ Text Styling (Colors, Fonts, Alignments)
✅ Preview Email Before Sending

---

## Author

**Lucky Mourya**  
[GitHub](https://github.com/DEveL0perLuckY) | [LinkedIn](https://linkedin.com/in/lucky-mourya-968b6126b)
