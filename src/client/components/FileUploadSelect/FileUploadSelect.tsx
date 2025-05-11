import { useState, useRef } from 'react'
import { type FileUploadVariant } from 'model/FileUploadModel'
import styles from './FileUploadSelect.module.sass'
import { Button } from 'components/Button/Button'

export interface FileUploadSelectProps {
  onFileSelect: (files: FileList) => void
  variant?: FileUploadVariant
  acceptedFileTypes?: string[]
  maxFileSize?: number
  multipleFiles?: boolean
}

export const FileUploadSelect = ({
  onFileSelect,
  variant = 'button',
  multipleFiles = true,
  acceptedFileTypes = [],
}: FileUploadSelectProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [isInvalidFileType, setIsInvalidFileType] = useState(false)
  const [isTooManyFiles, setIsTooManyFiles] = useState(false)
  const [filesLength, setFilesLength] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isFileTypeAccepted = (file: File): boolean => {
    if (acceptedFileTypes.length === 0) {
      return true
    }

    return acceptedFileTypes.some((type: string) =>
      type.endsWith('/*') ? file.type.startsWith(`${type.split('/')[0]}/`) : file.type === type,
    )
  }

  const handleFiles = (fileList: FileList) => {
    setFilesLength(0)
    setIsInvalidFileType(false)
    setIsTooManyFiles(false)

    if (!multipleFiles && fileList.length > 1) {
      setIsTooManyFiles(true)
      return
    }

    const hasInvalidFiles = [...fileList].some((file: File) => !isFileTypeAccepted(file))

    if (!hasInvalidFiles) {
      onFileSelect(fileList)
      setFilesLength(fileList.length)
    } else {
      setIsInvalidFileType(hasInvalidFiles)
    }
  }

  const defaultEventHandler = (
    event: React.DragEvent<HTMLDivElement>,
    isDraggingOver: boolean,
    dropEffect: DataTransfer['dropEffect'],
  ) => {
    event.preventDefault()
    setIsDraggingOver(isDraggingOver)
    event.dataTransfer.dropEffect = dropEffect
  }

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files: FileList = event.dataTransfer.files

    handleFiles(files)
    setIsDraggingOver(false)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onEnterKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      handleFiles(files)
    }
  }

  const dropZoneClassNames = [
    styles.dropZone,
    isDraggingOver && styles.dragOver,
    filesLength > 0 && styles.hasFiles,
    (isInvalidFileType || isTooManyFiles) && styles.invalidFileType,
  ].join(' ')

  const statusText = () => {
    if (filesLength > 0) {
      return `${filesLength} file${filesLength > 1 ? 's' : ''} added!`
    }

    if (isDraggingOver) {
      return 'Drop files here to upload!'
    }

    const acceptedTypesText =
      acceptedFileTypes.length > 0 ? (
        <p className={styles.acceptedTypes}>Accepted types: {acceptedFileTypes.join(', ')}</p>
      ) : (
        ''
      )

    if (isInvalidFileType) {
      return <>Invalid file type! {acceptedTypesText}</>
    }

    if (isTooManyFiles) {
      return <>Please drop only one file!</>
    }

    return (
      <>
        {variant === 'drop' ? 'Drag files here or click to select!' : ''} {acceptedTypesText}
      </>
    )
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        accept={acceptedFileTypes.join(',')}
        multiple={multipleFiles}
      />
      {variant === 'drop' ? (
        <div
          className={dropZoneClassNames}
          onDrop={onDropHandler}
          onDragOver={event => defaultEventHandler(event, true, 'copy')}
          onDragEnter={event => defaultEventHandler(event, true, 'copy')}
          onDragLeave={event => defaultEventHandler(event, false, 'none')}
          onClick={handleClick}
          onKeyDown={onEnterKeyPress}
          role="button"
          tabIndex={0}
          aria-label="Drag and drop files here"
        >
          {statusText()}
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <Button tabIndex={0} onClick={handleClick} area-label="Select files">
            Select files
          </Button>
          <div>{statusText()}</div>
        </div>
      )}
    </>
  )
}
