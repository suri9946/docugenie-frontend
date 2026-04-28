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

// Using native fetch for SSE streaming
export const generateDocument = async (payload, onProgress) => {
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
  formData.append('wordCount', payload.wordCount || '')
  formData.append('customWordCount', payload.customWordCount || '')
  formData.append('generationMode', payload.generationMode || 'draft')

  try {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: "POST",
      body: formData,
      headers: { "Accept": "text/event-stream" }
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || "Failed to generate document");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulatedData = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      accumulatedData += decoder.decode(value, { stream: true });
      const parts = accumulatedData.split("\n\n");

      // Process all complete event blocks
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i].replace(/^data:\s*/, "");
        if (part) {
          try {
            const eventData = JSON.parse(part);
            if (eventData.type === "progress" && onProgress) {
              onProgress(eventData);
            } else if (eventData.type === "success") {
              return eventData.data;
            } else if (eventData.type === "error") {
              throw new Error(eventData.message);
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              console.error("Error parsing SSE JSON:", e);
            } else {
              throw e;
            }
          }
        }
      }
      accumulatedData = parts[parts.length - 1];
    }
    throw new Error("Generation ended before success event was received");
  } catch (error) {
    throw error;
  }
}

export const downloadDocument = (documentId, format = 'docx') => {
  const downloadUrl = `${API_URL}/api/download/${documentId}?format=${encodeURIComponent(format)}`
  window.open(downloadUrl, '_blank')
}

// UPI Payment Functions
export const initiateUPIPayment = async ({ documentId, provider, amount = 20 }) => {
  try {
    const response = await apiClient.post('/api/payment/upi/generate', {
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
    const response = await apiClient.post('/api/payment/upi/verify', {
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
    const response = await apiClient.get('/api/payment/upi/status', {
      params: { documentId },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const createRazorpayOrder = async ({ documentId, amount }) => {
  const response = await apiClient.post('/api/payment/razorpay/order', { documentId, amount })
  return response.data
}

export const verifyRazorpayPayment = async (payload) => {
  const response = await apiClient.post('/api/payment/razorpay/verify', payload)
  return response.data
}

export default apiClient
