const AppError = require("../utils/AppError")

function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    })
  }

  if (error.code === "P2002") {
    return res.status(400).json({
      error: "Duplicate record",
    })
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      error: "Signal not found",
    })
  }

  console.error(error)

  return res.status(500).json({
    error: "Internal server error",
  })
}

module.exports = errorHandler