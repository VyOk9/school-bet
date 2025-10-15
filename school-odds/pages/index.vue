<script setup lang="ts">
import type { PrefillPayload, Classe, Lycee } from '~/types/form'
import { ref, computed, onMounted } from 'vue'
import { useFetch, navigateTo } from '#app'
import { CLASSES, BAC_TYPES, SPECIALITES } from '~/constants/data'
import LyceePicker from '~/components/LyceePicker.vue'

const FORM_STORAGE_KEY = 'edumapper_form_data'

const lycee = ref<Lycee | '' | null>(null)
const ville = ref('Lille')
const typeLycee = ref('Lycée Public')
const showLyceePicker = ref(false)

const selectedClasse = ref<Classe | null>(null)
const selectedBacType = ref<string | null>(null)

const classeExpanded = ref(false)
const specialitesExpanded = ref(false)

const { data: prefillData } = useFetch<PrefillPayload>('/api/prefill')

onMounted(() => {
  const savedData = sessionStorage.getItem(FORM_STORAGE_KEY)
  
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      lycee.value = parsed.lycee || 'Etienne Dolet'
      ville.value = parsed.ville || 'Lille'
      typeLycee.value = parsed.typeLycee || 'Lycée Public'
      selectedClasse.value = parsed.selectedClasse || null
      selectedBacType.value = parsed.selectedBacType || null
    } catch {
      lycee.value = prefillData.value?.lycee ?? 'Etienne Dolet'
      selectedClasse.value = prefillData.value?.classe ?? null
    }
  } else {
    lycee.value = prefillData.value?.lycee ?? 'Etienne Dolet'
    selectedClasse.value = prefillData.value?.classe ?? null
  }
})

function openPicker() {
  showLyceePicker.value = true
}

function onPick(newLycee: Lycee) {
  lycee.value = newLycee
  showLyceePicker.value = false
  saveToStorage()
}

function saveToStorage() {
  const formData = {
    lycee: lycee.value,
    ville: ville.value,
    typeLycee: typeLycee.value,
    selectedClasse: selectedClasse.value,
    selectedBacType: selectedBacType.value,
  }
  sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData))
}

const isFormComplete = computed(() => {
  if (!selectedClasse.value) return false
  if (selectedClasse.value === 'Terminale' && !selectedBacType.value) return false
  return true
})

function goToFicheAvenir() {
  if (isFormComplete.value) {
    saveToStorage()
    navigateTo('/fiche-avenir')
  }
}
</script>

<template>
  <main class="min-h-dvh bg-gray-50 pb-20">
    <header class="bg-white px-5 py-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">Edumapper<span class="text-orange-500">*</span></h1>
    </header>

    <div v-if="lycee === null" class="px-5 py-6 max-w-md mx-auto">
      <div class="gradient-card rounded-2xl p-5 mb-6 shadow-lg animate-pulse">
        <div class="h-6 bg-white/30 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
        <div class="h-8 bg-white/40 rounded-full w-24"></div>
      </div>
    </div>

    <div v-else class="px-5 py-6 max-w-md mx-auto">
      <div class="gradient-card rounded-2xl p-5 mb-6 text-white shadow-lg">
        <h2 class="text-xl font-bold mb-2">{{ lycee }}</h2>
        <div class="flex items-center gap-3 text-sm mb-4 opacity-90">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            {{ ville }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            {{ typeLycee }}
          </span>
        </div>
        <button 
          @click="openPicker"
          class="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Modifier
        </button>
      </div>

      <section class="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden">
        <button 
          @click="classeExpanded = !classeExpanded"
          class="w-full px-5 py-4 flex items-center justify-between text-left"
        >
          <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-900 mb-1">Classe</h3>
            <p v-if="selectedClasse && selectedBacType" class="text-sm text-gray-600">
              {{ selectedClasse }}, {{ selectedBacType }}
            </p>
            <p v-else-if="selectedClasse" class="text-sm text-gray-600">{{ selectedClasse }}</p>
            <p v-else class="text-sm text-gray-400">À compléter</p>
          </div>
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform"
            :class="{ 'rotate-180': classeExpanded }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div v-if="classeExpanded" class="px-5 pb-5 space-y-5">
          <div>
            <div class="flex gap-2 mb-4">
              <button
                v-for="c in CLASSES" 
                :key="c"
                @click="selectedClasse = c; saveToStorage()"
                class="flex-1 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
                :class="selectedClasse === c 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ c }}
              </button>
            </div>
          </div>

          <div v-if="selectedClasse === 'Terminale'">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Type de bac</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in BAC_TYPES"
                :key="type"
                @click="selectedBacType = type; saveToStorage()"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all"
                :class="selectedBacType === type
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <button
            @click="classeExpanded = false"
            :disabled="!isFormComplete"
            class="w-full bg-gray-900 text-white py-3 rounded-xl font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Confirmer
          </button>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
        <button 
          @click="specialitesExpanded = !specialitesExpanded"
          class="w-full px-5 py-4 flex items-center justify-between text-left"
        >
          <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-900 mb-1">Spécialités</h3>
            <p class="text-sm text-gray-400">À compléter</p>
          </div>
          <svg 
            class="w-5 h-5 text-gray-400 transition-transform"
            :class="{ 'rotate-180': specialitesExpanded }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div v-if="specialitesExpanded" class="px-5 pb-5">
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="s in SPECIALITES" :key="s" class="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">
              {{ s }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mb-4">Valeurs non requises pour le test.</p>
          <button
            @click="specialitesExpanded = false"
            class="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Confirmer
          </button>
        </div>
      </section>

      <button
        @click="goToFicheAvenir"
        :disabled="!isFormComplete"
        class="w-full py-3 rounded-xl font-medium transition-colors"
        :class="isFormComplete 
          ? 'bg-gray-900 text-white hover:bg-gray-800' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      >
        Confirmer
      </button>
    </div>

    <LyceePicker v-if="showLyceePicker" :modelValue="lycee || ''" @pick="onPick" @close="showLyceePicker=false"/>
  </main>
</template>
