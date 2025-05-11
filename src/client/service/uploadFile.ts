interface UploadResponse {
  success: boolean
  message: string
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  if (!file) {
    throw new Error('No files to upload')
  }

  const formData = new FormData()

  formData.append('file', file, file.name)

  try {
    const response = await fetch('/api/upload-single', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string }
      throw new Error(errorData.error || 'Upload failed')
    }

    const result = (await response.json()) as UploadResponse
    return result
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
