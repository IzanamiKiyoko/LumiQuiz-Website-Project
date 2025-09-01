import { mkdirSync, writeFileSync } from "fs";
import { execSync } from "child_process";

function createDir(path) {
  mkdirSync(path, { recursive: true });
  console.log(`📁 Created: ${path}`);
}

function createFile(path, content = "") {
  writeFileSync(path, content);
  console.log(`📝 Created: ${path}`);
}

// ==== BACKEND ====
const backendDirs = [
  "backend/src/config",
  "backend/src/controllers",
  "backend/src/models",
  "backend/src/routes",
  "backend/src/middlewares",
  "backend/src/utils",
];

backendDirs.forEach(createDir);

// Backend starter files
createFile(
  "backend/src/server.js",
  `import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 Server running on port \${PORT}\`));
`
);

createFile("backend/.env", "MONGO_URI=mongodb://localhost:27017/mern_db\nPORT=5000\n");
createFile(
  "backend/package.json",
  `{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}`
);

// ==== FRONTEND ====
const frontendDirs = [
  "frontend/src/assets",
  "frontend/src/components",
  "frontend/src/pages",
  "frontend/src/hooks",
  "frontend/src/context",
  "frontend/src/services",
];

frontendDirs.forEach(createDir);

// Frontend starter files
createFile(
  "frontend/src/index.js",
  `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
`
);

createFile(
  "frontend/src/App.js",
  `import React from "react";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
`
);

createFile(
  "frontend/src/pages/Home.js",
  `import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <h1>{message}</h1>;
}

export default Home;
`
);

createFile(
  "frontend/src/services/api.js",
  `import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export default API;
`
);

createFile("frontend/.env", "REACT_APP_API_URL=http://localhost:5000\n");
createFile(
  "frontend/package.json",
  `{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}`
);

console.log("\n✅ MERN structure created!");
console.log("👉 Next steps:");
console.log("1. cd backend && npm install");
console.log("2. cd ../frontend && npm install");
