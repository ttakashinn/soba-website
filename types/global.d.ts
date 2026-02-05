import type Alpine from 'alpinejs'

declare global {
  interface Window {
    Alpine: typeof Alpine
  }
  const Alpine: typeof Alpine
}

export {}