import { mkdir, rm, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { tmpdir } from 'os'

// Usar /tmp do sistema (funciona no Netlify/Lambda)
// No Netlify, /tmp é o único diretório writable
const isNetlifyOrLambda = !!(
  process.env.NETLIFY || 
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.VERCEL ||
  process.env._?.includes('netlify') ||
  process.platform === 'linux' && process.env.HOME === '/var/task'
)

const TMP_DIR = isNetlifyOrLambda 
  ? '/tmp' 
  : join(tmpdir(), 'codervex')

export async function createTempFolder(): Promise<string> {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const folderPath = join(TMP_DIR, `project-${timestamp}-${random}`)
  
  try {
    await mkdir(folderPath, { recursive: true })
    return folderPath
  } catch (error: any) {
    // Se falhar, tentar criar /tmp diretamente (Netlify/Lambda)
    // Isso garante que funcione mesmo se a detecção de ambiente falhar
    if (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'EPERM') {
      const fallbackPath = join('/tmp', `codervex-project-${timestamp}-${random}`)
      try {
        await mkdir(fallbackPath, { recursive: true })
        return fallbackPath
      } catch (fallbackError: any) {
        // Se ainda falhar, tentar sem subdiretório
        if (fallbackError.code === 'ENOENT') {
          const directPath = `/tmp/codervex-project-${timestamp}-${random}`
          try {
            await mkdir(directPath, { recursive: true })
            return directPath
          } catch (directError: any) {
            // Última tentativa: usar apenas timestamp e random
            const lastPath = `/tmp/${timestamp}-${random}`
            await mkdir(lastPath, { recursive: true })
            return lastPath
          }
        }
        throw fallbackError
      }
    }
    throw error
  }
}

export async function cleanup(path: string): Promise<void> {
  try {
    if (existsSync(path)) {
      await rm(path, { recursive: true, force: true })
    }
  } catch (error) {
    console.error('Error cleaning up:', error)
  }
}

export async function ensureTmpDir(): Promise<void> {
  try {
    if (!existsSync(TMP_DIR)) {
      await mkdir(TMP_DIR, { recursive: true })
    }
  } catch (error: any) {
    // Se falhar, tentar /tmp diretamente (Netlify/Lambda)
    // Isso garante que funcione mesmo se a detecção de ambiente falhar
    if (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'EPERM') {
      try {
        // Verificar se /tmp existe, se não, tentar criar
        if (!existsSync('/tmp')) {
          await mkdir('/tmp', { recursive: true })
        }
      } catch (tmpError: any) {
        // /tmp já existe ou não temos permissão, continuar
        // No Netlify/Lambda, /tmp sempre existe, então isso é OK
        if (tmpError.code !== 'EEXIST') {
          console.warn('Warning: Could not create /tmp directory:', tmpError.message)
        }
      }
    }
    // Ignorar erro se diretório já existe
    if (error.code !== 'EEXIST') {
      console.warn('Warning: Could not create tmp directory:', error.message)
    }
  }
}

export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await stat(filePath)
    return stats.size
  } catch {
    return 0
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isDirectory()
  } catch {
    return false
  }
}

