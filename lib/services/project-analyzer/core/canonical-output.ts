/**
 * Canonical Output Generator
 * Gera JSON e Markdown canônico
 * Output sempre igual para o mesmo repositório
 */

import { CanonicalContext } from './canonical-schema'
import { buildPublicContext } from './public-output'

export interface CanonicalOutput {
  json: string
  markdown: string
  prompt: string
}

/**
 * Generates canonical JSON output
 */
export function generateCanonicalJSON(context: CanonicalContext): string {
  // Public-facing JSON (must not include engine/debug fields)
  const publicContext = buildPublicContext(context)
  return JSON.stringify(publicContext, null, 2)
}

/**
 * Generates canonical Markdown output
 */
export function generateCanonicalMarkdown(context: CanonicalContext): string {
  const lines: string[] = []
  const publicContext = buildPublicContext(context)
  
  // Header
  lines.push('# Project Context')
  lines.push('')
  lines.push(`**Project:** ${publicContext.project.name}`)
  lines.push(`**Type:** ${publicContext.project.repository_type}`)
  lines.push(`**Intent:** ${publicContext.project.intent}`)
  lines.push('')
  
  // Project Identity
  lines.push('## Project Summary')
  lines.push(`- **Complexity:** ${publicContext.project.complexity}`)
  lines.push(`- **Statefulness:** ${publicContext.project.statefulness}`)
  lines.push(`- **SEO Relevant:** ${publicContext.project.seo_relevant ? 'Yes' : 'No'}`)
  lines.push(`- **Auth Required:** ${publicContext.project.auth_required ? 'Yes' : 'No'}`)
  lines.push('')
  
  // Audience
  lines.push('## Who is it for?')
  publicContext.audience.forEach(a => lines.push(`- ${a}`))
  lines.push('')
  
  // Proposal
  lines.push('## Core Proposal')
  lines.push('')
  lines.push('### What It Is')
  publicContext.proposal.what_it_is.forEach(item => {
    lines.push(`- ${item}`)
  })
  lines.push('')
  lines.push('### What It Does')
  publicContext.proposal.what_it_does.forEach(item => {
    lines.push(`- ${item}`)
  })
  lines.push('')
  lines.push('### What It Does NOT Do')
  publicContext.proposal.what_it_does_not_do.forEach(item => {
    lines.push(`- ${item}`)
  })
  lines.push('')
  lines.push(`**Core Value Proposition:** ${publicContext.proposal.core_value_proposition}`)
  lines.push('')
  
  // Technical Stack
  lines.push('## Technical Stack')
  lines.push(`- **Framework:** ${publicContext.technology_stack.framework}`)
  lines.push(`- **Languages:** ${publicContext.technology_stack.language.join(', ')}`)
  if (publicContext.technology_stack.styling.length > 0) {
    lines.push(`- **Styling:** ${publicContext.technology_stack.styling.join(', ')}`)
  }
  if (publicContext.technology_stack.ui_libraries.length > 0) {
    lines.push(`- **UI Libraries:** ${publicContext.technology_stack.ui_libraries.join(', ')}`)
  }
  if (publicContext.technology_stack.deployment) {
    lines.push(`- **Deployment:** ${publicContext.technology_stack.deployment}`)
  }
  lines.push('')
  
  // Structure
  lines.push('## Structure')
  lines.push(`- **Routing Model:** ${publicContext.structure.routing_model}`)
  lines.push(`- **Entry Point:** ${publicContext.structure.entry_point}`)
  lines.push('')
  
  // Capabilities
  if (publicContext.capabilities.length > 0) {
    lines.push('## Capabilities')
    publicContext.capabilities.forEach(cap => {
      lines.push(`- ${cap}`)
    })
    lines.push('')
  }
  
  // Limitations
  if (publicContext.limitations.length > 0) {
    lines.push('## Limitations')
    publicContext.limitations.forEach(lim => {
      lines.push(`- ${lim}`)
    })
    lines.push('')
  }
  
  // Excluded Concepts
  if (publicContext.excluded_concepts.length > 0) {
    lines.push('## Excluded Concepts')
    lines.push('The following concepts are explicitly excluded and should not be assumed:')
    publicContext.excluded_concepts.forEach(concept => {
      lines.push(`- ${concept}`)
    })
    lines.push('')
  }
  
  return lines.join('\n')
}

/**
 * Generates canonical prompt for AI usage
 * Portfolio-specific prompts focus on "what this says about who built it"
 */
export function generateCanonicalPrompt(context: CanonicalContext): string {
  const publicContext = buildPublicContext(context)
  const contextJson = JSON.stringify(publicContext, null, 2)
  
  const lines: string[] = []
  
  lines.push('Analyze the following software repository context.')
  lines.push('')
  lines.push('Your task:')
  lines.push('- Explain what this project is')
  lines.push('- Describe who it is for')
  lines.push('- Describe what it does and what it explicitly does NOT do')
  lines.push('- Summarize the technical stack')
  lines.push('')
  lines.push('Rules:')
  lines.push('- Use only the provided context')
  lines.push('- Do not mention any internal classification, blueprint names, scores, or confidence')
  lines.push('- Do not speculate or invent features')
  lines.push('- If information is missing, answer: "Not detected"')
  lines.push('')
  lines.push('Context (JSON):')
  lines.push(contextJson)
  
  return lines.join('\n')
}

/**
 * Generates all canonical outputs
 */
export function generateCanonicalOutputs(context: CanonicalContext): CanonicalOutput {
  return {
    json: generateCanonicalJSON(context),
    markdown: generateCanonicalMarkdown(context),
    prompt: generateCanonicalPrompt(context)
  }
}

