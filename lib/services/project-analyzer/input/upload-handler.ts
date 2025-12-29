import { createTempFolder, cleanup } from '../../utils/fs-helpers'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import extract from 'extract-zip'

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024 // 20MB

export interface UploadResult {
  projectPath: string
}

export async function handleUpload(file: File): Promise<UploadResult> {
  // Validate size
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${(MAX_UPLOAD_SIZE / 1024 / 1024)}MB.`)
  }

  // Validate type
  if (!file.name.endsWith('.zip')) {
    throw new Error('Only ZIP files are supported for upload')
  }

  const tempPath = await createTempFolder()

  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save ZIP
    const zipPath = join(tempPath, 'upload.zip')
    await writeFile(zipPath, buffer)

    // Extract ZIP
    const extractPath = join(tempPath, 'project')
    await mkdir(extractPath, { recursive: true })
    
    await extract(zipPath, { dir: extractPath })

    // Cleanup ZIP
    await unlink(zipPath)

    return {
      projectPath: extractPath
    }
  } catch (error: any) {
    await cleanup(tempPath)
    if (error.message.includes('corrupt') || error.message.includes('invalid')) {
      throw new Error('Invalid or corrupted ZIP file. Please check the file and try again.')
    }
    throw new Error(`Error processing upload: ${error.message}`)
  }
}

