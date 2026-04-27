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
  const downloadUrl = `${API_URL}/download/${documentId}`
  window.open(downloadUrl, '_blank')
}

// UPI Payment Functions
export const initiateUPIPayment = async ({ documentId, provider, amount = 20 }) => {
  try {
    const response = await apiClient.post('/payment/upi/generate', {
      documentId,
      provider,
      amount,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const verifyPayment = async ({ transactionRef, documentId }) => {
  try {
    const response = await apiClient.post('/payment/upi/verify', {
      transactionRef,
      documentId,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getPaymentStatus = async ({ documentId }) => {
  try {
    const response = await apiClient.get('/payment/upi/status', {
      params: { documentId },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export default apiClient
