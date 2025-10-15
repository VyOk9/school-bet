import type { PrefillPayload } from "~/types/form"
import { LYCEES, CLASSES } from "~/constants/data"
import { randomItem } from "~/utils/random"
import { defineEventHandler } from "h3"

export default defineEventHandler((): PrefillPayload => {
  return {
    lycee: randomItem(LYCEES),
    classe: randomItem(CLASSES),
  }
})
