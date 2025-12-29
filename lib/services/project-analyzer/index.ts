import { handleGitHubRepo } from './input/github-handler'
import { handleUpload } from './input/upload-handler'
import { normalizeProject } from './core/normalizer'
import { scanProject } from './core/scanner'
import { analyzeProject } from './core/analyzer'
import { generateMarkdown } from './core/generator'
import { cleanup, ensureTmpDir } from '../utils/fs-helpers'

export interface AnalysisInput {
  type: 'github' | 'upload'
  value: string | File
}

export interface AnalysisOutput {
  markdown: string
  summary: string
  analysis: {
    stack: string
    framework: string
    projectType: string
  }
  canonical?: {
    context: any // CanonicalContext
    json: string
    markdown: string
    prompt: string
  }
}

export async function runAnalysis(input: AnalysisInput): Promise<AnalysisOutput> {
  // Ensure tmp directory exists
  await ensureTmpDir()

  let projectPath: string = ''
  let repoName: string | undefined = undefined

  try {
    // 1. Normalize input
    if (input.type === 'github') {
      const result = await handleGitHubRepo(input.value as string)
      projectPath = result.projectPath
      // Extract repo name from URL
      try {
        const url = new URL(result.repoUrl.startsWith('http') ? result.repoUrl : `https://${result.repoUrl}`)
        const pathParts = url.pathname.split('/').filter(p => p)
        if (pathParts.length >= 2) {
          repoName = pathParts[pathParts.length - 1]
        }
      } catch {
        repoName = result.repoUrl
      }
    } else {
      const result = await handleUpload(input.value as File)
      projectPath = result.projectPath
      // Use file name as repo name
      repoName = (input.value as File).name.replace('.zip', '')
    }

    // 2. Normalize project
    const normalized = await normalizeProject(projectPath)

    if (normalized.files.length === 0) {
      throw new Error('No analyzable files found. The project may be empty or unsupported.')
    }

    // 3. Scan
    const scan = scanProject(normalized)

    // 4. Analyze
    const analysis = analyzeProject(scan, normalized)

    // 5. Generate Markdown
    const document = generateMarkdown(analysis, scan, normalized, repoName)

    // 6. Cleanup
    await cleanup(projectPath)

    return {
      markdown: document.markdown,
      summary: document.summary,
      analysis: {
        stack: analysis.stack,
        framework: analysis.framework,
        projectType: analysis.projectType
      },
      canonical: document.canonical
    }
  } catch (error: any) {
    // Limpar em caso de erro
    if (projectPath) {
      await cleanup(projectPath).catch(() => {})
    }
    throw error
  }
}

