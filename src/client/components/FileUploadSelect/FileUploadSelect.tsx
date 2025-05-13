import { useState, useRef, useCallback, useMemo } from 'react'
import { type FileUploadVariant } from 'model/FileUploadModel'
import { Button } from 'components/Button/Button'
import styles from './FileUploadSelect.module.sass'
import { isFileTypeAccepted } from 'utils/isFileTypeAccepted'

export interface FileUploadSelectProps {
  onFileSelect: (files: FileList) => void
  variant?: FileUploadVariant
  acceptedFileTypes?: string[]
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

  const handleFiles = useCallback(
    (fileList: FileList) => {
      setFilesLength(0)
      setIsInvalidFileType(false)
      setIsTooManyFiles(false)

      if (!multipleFiles && fileList.length > 1) {
        setIsTooManyFiles(true)
        return
      }

      const hasInvalidFiles = [...fileList].some((file: File) => !isFileTypeAccepted(file, acceptedFileTypes))

      if (!hasInvalidFiles) {
        onFileSelect(fileList)
        setFilesLength(fileList.length)
      } else {
        setIsInvalidFileType(true)
      }
    },
    [multipleFiles, acceptedFileTypes, onFileSelect],
  )

  const defaultEventHandler = (
    event: React.DragEvent<HTMLDivElement>,
    draggingOverValue: boolean,
    dropEffectValue: DataTransfer['dropEffect'],
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingOver(draggingOverValue)
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = dropEffectValue
    }
  }

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    defaultEventHandler(event, false, 'none')
    const files: FileList = event.dataTransfer.files

    if (files && files.length > 0) {
      handleFiles(files)
    }
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
    isInvalidFileType && styles.invalidFileType,
    isTooManyFiles && styles.tooManyFiles,
  ]
    .filter(Boolean)
    .join(' ')

  const memoizedStatusText = useMemo(() => {
    if (filesLength > 0) {
      return `${filesLength} file${filesLength > 1 ? 's' : ''} selected!`
    }

    if (isDraggingOver) {
      return 'Drop files here to upload!'
    }

    const acceptedTypesTextElement =
      acceptedFileTypes.length > 0 ? (
        <p className={styles.acceptedTypes}>Accepted types: {acceptedFileTypes.join(', ')}</p>
      ) : null

    if (isInvalidFileType) {
      return <>Invalid file type! {acceptedTypesTextElement}</>
    }

    if (isTooManyFiles) {
      return <>Please drop only one file!</>
    }

    return (
      <>
        {variant === 'drop' ? 'Drag files here or click to select!' : ''} {acceptedTypesTextElement}
      </>
    )
  }, [filesLength, isDraggingOver, acceptedFileTypes, isInvalidFileType, isTooManyFiles, variant])

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        accept={acceptedFileTypes.join(',')}
        multiple={multipleFiles}
        aria-hidden="true"
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
          aria-label="Drag and drop files here or click to select"
        >
          {memoizedStatusText}
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <Button tabIndex={0} onClick={handleClick} aria-label="Select files to upload">
            Select files
          </Button>
          <div aria-live="polite">{memoizedStatusText}</div>
        </div>
      )}
    </>
  )
}
