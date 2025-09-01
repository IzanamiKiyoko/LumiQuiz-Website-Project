import { express, cors, PORT, connectDB, logger } from "./config/imports.js";

// Kết nối DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
