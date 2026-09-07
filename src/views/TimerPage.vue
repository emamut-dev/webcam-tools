<template>
  <div class="mx-auto max-w-6xl">
    <div class="mt-2 mb-8 flex justify-center">
      <div class="w-full max-w-3xl text-center">
        <h1 class="text-3xl font-bold text-slate-100 sm:text-4xl">
          <BiStopwatch class="mr-2 inline text-amber-400" /> Cuenta Regresiva
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-slate-400">
          Configura una cuenta regresiva para cada room y administra tus tiempos
          de transmisión y descanso fácilmente.
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <!-- Panel de Configuración -->
      <div
        class="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
      >
        <div>
          <h2 class="mb-5 text-xl font-semibold text-slate-100 flex items-center">
            <BiSliders class="mr-2 text-amber-400" /> Configuración
          </h2>

          <!-- Duración -->
          <div class="mb-5">
            <div class="mb-2 flex items-center justify-between">
              <label for="duration-input" class="text-sm font-medium text-slate-300">
                Duración por room
              </label>
              <span class="text-xs text-amber-400/90 font-medium">
                {{ durationMinutes }} min ({{ durationMinutes * 60 }}s)
              </span>
            </div>

            <div
              class="flex items-center overflow-hidden rounded-xl border border-amber-400/60 bg-slate-950/70 transition focus-within:ring-2 focus-within:ring-amber-400/50"
            >
              <input
                id="duration-input"
                v-model.number="durationMinutes"
                type="number"
                min="1"
                class="w-full bg-transparent px-3 py-2 text-slate-100 outline-none"
              />
              <span class="px-3 py-2 text-xs text-slate-400">minutos</span>
            </div>

            <!-- Presets rápidos -->
            <div class="mt-2.5 flex flex-wrap gap-1.5">
              <button
                v-for="preset in [5, 10, 15, 20, 30, 45]"
                :key="preset"
                type="button"
                @click="durationMinutes = preset"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-lg transition cursor-pointer border',
                  durationMinutes === preset
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200',
                ]"
              >
                {{ preset }}m
              </button>
            </div>
          </div>

          <!-- Lista de Rooms -->
          <div class="mb-6">
            <div class="mb-2 flex items-center justify-between">
              <label class="text-sm font-medium text-slate-300">
                Salas activas
              </label>
              <span class="text-xs text-slate-400">
                {{ rooms.length }} {{ rooms.length === 1 ? 'room' : 'rooms' }}
              </span>
            </div>

            <div class="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              <div
                v-for="(room, index) in rooms"
                :key="index"
                class="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-1.5 transition focus-within:border-amber-400/50"
              >
                <span
                  class="px-2.5 py-1 text-xs font-semibold text-amber-400 bg-slate-900 rounded-lg shrink-0"
                >
                  #{{ index + 1 }}
                </span>
                <input
                  v-model="rooms[index]"
                  type="text"
                  placeholder="Nombre de la sala"
                  class="w-full bg-transparent px-2 py-1 text-sm text-slate-100 outline-none"
                />
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                  title="Eliminar room"
                  @click="removeRoom(index)"
                >
                  <BiXLg class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones de Configuración -->
        <div class="grid gap-2.5 sm:grid-cols-2 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-amber-400 cursor-pointer shadow-sm"
            @click="addRoom"
          >
            <BiPlusLg class="w-4 h-4" /> Agregar room
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
            @click="resetRooms"
          >
            <BiArrowCounterclockwise class="w-4 h-4" /> Restablecer
          </button>
        </div>
      </div>

      <!-- Temporizadores -->
      <div>
        <RoomTimers :rooms="rooms" :duration-seconds="durationSeconds" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import RoomTimers from '@/components/RoomTimers.vue';
import BiStopwatch from '~icons/bi/stopwatch';
import BiSliders from '~icons/bi/sliders';
import BiPlusLg from '~icons/bi/plus-lg';
import BiXLg from '~icons/bi/x-lg';
import BiArrowCounterclockwise from '~icons/bi/arrow-counterclockwise';

const durationMinutes = ref(20);
const rooms = ref(['Room 1', 'Room 2', 'Room 3']);

const durationSeconds = computed(() => Math.max(1, durationMinutes.value || 1) * 60);

const STORAGE_KEY = 'webcam-tools.timerConfig';

onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.durationMinutes === 'number') {
        durationMinutes.value = parsed.durationMinutes;
      }
      if (Array.isArray(parsed.rooms) && parsed.rooms.length > 0) {
        rooms.value = parsed.rooms;
      }
    } catch (e) {
      // ignore parse errors
    }
  }
});

const saveToStorage = () => {
  const payload = {
    durationMinutes: durationMinutes.value,
    rooms: rooms.value,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore quota errors
  }
};

watch([rooms, durationMinutes], saveToStorage, { deep: true });

const addRoom = () => {
  const nextIndex = rooms.value.length + 1;
  rooms.value.push(`Room ${nextIndex}`);
};

const removeRoom = (index) => {
  rooms.value.splice(index, 1);
};

const resetRooms = () => {
  rooms.value = ['Room 1', 'Room 2', 'Room 3'];
  durationMinutes.value = 20;
};
</script>
