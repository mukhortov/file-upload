# File upload component

The File Upload Component is a lightweight and efficient solution for handling file uploads in web applications. It supports single file uploads, chunked uploads for large files, and provides a simple API for integration.

## Installation

```bash
npm install
npm run dev
```

This will start a simple dev server with hot reload using vite and express for some mock API requests.

## API

### List of files

```http
GET /api/files
```

### Upload a single file

```http
POST /api/upload-single
```

| Body parameter | Type   | Description                      |
| :------------- | :----- | :------------------------------- |
| `file`         | `file` | **Required**. The file to upload |

### Upload a file in chunks

```http
POST /api/upload-chunks
```

| Body parameter      | Type     | Description                                  |
| :------------------ | :------- | :------------------------------------------- |
| `file`              | `file`   | **Required**. The file to upload             |
| `currentChunkIndex` | `number` | **Required**. The current chunk index number |
| `totalChunks`       | `number` | **Required**. The total number of chunks     |

## Styling

This project is using a combination of Sass, CSS Modules, and Tailwind CSS for its styling.

## Testing

The project includes unit and integration tests. You can run them using the following commands:

### Run all tests
```bash
npm run test
```

### Run server tests
```bash
npm run test:server
```

### Run client tests
```bash
npm run test:client
```

## TODO

- [x] Handle large files uploads (larger than 5MB?)
- [x] Tests
- [ ] Better error handling
- [ ] Sass global variables
- [ ] Upload progress for every file in the upload list
- [ ] Functionality to list uploaded files

