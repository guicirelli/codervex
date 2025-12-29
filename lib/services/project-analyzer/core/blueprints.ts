/**
 * Universal Blueprint Catalog
 * Defines project types and their characteristics
 */

export type ProjectIntent = 'inform' | 'sell' | 'operate' | 'engage' | 'automate'
export type ProjectDomain = 'content' | 'product' | 'service' | 'internal' | 'tool'
export type ProjectType = 'landing' | 'blog' | 'saas' | 'dashboard' | 'docs' | 'portfolio' | 'api' | 'script' | 'ecommerce'
export type Complexity = 'low' | 'medium' | 'high'
export type Statefulness = 'static' | 'dynamic' | 'realtime'

export interface ProjectClassification {
  intent: ProjectIntent
  domain: ProjectDomain
  projectType: ProjectType
  complexity: Complexity
  statefulness: Statefulness
  authRequired: boolean
  seoRelevant: boolean
}

export interface Blueprint {
  name: string
  description: string
  whenToUse: string[]
  objective: string
  structure: {
    pages?: string[]
    entities?: string[]
    systems?: string[]
  }
  coreFlows: string[]
  risks: string[]
  output: {
    contentDriven?: boolean
    seoCritical?: boolean
    dynamicRendering?: boolean
    singlePage?: boolean
    ctaDriven?: boolean
    stateful?: boolean
    authRequired?: boolean
    seoIrrelevant?: boolean
    dataHeavy?: boolean
    realtimeOptional?: boolean
    personalBrand?: boolean
    simpleStructure?: boolean
    developerAudience?: boolean
    searchCritical?: boolean
    transactional?: boolean
    paymentCritical?: boolean
    internal?: boolean
    securityCritical?: boolean
    noUI?: boolean
    contractCritical?: boolean
    executionBased?: boolean
    observabilityNeeded?: boolean
  }
}

