import type { LYCEES } from "~/constants/data"

export type Lycee = (typeof LYCEES)[number]
export type Classe = "Seconde" | "Première" | "Terminale"

export interface PrefillPayload {
  lycee: Lycee
  classe: Classe
}
