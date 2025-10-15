const FORM_STORAGE_KEY = "edumapper_form_data"
const RESULT_STORAGE_KEY = "edumapper_resultat"

export function saveFormData(data: unknown): void {
  sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data))
}

export function loadFormData<T>(): T | null {
  const saved = sessionStorage.getItem(FORM_STORAGE_KEY)
  if (!saved) return null

  try {
    return JSON.parse(saved) as T
  } catch {
    return null
  }
}

export function saveResultData(data: unknown): void {
  sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(data))
}

export function loadResultData<T>(): T | null {
  const saved = sessionStorage.getItem(RESULT_STORAGE_KEY)
  if (!saved) return null

  try {
    return JSON.parse(saved) as T
  } catch {
    return null
  }
}

export function clearAllData(): void {
  sessionStorage.removeItem(FORM_STORAGE_KEY)
  sessionStorage.removeItem(RESULT_STORAGE_KEY)
}
