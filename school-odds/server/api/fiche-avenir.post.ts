export default defineEventHandler(async (event) => {
    const body = await readBody<{ name: string; size: number }>(event)
    return { ok: true, received: body }
  })
  