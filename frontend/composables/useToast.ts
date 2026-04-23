// Toast notification composable
export const useToast = () => {
  const toast = inject<{
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
  }>('toast', {
    success: (msg: string) => console.log('✓', msg),
    error: (msg: string) => console.error('✕', msg),
    warning: (msg: string) => console.warn('⚠', msg),
    info: (msg: string) => console.info('ℹ', msg),
  })

  return toast
}
