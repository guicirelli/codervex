import { CanonicalContext } from './canonical-schema'

export interface PublicContext {
  project: {
    name: string
    repository_type: CanonicalContext['project']['repository_type']
    intent: CanonicalContext['project']['intent']
    complexity: CanonicalContext['project']['complexity']
    statefulness: CanonicalContext['project']['statefulness']
    seo_relevant: boolean
    auth_required: boolean
  }
  audience: string[]
  proposal: {
    what_it_is: string[]
    what_it_does: string[]
    what_it_does_not_do: string[]
    core_value_proposition: string
  }
  technology_stack: {
    framework: string
    language: string[]
    styling: string[]
    ui_libraries: string[]
    deployment: string | null
  }
  structure: {
    routing_model: CanonicalContext['structure']['routing_model']
    entry_point: string
  }
  capabilities: string[]
  limitations: string[]
  excluded_concepts: string[]
}

function deriveAudience(context: CanonicalContext): string[] {
  const isPortfolio =
    context.proposal.what_it_is.some(s => s.toLowerCase().includes('portfolio')) ||
    context.proposal.what_it_is.some(s => s.toLowerCase().includes('showcase'))

  if (isPortfolio) {
    return [
      'Recruiters evaluating technical capability',
      'Hiring managers',
      'Technical reviewers',
      'Potential freelance clients',
    ]
  }

  const caps = new Set(context.capabilities.map(c => c.toLowerCase()))
  if (caps.has('user authentication') || caps.has('user dashboard')) {
    return ['End users', 'Internal stakeholders', 'Developers maintaining the system']
  }
  if (caps.has('e-commerce transactions')) {
    return ['Customers', 'Operations', 'Marketing']
  }
  if (caps.has('content publishing')) {
    return ['Readers', 'Content editors', 'Search traffic']
  }
  if (context.project.repository_type === 'backend') {
    return ['Developers integrating the API', 'Platform engineers', 'Internal services']
  }

  return ['End users', 'Developers', 'Stakeholders']
}

function deriveContentNature(context: CanonicalContext): string {
  const bits: string[] = []
  bits.push(context.project.statefulness === 'stateless' ? 'Mostly stateless' : 'Stateful')
  if (context.project.seo_relevant) bits.push('SEO-relevant')
  if (context.capabilities.some(c => c.toLowerCase().includes('internationalization'))) {
    bits.push('Multilingual (i18n)')
  }
  if (context.capabilities.some(c => c.toLowerCase().includes('content publishing'))) {
    bits.push('Content-driven')
  }
  if (context.capabilities.some(c => c.toLowerCase().includes('static site generation'))) {
    bits.push('Static-export friendly')
  }
  return bits.join(', ')
}

export function buildPublicContext(context: CanonicalContext): PublicContext {
  return {
    project: {
      name: context.project.name,
      repository_type: context.project.repository_type,
      intent: context.project.intent,
      complexity: context.project.complexity,
      statefulness: context.project.statefulness,
      seo_relevant: context.project.seo_relevant,
      auth_required: context.project.auth_required,
    },
    audience: deriveAudience(context),
    proposal: {
      what_it_is: context.proposal.what_it_is,
      what_it_does: context.proposal.what_it_does,
      what_it_does_not_do: context.proposal.what_it_does_not_do,
      core_value_proposition: context.proposal.core_value_proposition,
    },
    technology_stack: {
      framework: context.technical_stack.framework.name,
      language: context.technical_stack.language,
      styling: context.technical_stack.styling,
      ui_libraries: context.technical_stack.ui_libraries,
      deployment: context.technical_stack.deployment,
    },
    structure: {
      routing_model: context.structure.routing_model,
      entry_point: context.structure.entry_point,
    },
    capabilities: context.capabilities,
    limitations: context.limitations,
    excluded_concepts: context.excluded_concepts,
  }
}

export function generateUserFacingMarkdown(context: CanonicalContext): string {
  const pub = buildPublicContext(context)
  const lines: string[] = []

  lines.push('# Project Summary')
  lines.push('')

  lines.push('## What is this project?')
  lines.push(pub.proposal.what_it_is.length ? pub.proposal.what_it_is.map(s => `- ${s}`).join('\n') : '- Not detected')
  lines.push('')

  lines.push('## Who is it for?')
  lines.push(pub.audience.length ? pub.audience.map(a => `- ${a}`).join('\n') : '- Not detected')
  lines.push('')

  lines.push('## What does it do?')
  lines.push(pub.proposal.what_it_does.length ? pub.proposal.what_it_does.map(s => `- ${s}`).join('\n') : '- Not detected')
  lines.push('')

  lines.push('## What does it NOT do?')
  lines.push(pub.proposal.what_it_does_not_do.length ? pub.proposal.what_it_does_not_do.map(s => `- ${s}`).join('\n') : '- Not detected')
  lines.push('')

  lines.push('## Core proposal')
  lines.push(pub.proposal.core_value_proposition || 'Not detected')
  lines.push('')

  lines.push('## Technology stack')
  lines.push(`- Framework: ${pub.technology_stack.framework || 'Not detected'}`)
  lines.push(`- Language: ${pub.technology_stack.language.length ? pub.technology_stack.language.join(', ') : 'Not detected'}`)
  if (pub.technology_stack.styling.length) lines.push(`- Styling: ${pub.technology_stack.styling.join(', ')}`)
  if (pub.technology_stack.ui_libraries.length) lines.push(`- UI libraries: ${pub.technology_stack.ui_libraries.join(', ')}`)
  if (pub.technology_stack.deployment) lines.push(`- Deployment: ${pub.technology_stack.deployment}`)
  lines.push('')

  lines.push('## Content nature')
  lines.push(deriveContentNature(context) || 'Not detected')
  lines.push('')

  lines.push('## Rules for interpretation (anti-hallucination)')
  lines.push('- Use only the information present in this summary.')
  lines.push('- Do not assume authentication, payments, dashboards, or backend workflows unless explicitly stated above.')
  lines.push('- If a detail is missing, answer: "Not detected".')
  lines.push('')

  return lines.join('\n')
}


