<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-8">
      <h1 class="text-center fw-bold">
        <i class="bi bi-calculator"></i> Calculadora de Tokens
      </h1>
      <p class="text-center text-white-50">
        Ingresa los datos y obtén el desglose de ganancias para modelo y estudio
        de manera instantánea.
      </p>
    </div>
  </div>
  <div class="row mt-5">
    <div class="col-md-5 border border-secondary rounded-5 p-5">
      <h4 class="fw-bold">
        <i class="bi bi-graph-up text-warning"></i> Parámetros de Cálculo
      </h4>
      <form @change="calcular">
        <div class="mt-4">
          <label for="tokens-value" class="form-label"
            ><i class="bi bi-coin text-warning"></i> Cantidad de Tokens</label
          >
          <input
            type="number"
            class="form-control bg-dark text-white border-3 border-warning"
            id="tokens-value"
            v-model="modelTokens"
            autocomplete="off"
            min="0"
          />
        </div>
        <div class="mt-4">
          <label for="percentage" class="form-label"
            ><i class="bi bi-percent text-warning"></i> Porcentaje para la
            modelo</label
          >
          <input
            type="range"
            class="form-range"
            id="percentage"
            min="0"
            max="100"
            v-model="percentage"
          />
          <div class="input-group mt-1 w-50">
            <input
              type="number"
              class="form-control bg-dark text-white border-3 border-warning"
              v-model="percentage"
              id="percentage-input"
              min="0"
              max="100"
            />
            <span
              class="input-group-text bg-dark text-white border-3 border-warning"
              >%</span
            >
          </div>
        </div>
        <div class="mt-4 w-50">
          <label for="token-value" class="form-label"
            ><i class="bi bi-coin text-warning"></i> Valor por Token
          </label>
          <div class="input-group mt-1">
            <span
              class="input-group-text bg-dark text-white border-3 border-warning"
              >$</span
            >
            <input
              type="number"
              class="form-control bg-dark text-white border-3 border-warning"
              id="token-value"
              v-model="tokenValue"
            />
          </div>
        </div>
        <div class="mt-4">
          <label for="dollar-value" class="form-label"
            ><i class="bi bi-currency-dollar text-warning"></i> TRM del Dólar
            &nbsp;
          </label>
          <a
            href="#"
            data-bs-toggle="tooltip"
            data-bs-title="Valor tomado automáticamente desde la API de DolarAPI, puedes modificarlo si lo deseas"
            ><i class="bi bi-info-circle text-warning"></i
          ></a>
          <div class="input-group mt-1">
            <span
              class="input-group-text bg-dark text-white border-3 border-warning"
              >$</span
            >
            <input
              type="number"
              class="form-control bg-dark text-white border-3 border-warning"
              id="dollar-value"
              v-model="dollarValue"
            />
          </div>
        </div>
      </form>
    </div>
    <div class="col mt-4 mt-md-0">
      <div class="text-center border border-secondary rounded-5 p-4">
        <p><i class="bi bi-person text-warning"></i> Valor para la modelo</p>
        <p class="big-text text-warning fw-bold">{{ calcular() }} <br /></p>
        <p class="small">{{ percentage }}% del total producido</p>
      </div>
      <div
        class="d-flex flex-column flex-md-row flex-wrap justify-content-between w-100 gap-2"
      >
        <div
          class="text-center border border-secondary rounded-5 p-4 mt-4 flex-fill"
        >
          <p>
            <i class="bi bi-building text-warning"></i> Valor para el estudio
          </p>
          <p class="h2 fw-bold">{{ parseUSD(studioValue) }}</p>
        </div>
        <div
          class="text-center border border-secondary rounded-5 p-4 mt-4 flex-fill"
        >
          <p class="text-center">
            <i class="bi bi-graph-up text-warning"></i> Total producido
          </p>
          <p class="h2 fw-bold">{{ parseUSD(totalValue) }}</p>
          <p class="small">
            En dolares: {{ parseUSD(totalValue / dollarValue) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Tooltip } from 'bootstrap';

const STORAGE_KEY = 'tokens-calculator-data';

const tokenValue = ref(0.05);
const modelTokens = ref(100);
const percentage = ref(60);
const dollarValue = ref(3600);
const totalValue = ref(0);
const studioValue = ref(0);
const resultado = ref(null);
const loadingRate = ref(false);

const loadStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const saved = JSON.parse(stored);
    if (typeof saved.modelTokens === 'number')
      modelTokens.value = saved.modelTokens;
    if (typeof saved.percentage === 'number')
      percentage.value = saved.percentage;
    if (typeof saved.tokenValue === 'number')
      tokenValue.value = saved.tokenValue;
    if (typeof saved.dollarValue === 'number')
      dollarValue.value = saved.dollarValue;
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
};

const saveStoredData = () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        modelTokens: modelTokens.value,
        percentage: percentage.value,
        tokenValue: tokenValue.value,
        dollarValue: dollarValue.value,
      }),
    );
  } catch (error) {
    console.error('Error saving stored data:', error);
  }
};

onMounted(async () => {
  loadStoredData();
  loadingRate.value = true;
  try {
    const response = await fetch('https://co.dolarapi.com/v1/cotizaciones/usd');
    const data = await response.json();
    dollarValue.value = data.venta;
  } catch (error) {
    console.error('Error fetching dollar value:', error);
  } finally {
    loadingRate.value = false;
  }

  // Initialize tooltips after DOM is ready
  setTimeout(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    [...tooltipTriggerList].forEach(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl),
    );
  }, 0);
});

watch([modelTokens, percentage, tokenValue, dollarValue], () => {
  saveStoredData();
  calcular();
});

const parseUSD = (num) => '$' + Number(num).toLocaleString('es-CO');

const calcular = () => {
  totalValue.value = modelTokens.value * tokenValue.value * dollarValue.value;
  studioValue.value = (totalValue.value * (100 - percentage.value)) / 100;
  return parseUSD(totalValue.value * (percentage.value / 100));
};
</script>
