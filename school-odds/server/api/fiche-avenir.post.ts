// server/api/fiche-avenir.post.ts
export default defineEventHandler(async (event) => {
    // Ici on “mock” l’upload et on répond OK.
    const body = await readBody<{ name: string; size: number }>(event)
    return { ok: true, received: body }
  })
  