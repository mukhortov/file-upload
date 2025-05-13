import { type ReactElement } from 'react'
import styles from './App.module.sass'
import { FileUpload } from 'components/FileUpload/FileUpload'

export const App = (): ReactElement => {
  return (
    <main className="relative isolate h-dvh">
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-5xl">
          Here you can upload your files
        </h1>

        <div className={styles.uploadContainer}>
          <FileUpload
            variant="drop"
            acceptedFileTypes={['image/jpeg', 'image/png', 'application/pdf']}
            onFileUploadDone={uploadStatus => console.log('Upload status:', uploadStatus)}
            multipleFiles={true}
          />
        </div>
      </div>
    </main>
  )
}
