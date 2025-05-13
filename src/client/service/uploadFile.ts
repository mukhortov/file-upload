const MAX_FILE_SIZE = 5 * 1024 * 1024

interface UploadResponse {
  success: boolean
  message: string
  fileName: string
}

const uploadFile = async (file: File): Promise<UploadResponse> => {
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

    const responseData = (await response.json()) as { message: string }

    return {
      success: response.ok,
      message: responseData.message,
      fileName: file.name,
    } as UploadResponse
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

const uploadChunk = async (
  file: File,
  chunk: Blob,
  chunkIndex: number,
  totalChunks: number,
): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', chunk, file.name)
  formData.append('currentChunkIndex', String(chunkIndex))
  formData.append('totalChunks', String(totalChunks))

  try {
    const response = await fetch('/api/upload-chunk', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = (await response.json()) as { error?: string }
      throw new Error(errorData.error || 'Upload failed')
    }

    const responseData = (await response.json()) as { message: string }

    return {
      success: response.ok,
      message: responseData.message,
      fileName: file.name,
    } as UploadResponse
  } catch (error) {
    console.error('Error uploading chunk:', error)
    throw error
  }
}

const uploadFileInChunks = async (file: File): Promise<UploadResponse> => {
  if (!file) {
    throw new Error('No files to upload')
  }

  const chunkSize = Math.min(file.size, MAX_FILE_SIZE)
  const totalChunks = Math.ceil(file.size / chunkSize)

  const uploadPromises = Array.from({ length: totalChunks }, (_, i) => {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    return uploadChunk(file, chunk, i, totalChunks)
  })

  try {
    const responses = await Promise.all(uploadPromises)
    const allSuccessful = responses.every(response => response.success)

    return {
      success: allSuccessful,
      message: 'File uploaded successfully',
      fileName: file.name,
    }
  } catch (error) {
    console.error('Error uploading file in chunks:', error)
    throw error
  }
}

export const uploadFiles = async (files: FileList): Promise<UploadResponse[]> => {
  if (!files) {
    throw new Error('No files to upload')
  }

  const uploadPromises = Array.from(files).map(file => {
    if (file.size > MAX_FILE_SIZE) {
      return uploadFileInChunks(file)
    } else {
      return uploadFile(file)
    }
  })

  try {
    const responses = await Promise.all(uploadPromises)
    return responses
  } catch (error) {
    console.error('Error uploading files:', error)
    throw error
  }
}
