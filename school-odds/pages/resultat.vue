<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#app'
import { SCHOOLS } from '~/constants/data'
import { randomItem } from '~/utils/random'
import type { Lycee } from '~/types/form'

type School = (typeof SCHOOLS)[number]

type Formation = School & {
  admissionChance: number
  reliability: number
}

const STORAGE_KEY = 'edumapper_resultat'
const FORM_STORAGE_KEY = 'edumapper_form_data'

const lycee = ref<Lycee | null>(null)
const ville = ref('Lille')
const typeLycee = ref('Lycée Public')

const formation = ref<Formation>({
  school: 'EDHEC Business School',
  location: 'Roubaix',
  program: 'International BBA',
  admissionChance: 91,
  reliability: 4,
})

function generateRandomResults() {
  const selectedSchool = randomItem(SCHOOLS)
  const admissionChance = Math.floor(Math.random() * 70) + 20
  const reliability = Math.floor(Math.random() * 3) + 3

  formation.value = {
    ...selectedSchool,
    admissionChance,
    reliability,
  }
}

onMounted(() => {
  const formData = sessionStorage.getItem(FORM_STORAGE_KEY)
  if (formData) {
    try {
      const parsed = JSON.parse(formData)
      lycee.value = parsed.lycee || 'Etienne Dolet'
      ville.value = parsed.ville || 'Lille'
      typeLycee.value = parsed.typeLycee || 'Lycée Public'
    } catch {
      lycee.value = 'Etienne Dolet'
    }
  } else {
    lycee.value = 'Etienne Dolet'
  }

  // Load or generate results
  const savedResults = sessionStorage.getItem(STORAGE_KEY)
  
  if (savedResults) {
    try {
      formation.value = JSON.parse(savedResults)
    } catch {
      generateRandomResults()
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formation.value))
    }
  } else {
    generateRandomResults()
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formation.value))
  }
})

const chanceLevel = computed(() => {
  const chance = formation.value.admissionChance
  if (chance >= 80) return 'Très élevées'
  if (chance >= 60) return 'Élevées'
  if (chance >= 40) return 'Moyennes'
  return 'Faibles'
})

function testAnother() {
  sessionStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(FORM_STORAGE_KEY)
  navigateTo('/')
}
</script>

<template>
  <main class="min-h-dvh bg-gray-50">
    <header class="bg-white px-5 py-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">
        Edumapper<span class="text-orange-500">*</span>
      </h1>
    </header>

    <div class="px-5 py-6 max-w-md mx-auto">
      <div v-if="lycee" class="bg-gray-100 rounded-2xl p-4 mb-6 border border-gray-300">
        <p class="text-xs text-gray-500 mb-1">Votre lycée</p>
        <h3 class="text-base font-semibold text-gray-700">{{ lycee }}</h3>
        <p class="text-sm text-gray-500">{{ ville }} · {{ typeLycee }}</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div class="flex flex-col items-center">
          <div class="relative w-40 h-40 mb-6">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" stroke-width="12" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#gradient)"
                stroke-width="12"
                stroke-linecap="round"
                :stroke-dasharray="`${2 * Math.PI * 70}`"
                :stroke-dashoffset="`${2 * Math.PI * 70 * (1 - formation.admissionChance / 100)}`"
                class="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color: #ff6b35; stop-opacity: 1" />
                  <stop offset="50%" style="stop-color: #f7931e; stop-opacity: 1" />
                  <stop offset="100%" style="stop-color: #a855f7; stop-opacity: 1" />
                </linearGradient>
              </defs>
            </svg>

            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div class="text-center mb-4">
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="text-4xl font-bold text-gray-900">{{ formation.admissionChance }}%</span>
              <span class="text-lg text-gray-600">• {{ chanceLevel }}</span>
            </div>

            <div class="flex items-center justify-center gap-1">
              <span class="text-sm text-gray-600 mr-1">Fiabilité</span>
              <div class="flex gap-0.5">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= formation.reliability ? 'text-gray-900' : 'text-gray-300'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-500 text-center leading-relaxed">
            Cette estimation est fournie à titre indicatif et ne garantit en aucun cas la décision
            d'admission de l'établissement.
          </p>
        </div>
      </div>

      <button
        @click="testAnother"
        class="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
      >
        Tester une autre formation
      </button>
    </div>
  </main>
</template>
