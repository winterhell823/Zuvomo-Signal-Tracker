const app = require("./app");
const { PORT } = require("./utils/env");

console.log("=== ZUVOMO BACKEND STARTED ===");

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
