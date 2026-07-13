<template>
  <div class="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex justify-center">
      <div class="max-w-3xl text-center">
        <h1 class="text-3xl font-bold text-slate-100">
          <BiStopwatch class="mr-2 inline" /> Cuenta Regresiva
        </h1>
        <p class="mt-3 text-slate-400">
          Configura una cuenta regresiva para cada room y administra tus tiempos
          de descanso según tus necesidades.
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div
        class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
      >
        <h2 class="mb-4 text-xl font-semibold text-slate-100">Configuración</h2>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-slate-300"
            >Duración (minutos)</label
          >
          <input
            v-model.number="durationMinutes"
            type="number"
            min="1"
            class="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none"
          />
        </div>

        <div class="mb-4">
          <label class="mb-2 block text-sm font-medium text-slate-300"
            >Rooms</label
          >
          <div class="space-y-2">
            <div
              v-for="(room, index) in rooms"
              :key="index"
              class="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-2"
            >
              <input
                v-model="rooms[index]"
                type="text"
                class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
              />
              <button
                type="button"
                class="rounded-lg border border-rose-500/40 p-2 text-rose-400 transition hover:bg-rose-500/10"
                @click="removeRoom(index)"
              >
                <BiXLg />
              </button>
            </div>
          </div>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            class="rounded-xl bg-amber-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-amber-400"
            @click="addRoom"
          >
            Agregar room
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-300 transition hover:bg-slate-800"
            @click="resetRooms"
          >
            Reset
          </button>
        </div>
      </div>

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
import BiXLg from '~icons/bi/x-lg';

const durationMinutes = ref(0.5);
const rooms = ref(['Room 1', 'Room 2', 'Room 3']);

const durationSeconds = computed(() => Math.max(1, durationMinutes.value) * 60);

const STORAGE_KEY = 'webcam-tools.timerConfig';

onMounted(() => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.durationMinutes === 'number') {
        durationMinutes.value = parsed.durationMinutes;
      }
      if (Array.isArray(parsed.rooms)) {
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
  durationMinutes.value = 5;
};
</script>
