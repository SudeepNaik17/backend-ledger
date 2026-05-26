require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
connectDB();
PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port 3000`);
});
