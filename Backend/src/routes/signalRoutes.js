const express = require("express")

const {
  createSignalController,
  getSignalsController,
  getSignalController,
  getSignalStatusController,
  deleteSignalController,
} = require("../controllers/signalController")

const router = express.Router()

router.post("/", createSignalController)
router.get("/", getSignalsController)
router.get("/:id/status", getSignalStatusController)
router.get("/:id", getSignalController)
router.delete("/:id", deleteSignalController)

module.exports = router