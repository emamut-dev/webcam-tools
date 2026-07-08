<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 hover:cursor-pointer"
        @click="startAll"
      >
        Iniciar todos
      </button>
      <button
        type="button"
        class="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400 hover:cursor-pointer"
        @click="stopAll"
      >
        Pausar todos
      </button>
      <button
        type="button"
        class="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:cursor-pointer"
        @click="resetAll"
      >
        Reiniciar todos
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div v-for="room in roomStates" :key="room.id" class="h-full">
        <div
          class="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div>
              <h5 class="text-lg font-semibold text-slate-100">
                {{ room.name }}
              </h5>
              <p class="mt-1 text-sm text-slate-400">
                Duración inicial: {{ formatTime(initialDuration) }}
              </p>
            </div>
            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="
                room.status === 'Activo'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : room.status === 'Detenido'
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-slate-700 text-slate-300'
              "
            >
              {{ room.status }}
            </span>
          </div>

          <div class="mb-4 text-center">
            <p class="text-5xl font-semibold text-slate-100">
              {{ formatTime(room.remaining) }}
            </p>
            <p class="mt-2 text-sm text-slate-400">
              {{ room.remaining === 0 ? 'Terminado' : 'En curso' }}
            </p>
          </div>

          <div class="mt-auto grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              class="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
              @click="startRoom(room)"
              :disabled="room.running || room.remaining === 0"
            >
              <BiPlayFill class="mx-auto w-6 h-8" />
            </button>
            <button
              type="button"
              class="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
              @click="stopRoom(room)"
              :disabled="!room.running"
            >
              <BiPauseFill class="mx-auto w-6 h-8" />
            </button>
            <button
              type="button"
              class="rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:cursor-pointer"
              @click="resetRoom(room)"
            >
              <BiArrowCounterclockwise class="mx-auto w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';
import BiPlayFill from '~icons/bi/play-fill';
import BiPauseFill from '~icons/bi/pause-fill';
import BiArrowCounterclockwise from '~icons/bi/arrow-counterclockwise';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => [],
  },
  durationSeconds: {
    type: Number,
    default: 300,
  },
});

const roomStates = ref([]);
const initialDuration = ref(props.durationSeconds);

const STORAGE_KEY = 'webcam-tools.timerConfig';

const loadStoredConfig = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

const saveRoomProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const base = raw ? JSON.parse(raw) : {};
    base.roomProgress = roomStates.value.map((r) => ({
      name: r.name,
      remaining: r.remaining,
      running: r.running,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
  } catch (e) {
    // ignore storage errors
  }
};

const createRoomState = (name, index) => ({
  id: `${name}-${index}-${Date.now()}`,
  name,
  remaining: props.durationSeconds,
  running: false,
  intervalId: null,
  status: 'Detenido',
});

const clearRoomInterval = (room) => {
  if (room.intervalId !== null) {
    clearInterval(room.intervalId);
    room.intervalId = null;
  }
};

const audioCtx = ref(null);
const getAudioCtx = () => {
  if (audioCtx.value) return audioCtx.value;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  audioCtx.value = new C();
  return audioCtx.value;
};

const playBeep = (frequency = 880, duration = 0.25, volume = 0.2) => {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = frequency;
    g.gain.value = volume;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    o.start(now);
    g.gain.setValueAtTime(volume, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    o.stop(now + duration + 0.05);
  } catch (e) {
    // ignore audio errors
  }
};

const stopRoom = (room) => {
  clearRoomInterval(room);
  room.running = false;
  room.status = room.remaining === 0 ? 'Terminado' : 'Detenido';
};

const tickRoom = (room) => {
  if (room.remaining <= 0) {
    stopRoom(room);
    if (!room._notified) {
      playBeep();
      room._notified = true;
    }
    return;
  }

  room.remaining = Math.max(0, room.remaining - 1);
  if (room.remaining === 0) {
    stopRoom(room);
    if (!room._notified) {
      playBeep();
      room._notified = true;
    }
  }
};

const startRoom = (room) => {
  if (room.running || room.remaining === 0) {
    return;
  }

  room.running = true;
  room.status = 'Activo';
  room.intervalId = window.setInterval(() => tickRoom(room), 1000);
};

const resetRoom = (room) => {
  stopRoom(room);
  room.remaining = props.durationSeconds;
  room.status = 'Detenido';
  room._notified = false;
};

const startAll = () => {
  roomStates.value.forEach(startRoom);
};

const stopAll = () => {
  roomStates.value.forEach(stopRoom);
};

const resetAll = () => {
  roomStates.value.forEach(resetRoom);
};

const initializeRooms = () => {
  stopAll();
  const stored = loadStoredConfig();
  const storedProgress =
    stored && Array.isArray(stored.roomProgress) ? stored.roomProgress : null;

  roomStates.value = props.rooms.map((name, index) => {
    const state = createRoomState(name, index);
    state._notified = state.remaining === 0;
    if (storedProgress) {
      const matchByName = storedProgress.find((p) => p.name === name);
      const match = matchByName || storedProgress[index];
      if (match && typeof match.remaining === 'number') {
        state.remaining = Math.max(
          0,
          Math.min(props.durationSeconds, match.remaining),
        );
      }
      if (match && typeof match.running === 'boolean') {
        state.running = !!match.running;
        state.status = state.running
          ? 'Activo'
          : state.remaining === 0
            ? 'Terminado'
            : 'Detenido';
        if (state.running && state.remaining > 0) {
          state.intervalId = window.setInterval(() => tickRoom(state), 1000);
        }
      }
    }
    return state;
  });

  initialDuration.value = props.durationSeconds;
};

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

watch(
  () => props.rooms,
  () => {
    initializeRooms();
  },
  { deep: true, immediate: true },
);

watch(
  () => props.durationSeconds,
  (value) => {
    initialDuration.value = value;
    roomStates.value.forEach((room) => {
      if (!room.running) {
        room.remaining = value;
      }
    });
  },
);

watch(roomStates, saveRoomProgress, { deep: true });

onBeforeUnmount(() => {
  stopAll();
});
</script>
