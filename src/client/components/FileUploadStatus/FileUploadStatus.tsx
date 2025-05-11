import { useId } from 'react'

import styles from './FileUploadStatus.module.sass'

export interface FileUploadStatusProps {
  files: FileList
}

export const FileUploadStatus = ({ files }: FileUploadStatusProps) => {
  const id = useId()

  return (
    <ol className={styles.fileList}>
      {[...files].map(file => {
        return (
          <li key={file.name} className={styles.fileItem} id={`file-${id}`}>
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </li>
        )
      })}
    </ol>
  )
}
