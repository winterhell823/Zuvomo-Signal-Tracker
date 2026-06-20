const express = require("express")
const cors = require("cors")

const signalRoutes = require("./routes/signalRoutes")
const notFound = require("./middlewares/notFound")
const errorHandler = require("./middlewares/errorHandler")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok" })
})

app.use("/api/signals", signalRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app