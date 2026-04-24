import { defineStore } from 'pinia'

export type ProjectStep =
  | 'parameters'
  | 'documents'
  | 'network'
  | 'fixtures'
  | 'calculation'
  | 'versions'

export type VersionStep =
  | 'versionUpload'
  | 'versionNetwork'
  | 'versionFixtures'
  | 'versionCalculation'
  | 'versionCompare'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    currentStep: 'parameters' as ProjectStep,
    completedSteps: [] as ProjectStep[],
  }),

  getters: {
    /**
     * ตรวจสอบว่า step นั้น completed หรือยัง
     */
    isStepCompleted: (state) => (step: ProjectStep | VersionStep) => {
      return state.completedSteps.includes(step)
    },

    /**
     * ตรวจสอบว่า step นั้นเป็น step ปัจจุบันหรือไม่
     */
    isCurrentStep: (state) => (step: ProjectStep | VersionStep) => {
      return state.currentStep === step
    },

    /**
     * ดึง step number จาก step name
     */
    getStepNumber: () => (step: ProjectStep | VersionStep): number => {
      const projectSteps: ProjectStep[] = [
        'parameters',
        'documents',
        'network',
        'fixtures',
        'calculation',
        'versions',
      ]
      const versionSteps: VersionStep[] = [
        'versionUpload',
        'versionNetwork',
        'versionFixtures',
        'versionCalculation',
        'versionCompare',
      ]

      const steps = [...projectSteps, ...versionSteps]
      return steps.indexOf(step) + 1
    },

    /**
     * ดึง path จาก step
     */
    getStepPath: () => (step: ProjectStep | VersionStep): string => {
      const paths: Record<string, string> = {
        // Project steps
        parameters: '',
        documents: 'documents',
        network: 'network',
        fixtures: 'fixtures',
        calculation: 'calculation',
        versions: 'versions',
        // Version steps
        versionUpload: 'upload',
        versionNetwork: 'network',
        versionFixtures: 'fixtures',
        versionCalculation: 'calculation',
        versionCompare: 'compare',
      }
      return paths[step]
    },
  },

  actions: {
    /**
     * ตั้งค่า step ปัจจุบัน
     */
    setCurrentStep(step: ProjectStep | VersionStep) {
      this.currentStep = step
    },

    /**
     * ทำเครื่องหมายว่า step นั้นเสร็จแล้ว
     */
    markStepComplete(step: ProjectStep | VersionStep) {
      if (!this.completedSteps.includes(step)) {
        this.completedSteps.push(step)
      }
    },

    /**
     * ถอนเครื่องหมายว่า step นั้นเสร็จแล้ว
     */
    unmarkStepComplete(step: ProjectStep | VersionStep) {
      const index = this.completedSteps.indexOf(step)
      if (index > -1) {
        this.completedSteps.splice(index, 1)
      }
    },

    /**
     * Reset workflow state
     */
    reset() {
      this.currentStep = 'parameters'
      this.completedSteps = []
    },

    /**
     * ดึง step จาก path
     */
    getStepFromPath(path: string): ProjectStep | VersionStep {
      const pathToStep: Record<string, ProjectStep | VersionStep> = {
        // Project steps
        '': 'parameters',
        'documents': 'documents',
        'network': 'network',
        'fixtures': 'fixtures',
        'calculation': 'calculation',
        'versions': 'versions',
        // Version steps
        'upload': 'versionUpload',
        'network': 'versionNetwork',
        'fixtures': 'versionFixtures',
        'calculation': 'versionCalculation',
        'compare': 'versionCompare',
      }

      // ลบ / นำหน้าออก
      const cleanPath = path.startsWith('/') ? path.slice(1) : path
      const lastSegment = cleanPath.split('/').pop() || ''

      return pathToStep[lastSegment] || 'parameters'
    },
  },
})
