// Centralized data constants - single source of truth

export const LYCEES = [
  "Etienne Dolet",
  "Lycée privé Charles de Foucauld",
  "Lycée polyvalent Guillaume Tirel",
  "Lycée polyvalent l'Initiative",
  "Lycée polyvalent privé Saint Jean de Montmartre",
  "Lycée privé Pascal",
  "Lycée du bâtiment et des travaux publics",
  "Lycée polyvalent privé Saint-Nicolas",
  "Lycée privé La Rochefoucauld",
  "Lycée technique privé de l'école technique supérieure du laboratoire",
  "Lycée privé Charles Péguy",
  "Lycée privé Sainte-Louise",
  "Lycée privé L'Ecole alsacienne",
  "Lycée polyvalent ESAA-Ecole Boulle",
  "Lycée polyvalent Paul Poiret",
  "Lycée Charlemagne",
  "Lycée Claude Monet",
  "Lycée privé Lucien de Hirsch",
  "Lycée privé Saint-Michel de Picpus",
] as const

export const CLASSES = ["Seconde", "Première", "Terminale"] as const

export const BAC_TYPES = ["Général", "Technologique", "Professionnel"] as const

export const SPECIALITES = [
  "HGGSP",
  "HLP",
  "LLCE",
  "LCA",
  "Maths",
  "NSI",
  "PC",
  "SVT",
  "SI",
  "SES",
  "EPS",
  "Arts",
  "BE",
] as const

export const SCHOOLS = [
  { school: "EDHEC Business School", location: "Roubaix", program: "International BBA" },
  { school: "ESSEC Business School", location: "Cergy", program: "Global BBA" },
  { school: "HEC Paris", location: "Jouy-en-Josas", program: "Grande École" },
  { school: "ESCP Business School", location: "Paris", program: "Bachelor in Management" },
  { school: "EM Lyon", location: "Lyon", program: "Global BBA" },
  { school: "Sciences Po", location: "Paris", program: "Bachelor" },
  { school: "Université Paris-Dauphine", location: "Paris", program: "Licence Gestion" },
] as const
