import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FileUpload } from './FileUpload'
import { uploadFiles, type UploadResponse } from '../../../client/service/uploadFile'

vi.mock('../../../client/service/uploadFile', () => ({
  uploadFiles: vi.fn(),
}))

vi.mock('../FileUploadSelect/FileUploadSelect', () => ({
  FileUploadSelect: ({ onFileSelect }: { onFileSelect: (files: FileList) => void }) => (
    <button
      data-testid="file-select-button"
      onClick={() => {
        const mockFile = new File(['test content'], 'test.png', { type: 'image/png' })
        const mockFileList = {
          0: mockFile,
          length: 1,
          item: () => mockFile,
          *[Symbol.iterator]() {
            yield mockFile
          },
        } as unknown as FileList

        onFileSelect(mockFileList)
      }}
    >
      Select Files
    </button>
  ),
}))

vi.mock('../FileUploadStatus/FileUploadStatus', () => ({
  FileUploadStatus: ({ files }: { files: FileList }) => (
    <div data-testid="file-status">{files && files.length > 0 ? `${files.length} file(s) selected` : 'No files'}</div>
  ),
}))

vi.mock('../Button/Button', () => ({
  Button: (props: { disabled?: boolean; onClick?: () => void; 'aria-label'?: string; children?: React.ReactNode }) => (
    <button
      data-testid="upload-button"
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={props['aria-label']}
    >
      {props.children}
    </button>
  ),
}))

describe('FileUpload', () => {
  const originalConsoleError = console.error

  beforeEach(() => {
    vi.clearAllMocks()
    console.error = originalConsoleError
  })

  it('renders the component with initial state', () => {
    render(<FileUpload />)

    expect(screen.getByTestId('file-select-button')).toBeInTheDocument()
    expect(screen.queryByTestId('file-status')).not.toBeInTheDocument()
    expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument()
    expect(screen.queryByText(/Files uploaded successfully/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Files upload failed/)).not.toBeInTheDocument()
  })

  it('shows file status and upload button when files are selected', () => {
    render(<FileUpload />)

    fireEvent.click(screen.getByTestId('file-select-button'))

    expect(screen.getByTestId('file-status')).toBeInTheDocument()
    expect(screen.getByText(/1 file\(s\) selected/)).toBeInTheDocument()
    expect(screen.getByTestId('upload-button')).toBeInTheDocument()
    expect(screen.getByText('Upload')).toBeInTheDocument()
  })

  it('shows uploading state when upload button is clicked', () => {
    const uploadFilesPromise: Promise<UploadResponse[]> = new Promise(resolve => {
      setTimeout(() => resolve([{ success: true } as UploadResponse]), 100)
    })
    vi.mocked(uploadFiles).mockReturnValue(uploadFilesPromise)

    render(<FileUpload />)

    fireEvent.click(screen.getByTestId('file-select-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    expect(screen.getByText('Uploading...')).toBeInTheDocument()
    expect(screen.getByTestId('upload-button')).toBeDisabled()

    expect(uploadFiles).toHaveBeenCalledTimes(1)
  })

  it('shows success message when upload completes successfully', async () => {
    vi.mocked(uploadFiles).mockResolvedValue([
      {
        success: true,
        message: '',
        fileName: '',
      },
    ])

    render(<FileUpload />)

    fireEvent.click(screen.getByTestId('file-select-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => {
      expect(screen.getByText('Files uploaded successfully!')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('upload-button')).not.toBeInTheDocument()
  })

  it('shows error message when upload fails', async () => {
    console.error = vi.fn()

    vi.mocked(uploadFiles).mockRejectedValue(new Error('Upload failed'))

    render(<FileUpload />)

    fireEvent.click(screen.getByTestId('file-select-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => {
      expect(screen.getByText('Files upload failed. Please try again.')).toBeInTheDocument()
    })

    expect(screen.getByTestId('upload-button')).toBeInTheDocument()
  })

  it('shows error message when some files fail to upload', async () => {
    vi.mocked(uploadFiles).mockResolvedValue([
      {
        success: true,
        message: '',
        fileName: '',
      },
      {
        success: false,
        message: '',
        fileName: '',
      },
    ])

    render(<FileUpload />)

    fireEvent.click(screen.getByTestId('file-select-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => {
      expect(screen.getByText('Files upload failed. Please try again.')).toBeInTheDocument()
    })
  })

  it('calls onFileUploadDone callback with status on success', async () => {
    const onFileUploadDone = vi.fn()
    vi.mocked(uploadFiles).mockResolvedValue([
      {
        success: true,
        message: '',
        fileName: '',
      },
    ])

    render(<FileUpload onFileUploadDone={onFileUploadDone} />)

    fireEvent.click(screen.getByTestId('file-select-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => {
      expect(onFileUploadDone).toHaveBeenCalledWith('uploaded')
    })
  })

  it('calls onFileUploadDone callback with status on error', async () => {
    console.error = vi.fn()

    const onFileUploadDone = vi.fn()
    vi.mocked(uploadFiles).mockRejectedValue(new Error('Upload failed'))

    render(<FileUpload onFileUploadDone={onFileUploadDone} />)

    fireEvent.click(screen.getByTestId('file-select-button'))
    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => {
      expect(onFileUploadDone).toHaveBeenCalledWith('error')
    })
  })

  it('passes props to FileUploadSelect', () => {
    const props = {
      variant: 'drop' as const,
      acceptedFileTypes: ['image/png', 'image/jpeg'],
      multipleFiles: false,
    }

    render(<FileUpload {...props} />)

    expect(screen.getByTestId('file-select-button')).toBeInTheDocument()
  })
})
