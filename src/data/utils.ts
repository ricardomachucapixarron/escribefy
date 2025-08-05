// Utilidades para datos mock

/**
 * Simula una carga asíncrona con delay
 */
export function simulateAsyncLoad<T>(data: T, delay: number = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

/**
 * Simula un error de carga asíncrona
 */
export function simulateAsyncError(message: string, delay: number = 1000): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, delay)
  })
}
