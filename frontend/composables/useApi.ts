// API Base Configuration
// Use axios instance from Nuxt app for proper auth handling

/**
 * Generic API request handler using axios
 */
async function apiRequest<T>(
  endpoint: string,
  options: any = {}
): Promise<T> {
  // Get axios instance from Nuxt app
  const nuxtApp = useNuxtApp()
  const api = (nuxtApp as any).$api

  // Convert fetch options to axios config
  const axiosConfig: any = {
    method: (options.method as string) || 'GET',
    url: endpoint,
  }

  // Handle body for POST/PUT/PATCH
  if (options.body) {
    axiosConfig.data = typeof options.body === 'string'
      ? JSON.parse(options.body)
      : options.body
  }

  // Handle params (query string for GET requests)
  if (options.params) {
    axiosConfig.params = options.params
  }

  // Merge headers
  if (options.headers) {
    axiosConfig.headers = options.headers
  }

  const response = await api.request(axiosConfig)

  return response.data.data || response.data
}

/**
 * Projects API
 */
export const projectsApi = {
  list: () => apiRequest<any[]>('/projects'),

  get: (id: number) => apiRequest<any>(`/projects/${id}`),

  create: (data: {
    name: string
    description?: string
    criteria?: Record<string, any>
  }) => apiRequest<any>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: number, data: { name?: string; description?: string }) =>
    apiRequest<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiRequest<void>(`/projects/${id}`, { method: 'DELETE' }),

  duplicate: (id: number) =>
    apiRequest<any>(`/projects/${id}/duplicate`, { method: 'POST' }),

  getCriteria: (id: number) => apiRequest<any>(`/projects/${id}/criteria`),

  updateCriteria: (id: number, data: Record<string, any>) =>
    apiRequest<any>(`/projects/${id}/criteria`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getTDH: (id: number) => apiRequest<any>(`/projects/${id}/tdh`),

  getAuditLogs: (id: number, limit = 100) =>
    apiRequest<any[]>(`/projects/${id}/audit?limit=${limit}`),
}

/**
 * Networks API
 */
