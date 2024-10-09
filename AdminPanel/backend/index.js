const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;
const {Quiz} = require('./db');
const mainRouter = require('./routes/index.js')

// Middleware
app.use(cors()); // Enables CORS for requests from  React app
app.use(express.json()); // Parses incoming JSON requests
app.use("/api/v1",mainRouter)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