export const BLUEPRINTS: Record<string, Blueprint> = {
  ContentSiteBlueprint: {
    name: 'ContentSiteBlueprint',
    description: 'Blogs, institutional sites, content portals, SEO-first',
    whenToUse: ['Blogs', 'Institutional sites', 'Content portals', 'SEO-first'],
    objective: 'Inform, educate, position',
    structure: {
      pages: ['home', 'article', 'category', 'about', 'contact'],
      entities: ['post', 'author', 'category'],
      systems: ['content rendering', 'navigation', 'metadata']
    },
    coreFlows: [
      'Discovery → reading → retention',
      'Indexing → ranking → traffic'
    ],
    risks: ['Weak content', 'Overengineering', 'Poorly configured SEO'],
    output: {
      contentDriven: true,
      seoCritical: true,
      dynamicRendering: false
    }
  },
  LandingCROBlueprint: {
    name: 'LandingCROBlueprint',
    description: 'Idea validation, unique product, lead capture, direct sales',
    whenToUse: ['Idea validation', 'Unique product', 'Lead capture', 'Direct sales'],
    objective: 'Convert',
    structure: {
      pages: ['hero', 'value proposition', 'social proof', 'cta', 'form'],
      entities: [],
      systems: ['conversion tracking', 'form handling']
    },
    coreFlows: [
      'Visit → scroll → click → submit'
    ],
    risks: ['Generic content', 'Confusing CTA', 'Too many sections'],
    output: {
      singlePage: true,
      ctaDriven: true
    }
  },
  SaaSAppBlueprint: {
    name: 'SaaSAppBlueprint',
    description: 'Recurring product, logged-in users, plans / billing',
    whenToUse: ['Recurring product', 'Logged-in users', 'Plans / billing'],
    objective: 'Operate a system',
    structure: {
      pages: ['auth', 'dashboard', 'settings', 'billing'],
      entities: ['user', 'subscription', 'plan'],
      systems: ['authentication', 'user state', 'payment processing']
    },
    coreFlows: [
      'Signup → onboarding → usage → retention',
      'Login → action → feedback'
    ],
    risks: ['Complex UX', 'Missing onboarding', 'Poorly designed auth'],
    output: {
      stateful: true,
      authRequired: true,
      seoIrrelevant: true
    }
  },
  DashboardBlueprint: {
    name: 'DashboardBlueprint',
    description: 'Data visualization, administrative panels, analytics',
    whenToUse: ['Data visualization', 'Administrative panels', 'Analytics'],
    objective: 'Decision making',
    structure: {
      pages: ['dashboard', 'reports', 'settings'],
      entities: ['chart', 'kpi', 'metric'],
      systems: ['data visualization', 'filtering', 'export']
    },
    coreFlows: [
      'Load → filter → analyze'
    ],
    risks: ['Visual clutter', 'Data without context'],
    output: {
      dataHeavy: true,
      realtimeOptional: true
    }
  },
  PortfolioBlueprint: {
    name: 'PortfolioBlueprint',
    description: 'Developer portfolio - showcases projects, technical skills and professional positioning',
    whenToUse: [
      'Public-facing developer portfolio',
      'Project showcase with visual assets',
      'Professional positioning site',
      'Technical competence demonstration'
    ],
    objective: 'Demonstrate technical competence, project experience and professional positioning',
    structure: {
      pages: ['hero', 'about', 'projects', 'skills', 'contact'],
      entities: ['project', 'skill', 'case-study'],
      systems: ['project showcase', 'contact form', 'multilingual content']
    },
    coreFlows: [
      'Visit → scan → trust → contact',
      'Project discovery → technical review → professional assessment'
    ],
    risks: ['Excessive animation', 'Empty text', 'Weak project presentation'],
    output: {
      personalBrand: true,
      simpleStructure: true,
      seoCritical: true
    }
  },
  DocumentationBlueprint: {
    name: 'DocumentationBlueprint',
    description: 'APIs, SDKs, technical tools',
    whenToUse: ['APIs', 'SDKs', 'Technical tools'],
    objective: 'Explain and reduce support',
    structure: {
      pages: ['sidebar', 'content', 'search'],
      entities: ['doc', 'version', 'example'],
      systems: ['versioning', 'code blocks', 'search']
    },
    coreFlows: [
      'Search → read → implement'
    ],
    risks: ['Outdated docs', 'Missing examples'],
    output: {
      developerAudience: true,
      searchCritical: true
    }
  },
  EcommerceBlueprint: {
    name: 'EcommerceBlueprint',
    description: 'Product sales, catalog, checkout',
    whenToUse: ['Product sales', 'Catalog', 'Checkout'],
    objective: 'Sell with confidence',
    structure: {
      pages: ['product list', 'product page', 'cart', 'checkout'],
      entities: ['product', 'cart', 'order'],
      systems: ['payment processing', 'inventory', 'shipping']
    },
    coreFlows: [
      'Browse → select → pay'
    ],
    risks: ['Complex checkout', 'Lack of trust'],
    output: {
      transactional: true,
      paymentCritical: true
    }
  },
  InternalToolBlueprint: {
    name: 'InternalToolBlueprint',
    description: 'Internal systems, administrative tools',
    whenToUse: ['Internal systems', 'Administrative tools'],
    objective: 'Operational efficiency',
    structure: {
      pages: ['dashboard', 'crud', 'settings'],
      entities: ['record', 'user', 'permission'],
      systems: ['permissions', 'logs', 'audit']
    },
    coreFlows: [
      'Login → task → complete'
    ],
    risks: ['Missing access control', 'Neglected UX'],
    output: {
      internal: true,
      securityCritical: true
    }
  },
  APIServiceBlueprint: {
    name: 'APIServiceBlueprint',
    description: 'Backend-only, integrations, services',
    whenToUse: ['Backend-only', 'Integrations', 'Services'],
    objective: 'Provide functionality',
    structure: {
      pages: [],
      entities: ['endpoint', 'auth', 'rate limit'],
      systems: ['routing', 'authentication', 'rate limiting', 'documentation']
    },
    coreFlows: [
      'Request → process → response'
    ],
    risks: ['Breaking changes', 'Missing versioning'],
    output: {
      noUI: true,
      contractCritical: true
    }
  },
  AutomationScriptBlueprint: {
    name: 'AutomationScriptBlueprint',
    description: 'Scripts, bots, automation',
    whenToUse: ['Scripts', 'Bots', 'Automation'],
    objective: 'Automate tasks',
    structure: {
      pages: [],
      entities: ['trigger', 'logic', 'output'],
      systems: ['execution', 'logging', 'error handling']
    },
    coreFlows: [
      'Execute → finish'
    ],
    risks: ['Missing logs', 'Silent failure'],
    output: {
      executionBased: true,
      observabilityNeeded: true
    }
  }
}