export const networksApi = {
  list: (projectId: number) =>
    apiRequest<any[]>(`/projects/${projectId}/networks`),

  getCurrent: (projectId: number) =>
    apiRequest<any>(`/projects/${projectId}/networks/current`),

  create: (projectId: number, data: {
    name: string
    nodes?: Array<any>
    pipes?: Array<any>
  }) => apiRequest<any>(`/projects/${projectId}/networks`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (networkId: number, data: { name?: string; isCurrent?: boolean }) =>
    apiRequest<any>(`/networks/${networkId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (networkId: number) =>
    apiRequest<void>(`/networks/${networkId}`, { method: 'DELETE' }),

  findCriticalPath: (networkId: number) =>
    apiRequest<any>(`/networks/${networkId}/critical-path`, { method: 'POST' }),

  getNodes: (networkId: number) =>
    apiRequest<any[]>(`/networks/${networkId}/nodes`),

  calculate: (networkId: number, params: {
    systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'
    velocityWarning?: number
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
    waterFactorAdjustment?: number
  }) => apiRequest<any[]>(`/networks/${networkId}/calculate`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),

  applySuggestions: (networkId: number) =>
    apiRequest<any[]>(`/networks/${networkId}/apply-suggestions`, { method: 'POST' }),
}

/**
 * Nodes API
 */
export const nodesApi = {
  add: (networkId: number, data: {
    type: 'SOURCE' | 'JUNCTION' | 'FIXTURE' | 'RISER'
    x: number
    y: number
    elevation?: number
    label?: string
  }) => apiRequest<any>(`/networks/${networkId}/nodes`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (nodeId: number, data: {
    x?: number
    y?: number
    elevation?: number
    label?: string
  }) => apiRequest<any>(`/nodes/${nodeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (nodeId: number) =>
    apiRequest<void>(`/nodes/${nodeId}`, { method: 'DELETE' }),

  getFixtures: (nodeId: number) =>
    apiRequest<any[]>(`/nodes/${nodeId}/fixtures`),
}

/**
 * Fixtures API
 */
export const fixturesApi = {
  add: (nodeId: number, data: { type: string; quantity?: number }) =>
    apiRequest<any>(`/nodes/${nodeId}/fixtures`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (fixtureId: number, data: { quantity?: number }) =>
    apiRequest<any>(`/fixtures/${fixtureId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (fixtureId: number) =>
    apiRequest<void>(`/fixtures/${fixtureId}`, { method: 'DELETE' }),
}

/**
 * Documents API
 */
export const documentsApi = {
  list: (projectId: number) =>
    apiRequest<any[]>(`/projects/${projectId}/documents`),

  upload: async (projectId: number, file: File, metadata: {
    floor: string
    type: string
    scale: string
  }) => {
    const nuxtApp = useNuxtApp()
    const api = (nuxtApp as any).$api

    const formData = new FormData()
    formData.append('file', file)
    formData.append('floor', metadata.floor)
    formData.append('type', metadata.type)
    formData.append('scale', metadata.scale)

    const response = await api.request({
      method: 'POST',
      url: `/projects/${projectId}/documents`,
      data: formData,
      // ❌ อย่าตั้ง Content-Type ให้ FormData! ให้ Axios ตั้งเองพร้อม boundary
      headers: {
        // 'Content-Type': 'multipart/form-data', ← ลบบรรทัดนี้
      },
    })

    return response.data.data || response.data
  },

  delete: (documentId: number) =>
    apiRequest<void>(`/documents/${documentId}`, { method: 'DELETE' }),

  // Version-level documents (v2)
  listByVersion: (versionId: number) =>
    apiRequest<any[]>(`/versions/${versionId}/documents`),

  uploadForVersion: async (versionId: number, file: File, metadata: {
    floor: string
    type: string
    scale: string
  }) => {
    const nuxtApp = useNuxtApp()
    const api = (nuxtApp as any).$api

    const formData = new FormData()
    formData.append('file', file)
    formData.append('floor', metadata.floor)
    formData.append('type', metadata.type)
    formData.append('scale', metadata.scale)

    const response = await api.request({
      method: 'POST',
      url: `/versions/${versionId}/documents`,
      data: formData,
      headers: {},
    })

    return response.data.data || response.data
  },
}

/**
 * Pipes API
 */
export const pipesApi = {
  add: (networkId: number, data: {
    sourceNodeId: number
    targetNodeId: number
    length: number
    nominalSize: string
    internalDiameter: number
    material?: string
    cFactor?: number
  }) => apiRequest<any>(`/networks/${networkId}/pipes`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (pipeId: number, data: {
    length?: number
    nominalSize?: string
    internalDiameter?: number
    material?: string
    cFactor?: number
    isCriticalPath?: boolean
  }) => apiRequest<any>(`/pipes/${pipeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (pipeId: number) =>
    apiRequest<void>(`/pipes/${pipeId}`, { method: 'DELETE' }),

  calculate: (pipeId: number, params: {
    systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'
    velocityWarning?: number
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
    waterFactorAdjustment?: number
  }) => apiRequest<any>(`/pipes/${pipeId}/calculate`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),
}

/**
 * Versions API
 */
export const versionsApi = {
  list: (projectId: number) =>
    apiRequest<any[]>(`/projects/${projectId}/versions`),

  get: (versionId: number) => apiRequest<any>(`/versions/${versionId}`),

  create: (projectId: number, data: { name: string; description?: string }) =>
    apiRequest<any>(`/projects/${projectId}/versions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (versionId: number, data: {
    name?: string
    description?: string
    snapshotNetwork?: string
    snapshotFixtures?: string
    snapshotResults?: string
    referenceLayer?: string
  }) =>
    apiRequest<any>(`/versions/${versionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (versionId: number) =>
    apiRequest<void>(`/versions/${versionId}`, { method: 'DELETE' }),

  duplicate: (versionId: number) =>
    apiRequest<any>(`/versions/${versionId}/duplicate`, { method: 'POST' }),

  compare: (versionId1: number, versionId2: number) =>
    apiRequest<any>(`/versions/compare/${versionId1}/${versionId2}`),

  restore: (versionId: number) =>
    apiRequest<any>(`/versions/${versionId}/restore`, { method: 'POST' }),

  getAuditLogs: (versionId: number, limit = 100) =>
    apiRequest<any[]>(`/versions/${versionId}/audit?limit=${limit}`),
}

/**
 * Hybrid Sizing API
 */
export const hybridSizingApi = {
  calculatePipe: (pipeId: number, params: {
    systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
  }) => apiRequest<any>(`/pipes/${pipeId}/hybrid-sizing`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),

  calculateNetwork: (networkId: number, params: {
    systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
  }) => apiRequest<any[]>(`/networks/${networkId}/hybrid-sizing`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),
}

/**
 * Auto Suggest API
 */
export const autoSuggestApi = {
  analyze: (networkId: number, params: {
    systemType?: 'FLUSH_TANK' | 'FLUSH_VALVE'
    includeHoseBibb?: boolean
    hoseBibbGPM?: number
  }) => apiRequest<{
    suggestions: any[]
    summary: {
      total: number
      ok: number
      warning: number
      critical: number
      needsUpsizing: number
    }
  }>(`/networks/${networkId}/auto-suggest`, {
    method: 'GET',
    params: params as any,
  }),

  applySingle: (networkId: number, pipeId: number, customSizeMM?: number) =>
    apiRequest<any>(`/networks/${networkId}/auto-suggest/${pipeId}/apply`, {
      method: 'POST',
      body: customSizeMM !== undefined ? JSON.stringify({ customSizeMM }) : undefined,
    }),

  applyAll: (networkId: number) =>
    apiRequest<any[]>(`/networks/${networkId}/auto-suggest/apply-all`, {
      method: 'POST',
    }),
}

/**
 * Calculations API
 */
export const calculationsApi = {
  getSummary: (projectId: number) =>
    apiRequest<any>(`/projects/${projectId}/calculation/summary`),

  calculate: (projectId: number) =>
    apiRequest<any>(`/projects/${projectId}/calculation`, { method: 'POST' }),

  getResults: (projectId: number) =>
    apiRequest<any>(`/projects/${projectId}/results`),
}

/**
 * useApi composable - exports all APIs
 */
export const useApi = () => {
  return {
    projectsApi,
    networksApi,
    nodesApi,
    pipesApi,
    fixturesApi,
    versionsApi,
    hybridSizingApi,
    autoSuggestApi,
    calculationsApi,
    documentsApi,
  }
}
