import { formatFileSize } from 'utils/formatFileSize'
import styles from './FileUploadStatus.module.sass'

export interface FileUploadStatusProps {
  files: FileList
}

export const FileUploadStatus = ({ files }: FileUploadStatusProps) => (
  <ol className={styles.fileList}>
    {[...files].map(file => {
      return (
        <li key={file.name} className={styles.fileItem}>
          <span>{file.name}</span>
          <span>{formatFileSize(file.size)}</span>
        </li>
      )
    })}
  </ol>
)
