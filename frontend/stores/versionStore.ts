import { defineStore } from 'pinia'

export const useVersionStore = defineStore('version', {
  state: () => ({
    versions: [] as any[],
    currentVersion: null as any,
    loading: false as boolean,
    error: null as string | null,
  }),

  getters: {
    /**
     * ตรวจสอบว่ามี versions หรือไม่
     */
    hasVersions: (state) => state.versions.length > 0,

    /**
     * จำนวน versions ทั้งหมด
     */
    totalVersions: (state) => state.versions.length,

    /**
     * Version ปัจจุบัน
     */
    getCurrentVersionId: (state) => state.currentVersion?.id || null,

    /**
     * หา version ที่เป็น current version
     */
    currentActiveVersion: (state) => {
      return state.versions.find(v => v.isCurrent) || null
    },

    /**
     * หา version โดย ID
     */
    getVersionById: (state) => (id: number) => {
      return state.versions.find(v => v.id === id) || null
    },
  },

  actions: {
    /**
     * โหลด versions ทั้งหมดของ project
     */
    async loadVersions(projectId: number) {
      this.loading = true
      this.error = null

      try {
        const data = await useApi().versionsApi.list(projectId)

        this.versions = data
        // ถ้าไม่ได้เลือก version อยู่ ให้เลือก current version
        if (!this.currentVersion) {
          const current = this.versions.find(v => v.isCurrent)
          if (current) {
            this.currentVersion = current
          }
        }
        return { success: true, data: data }
      } catch (error: any) {
        this.error = error.message || 'Failed to load versions'
        return { success: false, error: { message: error.message } }
      } finally {
        this.loading = false
      }
    },

    /**
     * สร้าง version ใหม่
     */
    async createVersion(projectId: number, versionData: {
      name: string
      description?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const data = await useApi().versionsApi.create(projectId, versionData)

        this.versions.push(data)
        return { success: true, data: data }
      } catch (error: any) {
        this.error = error.message || 'Failed to create version'
        return { success: false, error: { message: error.message } }
      } finally {
        this.loading = false
      }
    },

    /**
     * อัปเดต version
     */
    async updateVersion(versionId: number, versionData: {
      name?: string
      description?: string
      snapshotNetwork?: string
      snapshotFixtures?: string
      snapshotResults?: string
      referenceLayer?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const data = await useApi().versionsApi.update(versionId, versionData)

        const index = this.versions.findIndex(v => v.id === versionId)
        if (index !== -1) {
          this.versions[index] = data
        }
        if (this.currentVersion?.id === versionId) {
          this.currentVersion = data
        }
        return { success: true, data: data }
      } catch (error: any) {
        this.error = error.message || 'Failed to update version'
        return { success: false, error: { message: error.message } }
      } finally {
        this.loading = false
      }
    },

    /**
     * ลบ version
     */
    async deleteVersion(versionId: number) {
      this.loading = true
      this.error = null

      try {
        await useApi().versionsApi.delete(versionId)

        this.versions = this.versions.filter(v => v.id !== versionId)
        if (this.currentVersion?.id === versionId) {
          this.currentVersion = null
        }
        return { success: true }
      } catch (error: any) {
        this.error = error.message || 'Failed to delete version'
        return { success: false, error: { message: error.message } }
      } finally {
        this.loading = false
      }
    },

    /**
     * Clone version
     */
    async duplicateVersion(versionId: number) {
      this.loading = true
      this.error = null

      try {
        const data = await useApi().versionsApi.duplicate(versionId)

        this.versions.push(data)
        return { success: true, data: data }
      } catch (error: any) {
        this.error = error.message || 'Failed to duplicate version'
        return { success: false, error: { message: error.message } }
      } finally {
        this.loading = false
      }
    },

    /**
     * ตั้งค่า version ปัจจุบัน
     */
    setCurrentVersion(version: any) {
      this.currentVersion = version
    },

    /**
     * เปรียบเทียบ 2 versions
     */
    async compareVersions(versionId1: number, versionId2: number) {
      this.loading = true
      this.error = null

      try {
        const data = await useApi().versionsApi.compare(versionId1, versionId2)

        return { success: true, data: data }
      } catch (error: any) {
        this.error = error.message || 'Failed to compare versions'
        return { success: false, error: { message: error.message } }
      } finally {
        this.loading = false
      }
    },
  },
})
