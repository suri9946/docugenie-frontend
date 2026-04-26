import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return Promise.reject({
        success: false,
        error: 'Backend not running. Please start server at http://localhost:5000',
      })
    }
    if (error.response?.status === 502 || error.response?.status === 503) {
      return Promise.reject({
        success: false,
        error: 'Backend service unavailable',
      })
    }
    return Promise.reject(error.response?.data || { success: false, error: error.message })
  }
)

export const generateDocument = async (payload) => {
  try {
    const formData = new FormData()
    formData.append('title', payload.title || '')
    formData.append('rawText', payload.rawText || '')
    formData.append('subject', payload.subject || '')
    formData.append('style', payload.style || 'formal')

    if (payload.referenceFile) {
      formData.append('referenceFile', payload.referenceFile)
    } else {
      formData.append('referenceText', payload.referenceText || '')
    }

    formData.append('instructions', payload.instructions || '')

    const response = await apiClient.post('/generate', formData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const downloadDocument = (documentId) => {
  const downloadUrl = `${API_URL}/documents/${documentId}/download`
  window.open(downloadUrl, '_blank')
}

export default apiClient
