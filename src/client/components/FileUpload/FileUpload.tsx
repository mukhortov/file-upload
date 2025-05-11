import { useState } from 'react'
import { FileUploadSelect, type FileUploadSelectProps } from 'components/FileUploadSelect/FileUploadSelect'
import { FileUploadStatus } from 'components/FileUploadStatus/FileUploadStatus'
import { Button } from 'components/Button/Button'
import { uploadFile } from 'service/uploadFile'
import styles from './FileUpload.module.sass'

interface FileUploadProps extends Pick<FileUploadSelectProps, 'variant'> {
  onFileUploadDone?: (files: FileList) => void
}

export const FileUpload = ({ variant, onFileUploadDone }: FileUploadProps) => {
  const [files, setFiles] = useState<FileList | undefined>()
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)

  const onFileSelect = (fileList: FileList) => {
    setFiles(fileList)
    setIsUploaded(false)
    setIsUploading(false)
  }

  const handleUploadButtonClick = () => {
    if (!files) {
      return
    }

    setIsUploading(true)
    setIsUploaded(false)

    Promise.all([...files].map(uploadFile))
      .then(() => {
        onFileUploadDone?.(files)
      })
      .catch(error => {
        console.error('Error uploading files:', error)
      })
      .finally(() => {
        setIsUploading(false)
        setIsUploaded(true)
      })
  }

  return (
    <div className={styles.container}>
      <FileUploadSelect
        variant={variant}
        acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
        onFileSelect={onFileSelect}
        // multipleFiles={false}
      />
      {files && <FileUploadStatus files={files} />}
      {files && !isUploaded && (
        <Button onClick={handleUploadButtonClick} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      )}
      {isUploaded && <p className={styles.uploadSuccess}>Files uploaded successfully!</p>}
    </div>
  )
}
