import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    // Cache criteria per projectId
    criteriaCache: new Map<number, any>(),
  }),

  getters: {
    // Get criteria for a specific project
    getCriteria: (state) => (projectId: number) => {
      return state.criteriaCache.get(projectId)
    },

    // Get static head for a specific project
    getStaticHead: (state) => (projectId: number) => {
      const criteria = state.criteriaCache.get(projectId)
      return criteria?.staticHead || 0
    },
  },

  actions: {
    // Set criteria for a project (merges with existing)
    setCriteria(projectId: number, criteria: any) {
      const existing = this.criteriaCache.get(projectId) || {}
      this.criteriaCache.set(projectId, {
        ...existing,
        ...criteria,
      })
      console.log(`[ProjectStore] Set criteria for project ${projectId}:`, criteria)
    },

    // Update static head for a project
    setStaticHead(projectId: number, staticHead: number) {
      const existing = this.criteriaCache.get(projectId) || {}
      this.criteriaCache.set(projectId, {
        ...existing,
        staticHead,
      })
      console.log(`[ProjectStore] Set staticHead ${staticHead} for project ${projectId}`)
    },

    // Clear cache for a project (when switching projects)
    clearProject(projectId: number) {
      this.criteriaCache.delete(projectId)
      console.log(`[ProjectStore] Cleared cache for project ${projectId}`)
    },

    // Clear all cache (when logging out)
    clearAll() {
      this.criteriaCache.clear()
      console.log(`[ProjectStore] Cleared all cache`)
    },

    // Load criteria from API and cache it
    async loadCriteria(projectId: number, apiCall: () => Promise<any>) {
      // Check cache first
      const cached = this.criteriaCache.get(projectId)
      if (cached) {
        console.log(`[ProjectStore] Using cached criteria for project ${projectId}`)
        return cached
      }

      // Load from API
      console.log(`[ProjectStore] Loading criteria from API for project ${projectId}`)
      const criteria = await apiCall()

      if (criteria) {
        this.setCriteria(projectId, criteria)
      }

      return criteria
    },
  },
})
