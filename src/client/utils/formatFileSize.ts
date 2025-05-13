export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const kilobyte = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const magnitudeIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte))

  return `${parseFloat((bytes / kilobyte ** magnitudeIndex).toFixed(2))} ${sizes[magnitudeIndex]}`
}
