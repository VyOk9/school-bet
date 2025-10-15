// Utility function to get a random item from an array

export function randomItem<T>(arr: readonly T[]): T {
  if (arr.length === 0) {
    throw new Error("randomItem: tableau vide")
  }
  return arr[Math.floor(Math.random() * arr.length)]!
}
