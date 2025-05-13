import { useState } from 'react'
import { FileUploadSelect, type FileUploadSelectProps } from 'components/FileUploadSelect/FileUploadSelect'
import { FileUploadStatus } from 'components/FileUploadStatus/FileUploadStatus'
import { Button } from 'components/Button/Button'
import { uploadFiles } from 'service/uploadFile'
import styles from './FileUpload.module.sass'

type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'error'

interface FileUploadProps extends Pick<FileUploadSelectProps, 'variant' | 'acceptedFileTypes' | 'multipleFiles'> {
  onFileUploadDone?: (status?: UploadStatus) => void
}

export const FileUpload = ({ onFileUploadDone, ...rest }: FileUploadProps) => {
  const [files, setFiles] = useState<FileList | undefined>()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>()

  const onFileSelect = (fileList: FileList) => {
    setFiles(fileList)
    setUploadStatus('pending')
  }

  const handleUploadButtonClick = () => {
    if (!files) {
      return
    }

    setUploadStatus('uploading')

    uploadFiles(files)
      .then(responses => {
        const allSuccessful = responses.every(response => response.success)
        const newStatus = allSuccessful ? 'uploaded' : 'error'
        setUploadStatus(newStatus)
        onFileUploadDone?.(newStatus)
      })
      .catch(error => {
        setUploadStatus('error')
        onFileUploadDone?.('error')
        console.error('Error uploading files:', error)
      })
  }

  return (
    <div className={styles.container}>
      <FileUploadSelect onFileSelect={onFileSelect} {...rest} />
      {files && <FileUploadStatus files={files} />}
      {files && uploadStatus !== 'uploaded' && (
        <Button
          onClick={handleUploadButtonClick}
          disabled={uploadStatus === 'uploading'}
          tabIndex={0}
          aria-label="Upload files"
          role="button"
        >
          {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
        </Button>
      )}
      {uploadStatus === 'uploaded' && <p className={styles.uploadSuccess}>Files uploaded successfully!</p>}
      {uploadStatus === 'error' && <p className={styles.uploadError}>Files upload failed. Please try again.</p>}
    </div>
  )
}
