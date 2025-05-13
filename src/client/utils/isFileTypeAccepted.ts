export const isFileTypeAccepted = (file: File, acceptedFileTypes: string[]): boolean => {
  if (acceptedFileTypes.length === 0) {
    return true
  }

  return acceptedFileTypes.some((type: string) =>
    type.endsWith('/*') ? file.type.startsWith(`${type.split('/')[0]}/`) : file.type === type,
  )
}
