<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Lycee } from '~/types/form'
import { LYCEES } from '~/constants/data'

defineProps<{ modelValue: Lycee | '' }>()
const emit = defineEmits<{ close: []; pick: [value: Lycee] }>()

const query = ref('')
const filtered = computed(() =>
  LYCEES.filter((l) => l.toLowerCase().includes(query.value.toLowerCase()))
)
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4">
    <div class="w-full max-w-lg bg-white rounded-2xl p-4 md:p-6">
      <div class="flex items-center gap-2 mb-4">
        <input
          v-model="query"
          type="text"
          placeholder="Rechercher un lycée…"
          class="w-full border rounded-lg px-3 py-2"
        />
        <button class="text-sm underline" @click="emit('close')">Fermer</button>
      </div>
      <ul class="max-h-72 overflow-auto space-y-1">
        <li v-for="l in filtered" :key="l">
          <button
            class="w-full text-left border rounded-lg px-3 py-2 hover:bg-gray-50"
            @click="emit('pick', l)"
          >
            {{ l }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
