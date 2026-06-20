import api from "./api"

export async function getSignals() {
  const response = await api.get("/api/signals")
  return response.data
}

export async function getSignal(id) {
  const response = await api.get(`/api/signals/${id}`)
  return response.data
}

export async function getSignalStatus(id) {
  const response = await api.get(`/api/signals/${id}/status`)
  return response.data
}

export async function createSignal(payload) {
  const response = await api.post("/api/signals", payload)
  return response.data
}

export async function deleteSignal(id) {
  const response = await api.delete(`/api/signals/${id}`)
  return response.data
}