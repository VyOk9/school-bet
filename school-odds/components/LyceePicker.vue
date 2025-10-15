<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Lycee } from '~/types/form'
import { LYCEES } from '~/constants/data'

defineProps<{ modelValue: Lycee | '' }>()
const emit = defineEmits<{ close: []; pick: [value: Lycee] }>()

const query = ref('')

const LYCEES_LC = LYCEES.map(l => [l, l.toLocaleLowerCase('fr')]) as ReadonlyArray<readonly [Lycee, string]>

const queryLC = computed(() => query.value.toLocaleLowerCase('fr'))

const filtered = computed(() =>
  LYCEES_LC
    .filter(([, low]) => low.includes(queryLC.value))
    .map(([orig]) => orig)
)
</script>

<template>
  <div
    class="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lycee-dialog-title"
  >
    <div class="w-full max-w-lg bg-white rounded-2xl p-4 md:p-6">
      <div class="flex items-center gap-2 mb-4">
        <h2 id="lycee-dialog-title" class="sr-only">Choisir un lycée</h2>
        <input
          v-model="query"
          type="text"
          placeholder="Rechercher un lycée…"
          class="w-full border rounded-lg px-3 py-2"
          autocomplete="off"
          autocapitalize="none"
          autocorrect="off"
          spellcheck="false"
          autofocus
          aria-label="Rechercher un lycée"
        />
        <button type="button" class="text-sm underline" @click="emit('close')">
          Fermer
        </button>
      </div>

      <ul class="max-h-72 overflow-auto space-y-1" role="listbox" aria-label="Résultats">
        <li v-for="l in filtered" :key="l">
          <button
            type="button"
            class="w-full text-left border rounded-lg px-3 py-2 hover:bg-gray-50"
            role="option"
            @click="emit('pick', l)"
          >
            {{ l }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
