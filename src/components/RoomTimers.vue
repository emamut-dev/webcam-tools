<template>
  <div class="room-timers">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="btn-group">
        <button class="btn btn-sm btn-success" type="button" @click="startAll">
          Iniciar todos
        </button>
        <button
          class="btn btn-sm btn-warning mx-3"
          type="button"
          @click="stopAll"
        >
          Pausar todos
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          type="button"
          @click="resetAll"
        >
          Reiniciar todos
        </button>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 col-md-6" v-for="room in roomStates" :key="room.id">
        <div
          class="card bg-dark text-white border-secondary rounded-5 h-100 shadow-sm"
        >
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="card-title mb-1">{{ room.name }}</h5>
                <p class="text-muted mb-0">
                  Duración inicial: {{ formatTime(initialDuration) }}
                </p>
              </div>
              <span
                class="badge align-self-start"
                :class="
                  room.status === 'Activo'
                    ? 'bg-success'
                    : room.status === 'Detenido'
                      ? 'bg-danger'
                      : 'bg-secondary'
                "
                >{{ room.status }}</span
              >
            </div>

            <div class="text-center mb-3">
              <p class="display-6 mb-1">{{ formatTime(room.remaining) }}</p>
              <p class="text-muted mb-0">
                {{ room.remaining === 0 ? 'Terminado' : 'En curso' }}
              </p>
            </div>

            <div class="mt-auto d-flex flex-wrap gap-2">
              <button
                class="btn btn-sm btn-success flex-grow-1"
                type="button"
                @click="startRoom(room)"
                :disabled="room.running || room.remaining === 0"
              >
                <BiPlayFill class="fs-4" />
              </button>
              <button
                class="btn btn-sm btn-warning flex-grow-1"
                type="button"
                @click="stopRoom(room)"
                :disabled="!room.running"
              >
                <BiPauseFill class="fs-4" />
              </button>
              <button
                class="btn btn-sm btn-light flex-grow-1"
                type="button"
                @click="resetRoom(room)"
              >
                <BiArrowCounterclockwise class="fs-4" />
              </button>
            </div>
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
