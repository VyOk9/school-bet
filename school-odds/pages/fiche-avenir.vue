<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { $fetch } from 'ofetch'
import { navigateTo } from '#app'
import type { Lycee } from '~/types/form'

const FORM_STORAGE_KEY = 'edumapper_form_data'
const ALLOWED_MIME = 'application/pdf'
const ALLOWED_EXT = '.pdf'
const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

type Status = 'idle' | 'uploading' | 'done' | 'error'

const file = ref<File | null>(null)
const status = ref<Status>('idle')
const error = ref<string | null>(null)
const skipFile = ref(false)

const lycee = ref<Lycee | null>(null)
const ville = ref('Lille')
const typeLycee = ref('Lycée Public')

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.round(kb)} Ko`
  const mb = kb / 1024
  return `${mb.toFixed(2)} Mo`
}

function isPdf(f: File) {
  const byMime = f.type === ALLOWED_MIME
  const byExt = f.name.toLowerCase().endsWith(ALLOWED_EXT)
  return byMime || byExt
}

onMounted(() => {
  const saved = sessionStorage.getItem(FORM_STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
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

watch([lycee, ville, typeLycee], ([l, v, t]) => {
  try {
    sessionStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify({ lycee: l, ville: v, typeLycee: t })
    )
  } catch {
  }
})

const fileInput = ref<HTMLInputElement | null>(null)
const dropActive = ref(false)

function openPicker() {
  fileInput.value?.click()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dropActive.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) validateAndSet(f)
}

function onPick(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) validateAndSet(f)
}

function onPaste(e: ClipboardEvent) {
  const f = e.clipboardData?.files?.[0]
  if (f) validateAndSet(f)
}

function validateAndSet(f: File) {
  error.value = null
  if (!isPdf(f)) { error.value = 'PDF uniquement.'; return }
  if (f.size > MAX_SIZE) { error.value = 'Taille maximale : 5 Mo.'; return }
  file.value = f
  skipFile.value = false
}

function clearFile() {
  file.value = null
  skipFile.value = false
  error.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function upload() {
  if (status.value === 'uploading') return
  if (!file.value && !skipFile.value) return

  try {
    status.value = 'uploading'
    error.value = null

    if (file.value) {
      await $fetch('/api/fiche-avenir', {
        method: 'POST',
        body: { name: file.value.name, size: file.value.size }
      })
    }

    status.value = 'done'
    await new Promise(r => setTimeout(r, 400))
    navigateTo('/resultat')
  } catch {
    status.value = 'error'
    error.value = 'Échec de l’envoi, réessayez.'
    await nextTick()
    document.getElementById('upload-error')?.focus?.()
  }
}
</script>

<template>
  <main class="min-h-dvh bg-gray-50" @paste="onPaste">
    <header class="bg-white px-5 py-4 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">
        Edumapper<span class="text-orange-500">*</span>
      </h1>
    </header>

    <div class="px-5 py-6 max-w-md mx-auto">
      <div v-if="lycee" class="bg-gray-100 rounded-2xl p-5 mb-6 border border-gray-300">
        <h2 class="text-lg font-semibold text-gray-500 mb-2">{{ lycee }}</h2>
        <div class="flex items-center gap-3 text-sm text-gray-400 mb-3">
          <span>{{ ville }} | {{ typeLycee }}</span>
        </div>
        <button
          disabled
          type="button"
          class="bg-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm font-medium cursor-not-allowed"
          aria-disabled="true"
        >
          Modifier
        </button>
      </div>

      <section class="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <div class="flex items-start gap-3 mb-4">
          <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900 mb-1">
              Joindre ma fiche Avenir pour cette formation
            </h3>
            <p class="text-xs text-gray-500">
              Transmettre la fiche Avenir permet d’affiner le résultat de tes chances d’admission.
            </p>
          </div>
        </div>

        <div
          v-if="!file"
          class="border-2 border-dashed rounded-xl p-6 text-center transition-colors"
          :class="dropActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'"
          @dragover.prevent="dropActive = true"
          @dragleave.prevent="dropActive = false"
          @drop="onDrop"
          role="button"
          tabindex="0"
          aria-label="Déposer un fichier PDF ou parcourir"
          @keydown.enter.prevent="openPicker"
          @keydown.space.prevent="openPicker"
        >
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="application/pdf,.pdf"
            @change="onPick"
          />
          <button
            type="button"
            class="text-sm text-gray-600"
            @click="openPicker"
          >
            Glisse ton fichier ici ou
            <span class="text-blue-600 underline">parcourir</span>
          </button>
          <p class="mt-2 text-xs text-gray-500">PDF, max {{ Math.round(MAX_SIZE/1024/1024) }} Mo</p>
        </div>

        <div v-else class="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
          <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 break-all">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
          </div>
          <button type="button" @click="clearFile" class="text-gray-400 hover:text-gray-600" aria-label="Retirer le fichier">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <p
          v-if="error"
          id="upload-error"
          class="text-red-600 text-sm mt-3"
          role="alert"
          tabindex="-1"
          aria-live="polite"
        >
          {{ error }}
        </p>
      </section>

      <button
        type="button"
        @click="upload"
        :disabled="status === 'uploading' || (!file && !skipFile)"
        class="w-full py-3 rounded-xl font-medium mb-3 transition-colors"
        :class="(file || skipFile) && status !== 'uploading'
          ? 'bg-gray-900 text-white hover:bg-gray-800'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        :aria-busy="status === 'uploading'"
      >
        <span v-if="status === 'uploading'">Envoi en cours…</span>
        <span v-else>Suivant</span>
      </button>

      <button
        type="button"
        @click="skipFile = true; upload()"
        class="w-full text-sm text-gray-600 underline hover:text-gray-900"
      >
        Je n’ai pas de fiche Avenir pour cette formation
      </button>
    </div>
  </main>
</template>
