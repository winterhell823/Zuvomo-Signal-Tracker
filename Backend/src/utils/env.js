require("dotenv").config()

const PORT = Number(process.env.PORT || 5000)

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required")
}

module.exports = {
  PORT,
  DATABASE_URL: process.env.DATABASE_URL,
}