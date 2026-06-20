const app = require("./app")
const { PORT } = require("./utils/env")

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})