export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error('No file provided')
  }

  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.txt')) {
    return extractTextFromTxt(file)
  } else if (fileName.endsWith('.pdf')) {
    throw new Error('PDF extraction currently requires backend support. Please use .txt or paste text directly.')
  } else if (fileName.endsWith('.docx')) {
    throw new Error('DOCX extraction currently requires backend support. Please use .txt or paste text directly.')
  } else {
    throw new Error('Unsupported file format. Please use .txt files.')
  }
}

async function extractTextFromTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        if (!text || !text.trim()) {
          reject(new Error('File is empty'))
        } else {
          resolve(text.trim())
        }
      } catch (error) {
        reject(new Error('Failed to read file: ' + error.message))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

