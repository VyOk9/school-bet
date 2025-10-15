<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { $fetch } from 'ofetch'
import { navigateTo } from '#app'
import type { Lycee } from '~/types/form'

const FORM_STORAGE_KEY = 'edumapper_form_data'

const file = ref<File | null>(null)
const status = ref<'idle' | 'uploading' | 'done' | 'error'>('idle')
const error = ref<string | null>(null)
const skipFile = ref(false)

const lycee = ref<Lycee | null>(null)
const ville = ref('Lille')
const typeLycee = ref('Lycée Public')

onMounted(() => {
  const savedData = sessionStorage.getItem(FORM_STORAGE_KEY)
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      lycee.value = parsed.lycee || 'Etienne Dolet'
      ville.value = parsed.ville || 'Lille'
      typeLycee.value = parsed.typeLycee || 'Lycée Public'
    } catch {
      lycee.value = 'Etienne Dolet'
    }
  } else {
    lycee.value = 'Etienne Dolet'
  }
})

function onDrop(e: DragEvent) {
  e.preventDefault()
  const f = e.dataTransfer?.files?.[0]
  if (f) validateAndSet(f)
}

function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) validateAndSet(f)
}

function validateAndSet(f: File) {
  error.value = null
  if (f.type !== 'application/pdf') { error.value = 'PDF uniquement.'; return }
  if (f.size > 5 * 1024 * 1024) { error.value = 'Taille max 5 Mo.'; return }
  file.value = f
  skipFile.value = false
}

async function upload() {
  if (!file.value && !skipFile.value) return

  try {
    status.value = 'uploading'
    if (file.value) {
      await $fetch('/api/fiche-avenir', { method: 'POST', body: { name: file.value.name, size: file.value.size } })
    }
    status.value = 'done'
    await new Promise(r => setTimeout(r, 400))
    navigateTo('/resultat')
  } catch {
    status.value = 'error'
    error.value = 'Échec de l\'envoi, réessayez.'
  }
}
</script>

<template>
  <main class="min-h-dvh bg-gray-50">
    <header class="bg-white px-5 py-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">Edumapper<span class="text-orange-500">*</span></h1>
    </header>

    <div class="px-5 py-6 max-w-md mx-auto">
      <div v-if="lycee" class="bg-gray-100 rounded-2xl p-5 mb-6 border border-gray-300">
        <h2 class="text-lg font-semibold text-gray-500 mb-2">{{ lycee }}</h2>
        <div class="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <span>{{ ville }} | {{ typeLycee }}</span>
        </div>
        <button 
          disabled
          class="bg-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed"
        >
          Modifier
        </button>
      </div>

       File upload section with Edumapper styling 
      <section class="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div class="flex items-start gap-3 mb-4">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900 mb-1">
              Joindre ma fiche avenir pour cette formation
            </h3>
            <p class="text-xs text-gray-500">
              Transmettre la fiche Avenir permet d'affiner le résultat de tes chances d'admission.
            </p>
          </div>
        </div>

        <div
          v-if="!file"
          class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center"
          @dragover.prevent
          @drop="onDrop"
        >
          <label class="cursor-pointer">
            <input type="file" class="hidden" accept="application/pdf" @change="onPick" />
            <div class="text-sm text-gray-600">
              Glisse ton fichier ici ou <span class="text-blue-600 underline">parcourir</span>
            </div>
          </label>
        </div>

        <div v-else class="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ Math.round(file.size / 1024) }} Ko</p>
          </div>
          <button @click="file = null" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <p v-if="error" class="text-red-600 text-sm mt-3">{{ error }}</p>
      </section>

      <button
        @click="upload"
        :disabled="status === 'uploading' || (!file && !skipFile)"
        class="w-full py-3 rounded-xl font-medium mb-3 transition-colors"
        :class="(file || skipFile) && status !== 'uploading'
          ? 'bg-gray-900 text-white hover:bg-gray-800'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      >
        {{ status === 'uploading' ? 'Envoi en cours...' : 'Suivant' }}
      </button>

      <button
        @click="skipFile = true; upload()"
        class="w-full text-sm text-gray-600 underline hover:text-gray-900"
      >
        Je n'ai pas de fiche Avenir pour cette formation
      </button>
    </div>
  </main>
</template>
