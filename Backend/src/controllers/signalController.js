const asyncHandler = require("../utils/asyncHandler")
const {
  createSignal,
  getAllSignals,
  getSignalById,
  getSignalStatusById,
  deleteSignal,
} = require("../services/signalService")

const createSignalController = asyncHandler(async (req, res) => {
  const data = await createSignal(req.body)
  res.status(201).json({ success: true, data })
})

const getSignalsController = asyncHandler(async (_req, res) => {
  const data = await getAllSignals()
  res.json(data)
})

const getSignalController = asyncHandler(async (req, res) => {
  const data = await getSignalById(req.params.id)
  res.json(data)
})

const getSignalStatusController = asyncHandler(async (req, res) => {
  const data = await getSignalStatusById(req.params.id)
  res.json(data)
})

const deleteSignalController = asyncHandler(async (req, res) => {
  await deleteSignal(req.params.id)
  res.json({ success: true })
})

module.exports = {
  createSignalController,
  getSignalsController,
  getSignalController,
  getSignalStatusController,
  deleteSignalController,
}