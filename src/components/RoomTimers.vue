<template>
  <div class="space-y-4">
    <!-- Barra de Control Global -->
    <div
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3"
    >
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 cursor-pointer shadow-sm"
          @click="startAll"
        >
          <BiPlayFill class="w-4 h-4" /> Iniciar todos
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-400 cursor-pointer shadow-sm"
          @click="stopAll"
        >
          <BiPauseFill class="w-4 h-4" /> Pausar todos
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
          @click="resetAll"
        >
          <BiArrowCounterclockwise class="w-4 h-4" /> Reiniciar todos
        </button>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          v-if="hasNotificationSupport && notificationPermission !== 'granted'"
          type="button"
          @click="requestNotificationPermission"
          class="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
          title="Permitir notificaciones de escritorio al finalizar cada sala"
        >
          <BiBell class="w-3.5 h-3.5" /> Activar alertas
        </button>
        <span
          v-else-if="hasNotificationSupport && notificationPermission === 'granted'"
          class="hidden sm:flex items-center gap-1 text-xs text-emerald-400/90"
          title="Notificaciones de escritorio activadas"
        >
          <BiBellFill class="w-3.5 h-3.5" /> Alertas activadas
        </span>

        <span class="text-xs text-slate-400 px-1">
          {{ activeRoomsCount }} activas / {{ roomStates.length }} total
        </span>
      </div>
    </div>

    <!-- Grid de Rooms -->
    <div class="grid gap-4 md:grid-cols-2">
      <div v-for="room in roomStates" :key="room.id" class="h-full">
        <div
          class="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-slate-900/80 p-5 shadow-sm transition-all duration-300"
          :class="[
            room.status === 'Activo'
              ? 'border-emerald-500/40 shadow-emerald-950/20'
              : room.status === 'Terminado'
                ? 'border-rose-500/50 shadow-rose-950/20'
                : 'border-slate-800',
          ]"
        >
          <!-- Barra superior de estado -->
          <div
            v-if="room.status === 'Activo'"
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"
          ></div>
          <div
            v-else-if="room.status === 'Terminado'"
            class="absolute top-0 left-0 right-0 h-1 bg-rose-500 animate-pulse"
          ></div>

          <div>
            <!-- Encabezado de Room -->
            <div class="mb-4 flex items-start justify-between gap-3">
              <div>
                <h5 class="text-lg font-bold text-slate-100 tracking-tight">
                  {{ room.name }}
                </h5>
                <p class="mt-0.5 text-xs text-slate-400">
                  Duración: {{ formatTime(initialDuration) }}
                </p>
              </div>

              <!-- Badge de estado -->
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  room.status === 'Activo'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : room.status === 'Terminado'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                "
              >
                <span
                  v-if="room.status === 'Activo'"
                  class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"
                ></span>
                {{ room.status }}
              </span>
            </div>

            <!-- Contador de tiempo -->
            <div class="my-4 text-center">
              <p
                class="font-mono tabular-nums text-5xl font-extrabold tracking-tight transition-colors sm:text-6xl"
                :class="
                  room.status === 'Terminado'
                    ? 'text-rose-400'
                    : room.status === 'Activo'
                      ? 'text-emerald-400'
                      : 'text-slate-100'
                "
              >
                {{ formatTime(room.remaining) }}
              </p>
              <p class="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                {{
                  room.remaining === 0
                    ? '¡Tiempo terminado!'
                    : room.running
                      ? 'En progreso'
                      : 'En pausa'
                }}
              </p>
            </div>

            <!-- Barra de Progreso -->
            <div class="mb-5 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="
                  room.status === 'Activo'
                    ? 'bg-emerald-400'
                    : room.remaining === 0
                      ? 'bg-rose-500'
                      : 'bg-slate-600'
                "
                :style="{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      (room.remaining / (initialDuration || 1)) * 100,
                    ),
                  )}%`,
                }"
              ></div>
            </div>
          </div>

          <!-- Botones de Control por Room -->
          <div class="mt-auto grid gap-2 sm:grid-cols-3 pt-3 border-t border-slate-800/60">
            <button
              type="button"
              class="flex items-center justify-center rounded-xl bg-emerald-500 py-2.5 text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-sm"
              title="Iniciar"
              @click="startRoom(room)"
              :disabled="room.running || room.remaining === 0"
            >
              <BiPlayFill class="w-5 h-5" />
            </button>
            <button
              type="button"
              class="flex items-center justify-center rounded-xl bg-amber-500 py-2.5 text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-sm"
              title="Pausar"
              @click="stopRoom(room)"
              :disabled="!room.running"
            >
              <BiPauseFill class="w-5 h-5" />
            </button>
            <button
              type="button"
              class="flex items-center justify-center rounded-xl border border-slate-700 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-slate-100 cursor-pointer"
              title="Reiniciar"
              @click="resetRoom(room)"
            >
              <BiArrowCounterclockwise class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { play } from 'cuelume';

import BiPlayFill from '~icons/bi/play-fill';
import BiPauseFill from '~icons/bi/pause-fill';
import BiArrowCounterclockwise from '~icons/bi/arrow-counterclockwise';
import BiBell from '~icons/bi/bell';
import BiBellFill from '~icons/bi/bell-fill';

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

const activeRoomsCount = computed(
  () => roomStates.value.filter((r) => r.running).length,
);

const hasNotificationSupport =
  typeof window !== 'undefined' && 'Notification' in window;
const notificationPermission = ref(
  hasNotificationSupport ? Notification.permission : 'denied',
);

const requestNotificationPermission = async () => {
  if (!hasNotificationSupport) return;
  try {
    const perm = await Notification.requestPermission();
    notificationPermission.value = perm;
  } catch (e) {
    // ignore
  }
};

const playAlarm = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      play('sparkle');
      return;
    }
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // Secuencia de alarma audible: 4 ráfagas espaciadas
    for (let burst = 0; burst < 4; burst++) {
      const baseTime = burst * 0.65;
      [0, 0.14, 0.28].forEach((timeOffset) => {
        const startTime = ctx.currentTime + baseTime + timeOffset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, startTime);
        osc.frequency.setValueAtTime(1100, startTime + 0.05);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.35, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.12);
      });
    }
  } catch {
    play('sparkle');
  }
};

const notifyTimerEnd = (room) => {
  playAlarm();

  if (hasNotificationSupport && notificationPermission.value === 'granted') {
    try {
      new Notification(`¡Tiempo terminado: ${room.name}!`, {
        body: `La cuenta regresiva para ${room.name} ha finalizado.`,
        icon: '/favicon.ico',
        tag: `timer-${room.name}`,
      });
    } catch (e) {
      // ignore notification errors
    }
  }
};

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

const stopRoom = (room) => {
  clearRoomInterval(room);
  room.running = false;
  room.status = room.remaining === 0 ? 'Terminado' : 'Detenido';
};

const tickRoom = (room) => {
  if (room.remaining <= 0) {
    stopRoom(room);
    if (!room._notified) {
      notifyTimerEnd(room);
      room._notified = true;
    }
    return;
  }

  room.remaining = Math.max(0, room.remaining - 1);
  if (room.remaining === 0) {
    stopRoom(room);
    if (!room._notified) {
      notifyTimerEnd(room);
      room._notified = true;
    }
  }
};

const startRoom = (room) => {
  if (room.running || room.remaining === 0) {
    return;
  }

  if (hasNotificationSupport && notificationPermission.value === 'default') {
    requestNotificationPermission();
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
