
const multer = require("multer");
// Serverless-friendly memory storage
const storage = multer.memoryStorage();
// Multer instance
const upload = multer({ storage });
module.exports = { upload };
