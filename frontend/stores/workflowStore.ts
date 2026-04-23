import { defineStore } from 'pinia'

export type ProjectStep =
  | 'parameters'
  | 'documents'
  | 'network'
  | 'fixtures'
  | 'calculation'
  | 'versions'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    currentStep: 'parameters' as ProjectStep,
    completedSteps: [] as ProjectStep[],
  }),

  getters: {
    /**
     * ตรวจสอบว่า step นั้น completed หรือยัง
     */
    isStepCompleted: (state) => (step: ProjectStep) => {
      return state.completedSteps.includes(step)
    },

    /**
     * ตรวจสอบว่า step นั้นเป็น step ปัจจุบันหรือไม่
     */
    isCurrentStep: (state) => (step: ProjectStep) => {
      return state.currentStep === step
    },

    /**
     * ดึง step number จาก step name
     */
    getStepNumber: () => (step: ProjectStep): number => {
      const steps: ProjectStep[] = [
        'parameters',
        'documents',
        'network',
        'fixtures',
        'calculation',
        'versions',
      ]
      return steps.indexOf(step) + 1
    },

    /**
     * ดึง path จาก step
     */
    getStepPath: () => (step: ProjectStep): string => {
      const paths: Record<ProjectStep, string> = {
        parameters: '',
        documents: 'documents',
        network: 'network',
        fixtures: 'fixtures',
        calculation: 'calculation',
        versions: 'versions',
      }
      return paths[step]
    },
  },

  actions: {
    /**
     * ตั้งค่า step ปัจจุบัน
     */
    setCurrentStep(step: ProjectStep) {
      this.currentStep = step
    },

    /**
     * ทำเครื่องหมายว่า step นั้นเสร็จแล้ว
     */
    markStepComplete(step: ProjectStep) {
      if (!this.completedSteps.includes(step)) {
        this.completedSteps.push(step)
      }
    },

    /**
     * ถอนเครื่องหมายว่า step นั้นเสร็จแล้ว
     */
    unmarkStepComplete(step: ProjectStep) {
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
    getStepFromPath(path: string): ProjectStep {
      const pathToStep: Record<string, ProjectStep> = {
        '': 'parameters',
        'documents': 'documents',
        'network': 'network',
        'fixtures': 'fixtures',
        'calculation': 'calculation',
        'versions': 'versions',
      }

      // ลบ / นำหน้าออก
      const cleanPath = path.startsWith('/') ? path.slice(1) : path
      const lastSegment = cleanPath.split('/').pop() || ''

      return pathToStep[lastSegment] || 'parameters'
    },
  },
})
