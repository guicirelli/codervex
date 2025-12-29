import { createTempFolder, cleanup } from '../../utils/fs-helpers'
import { writeFile, mkdir, readdir, rename, unlink } from 'fs/promises'
import { join } from 'path'
import extract from 'extract-zip'

const MAX_REPO_SIZE = 50 * 1024 * 1024 // 50MB

export interface GitHubRepoResult {
  projectPath: string
  repoUrl: string
  branch: string
}

export async function handleGitHubRepo(url: string): Promise<GitHubRepoResult> {
  // Validate URL
  if (!url.includes('github.com')) {
    throw new Error('Invalid GitHub repository URL')
  }

  // Normalize URL
  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http')) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  // Remove .git from end if exists
  normalizedUrl = normalizedUrl.replace(/\.git$/, '')

  // Extract username and repo
  const match = normalizedUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    throw new Error('Invalid GitHub repository URL format')
  }

  const [, username, repo] = match

  // Create temporary folder
  const tempPath = await createTempFolder()

  try {
    // Download ZIP from GitHub
    // GitHub allows downloading repo as ZIP: https://github.com/user/repo/archive/refs/heads/main.zip
    const branch = 'main' // Try main first
    const zipUrl = `https://github.com/${username}/${repo}/archive/refs/heads/${branch}.zip`
    
    let zipBuffer: Buffer
    
    try {
      const response = await fetch(zipUrl)
      if (!response.ok) {
        // Try master if main fails
        const masterUrl = `https://github.com/${username}/${repo}/archive/refs/heads/master.zip`
        const masterResponse = await fetch(masterUrl)
        if (!masterResponse.ok) {
          throw new Error('Repository not found or is private. Only public repositories are supported.')
        }
        zipBuffer = Buffer.from(await masterResponse.arrayBuffer())
      } else {
        zipBuffer = Buffer.from(await response.arrayBuffer())
      }
    } catch (error: any) {
      if (error.message.includes('private')) {
        throw error
      }
      throw new Error('Failed to download repository. Please check if the repository is public and accessible.')
    }

    // Check size
    if (zipBuffer.length > MAX_REPO_SIZE) {
      await cleanup(tempPath)
      throw new Error(`Repository is too large (${(zipBuffer.length / 1024 / 1024).toFixed(2)}MB). Maximum size is ${(MAX_REPO_SIZE / 1024 / 1024)}MB.`)
    }

    // Save ZIP temporarily
    const zipPath = join(tempPath, 'repo.zip')
    await writeFile(zipPath, zipBuffer)

    // Extract ZIP
    const extractPath = join(tempPath, 'extracted')
    await mkdir(extractPath, { recursive: true })
    
    await extract(zipPath, { dir: extractPath })

    // GitHub extracts to a folder named repo-branch, move content to root
    const extractedDirs = await readdir(extractPath)
    const repoFolder = extractedDirs.find(d => d.includes(repo))
    
    if (repoFolder) {
      const repoPath = join(extractPath, repoFolder)
      const finalPath = join(tempPath, 'project')
      await rename(repoPath, finalPath)
    } else {
      // If not found, use extracted as root
      await rename(extractPath, join(tempPath, 'project'))
    }

    // Cleanup ZIP
    await unlink(zipPath)

    return {
      projectPath: join(tempPath, 'project'),
      repoUrl: normalizedUrl,
      branch: branch
    }
  } catch (error: any) {
    await cleanup(tempPath)
    throw error
  }
}

