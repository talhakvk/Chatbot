# 🧠 Fırat University Chatbot Assistant

An AI-powered chatbot system providing instant access to academic and administrative information for university students and staff.

![Firat Chatbot Banner](https://dummyimage.com/1200x400/2e2e2e/ffffff&text=Firat+University+AI+Chatbot+Assistant)

## 🚀 About the Project

The Fırat University Chatbot Assistant is an AI-driven solution designed to enable fast and effective access to information such as regulations, course contents, announcements, and guides published by the university. It extracts knowledge from PDF documents and responds to natural language queries in real-time.

## 🎯 Objectives

- Extract knowledge from university documents (PDFs)  
- Answer user questions using natural language processing (NLP)  
- Provide an intuitive and user-friendly interface  
- Store and manage chat history for future reference  
- Ensure a secure and real-time experience  

## 🧩 Features

- ✅ PDF document processing and knowledge extraction  
- ✅ Natural language Q&A system (LLM-based)  
- ✅ Supabase Auth for user registration/login  
- ✅ Real-time chat with Supabase Realtime  
- ✅ Chat history tracking and retrieval  
- ✅ Responsive UI design for desktop and mobile  
- ✅ Role-based access (admin & user)  
- ✅ Encrypted password and secure data handling  

## 🛠️ Technologies Used

| Layer               | Technologies                            |
|---------------------|------------------------------------------|
| **Frontend**        | Next.js, React, HTML5, CSS3, Bootstrap   |
| **Backend**         | Next.js API Routes, Node.js              |
| **Database**        | Supabase (PostgreSQL)                    |
| **Authentication**  | Supabase Auth                            |
| **LLM Service**     | AnythingLLM, Repocloud                   |
| **Deployment**      | Vercel, Repocloud                        |

## 🌐 Live Demo

You can try the live version of the project here:  
👉 [https://chatbot-two-orcin.vercel.app/](https://chatbot-two-orcin.vercel.app/)


## 🖼️ UI Screenshots (optional)
Consider adding actual UI screenshots here:

/screenshots/login.png

/screenshots/chat-interface.png

## 📂 System Architecture

```text
User ↔️ Frontend (Next.js + React)
             ↕️
       Backend API Routes (Node.js)
             ↕️
     🗂️ Supabase DB + 🧠 LLM (AnythingLLM)
```

## 📦 Getting Started (Development Setup)

```bash 
# Clone the repository
git clone https://github.com/talhakvk/Chatbot.git
cd my-next-app

# Install dependencies
npm install

# Start the development server
npm run dev
 ```

## 📜 License

This project is licensed under the **MIT License**. For more details, check the `LICENSE` file.
