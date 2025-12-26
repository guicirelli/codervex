import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import fs from 'fs'
import path from 'path'

export interface PostFrontmatter {
  title: string
  publishDate: string
  author?: string
  authorImage?: string
  categories?: string[]
  tags?: string[]
  featuredImage?: string
  featuredPost?: boolean
  draft?: boolean
  excerpt?: string
  readTime?: string
  seoTitle?: string
  seoDescription?: string
}

export interface PageFrontmatter {
  title: string
  publishDate?: string
  description?: string
  seoTitle?: string
  seoDescription?: string
  showInMenu?: boolean
  menuOrder?: number
  template?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
  htmlContent: string
}

export interface Page extends PageFrontmatter {
  slug: string
  content: string
  htmlContent: string
}

export async function parseMarkdown(filePath: string): Promise<{
  data: any
  content: string
}> {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  return { data, content }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(markdown)
  return result.toString()
}

export function getAllPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'content', 'posts')
  
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'))
      
      return {
        slug,
        ...(data as PostFrontmatter),
        content,
        htmlContent: '', // Será processado quando necessário
      }
    })
    .filter((post) => !post.draft)
    .sort((a, b) => {
      const dateA = new Date(a.publishDate).getTime()
      const dateB = new Date(b.publishDate).getTime()
      return dateB - dateA
    })

  return allPosts
}

export function getPostBySlug(slug: string): Post | null {
  const postsDirectory = path.join(process.cwd(), 'content', 'posts')
  const fullPath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'))
  
  return {
    slug,
    ...(data as PostFrontmatter),
    content,
    htmlContent: '', // Será processado quando necessário
  }
}

export function getAllPages(): Page[] {
  const pagesDirectory = path.join(process.cwd(), 'content', 'pages')
  
  if (!fs.existsSync(pagesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(pagesDirectory)
  const allPages = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(pagesDirectory, fileName)
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'))
      
      return {
        slug,
        ...(data as PageFrontmatter),
        content,
        htmlContent: '', // Será processado quando necessário
      }
    })

  return allPages
}

export function getPageBySlug(slug: string): Page | null {
  const pagesDirectory = path.join(process.cwd(), 'content', 'pages')
  const fullPath = path.join(pagesDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'))
  
  return {
    slug,
    ...(data as PageFrontmatter),
    content,
    htmlContent: '', // Será processado quando necessário
  }
}

