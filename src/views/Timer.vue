<template>
  <div class="container mt-5">
    <div class="row justify-content-center mb-4">
      <div class="col-md-8 text-center">
        <h1 class="fw-bold">Timer por Rooms</h1>
        <p class="text-white mb-0">
          Deserunt reprehenderit irure consequat esse qui eu. Consectetur dolore
          sunt ipsum velit. Exercitation cillum tempor enim non culpa magna
          ullamco consequat id occaecat deserunt excepteur sint id. Dolore elit
          sit ea fugiat.
        </p>
      </div>
    </div>

    <div class="row gy-4 mt-4">
      <div class="col-12 col-lg-4">
        <div class="card border-secondary bg-dark text-white rounded-5 mb-4">
          <div class="card-body">
            <h2 class="h5 mb-3">Configuración</h2>

            <div class="mb-3">
              <label class="form-label">Duración (minutos)</label>
              <input
                type="number"
                class="form-control bg-dark text-white"
                min="1"
                v-model.number="durationMinutes"
              />
            </div>

            <div class="mb-3 bg-dark">
              <label class="form-label">Rooms</label>
              <div class="list-group">
                <div
                  v-for="(room, index) in rooms"
                  :key="index"
                  class="list-group-item d-flex align-items-center justify-content-between border-0 bg-dark"
                >
                  <input
                    type="text"
                    class="form-control form-control-sm bg-dark text-white me-2"
                    v-model="rooms[index]"
                  />
                  <button
                    class="btn btn-sm btn-outline-danger"
                    type="button"
                    @click="removeRoom(index)"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2">
              <button
                class="btn btn-primary w-100"
                type="button"
                @click="addRoom"
              >
                Agregar room
              </button>
              <button
                class="btn btn-outline-secondary w-100"
                type="button"
                @click="resetRooms"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8">
        <RoomTimers :rooms="rooms" :duration-seconds="durationSeconds" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import RoomTimers from '@/components/RoomTimers.vue';

const durationMinutes = ref(20);
const rooms = ref(['Room 1', 'Room 2', 'Room 3']);

const durationSeconds = computed(() => Math.max(1, durationMinutes.value) * 60);

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
