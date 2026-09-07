<template>
  <div class="mx-auto max-w-6xl">
    <div class="mt-2 flex justify-center">
      <div class="w-full max-w-3xl text-center">
        <h1 class="text-center text-3xl font-bold text-slate-100 sm:text-4xl">
          <BiCalculator class="mr-2 inline text-amber-400" /> Calculadora de Tokens
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-slate-400">
          Ingresa los datos y obtén el desglose de ganancias para modelo y estudio
          de manera instantánea.
        </p>
      </div>
    </div>

    <div
      class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      <!-- Panel de Parámetros -->
      <div
        class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm flex flex-col justify-between"
      >
        <div>
          <h4 class="text-xl font-semibold text-slate-100 flex items-center">
            <BiGraphUp class="mr-2 text-amber-400" /> Parámetros de Cálculo
          </h4>

          <div class="mt-6 space-y-5">
            <!-- Cantidad de Tokens -->
            <div>
              <label
                for="tokens-value"
                class="mb-2 flex items-center text-sm font-medium text-slate-300"
              >
                <BiCoin class="mr-2 text-amber-400" /> Cantidad de Tokens
              </label>
              <input
                id="tokens-value"
                v-model="formattedAmount"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="0"
                class="w-full rounded-xl border border-amber-400/60 bg-slate-950/70 px-3 py-2.5 text-slate-100 outline-none transition focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <!-- Porcentaje para la modelo -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label
                  for="percentage"
                  class="flex items-center text-sm font-medium text-slate-300"
                >
                  <BiPercent class="mr-1.5 text-amber-400" /> Porcentaje para la modelo
                </label>
                <span class="text-xs text-slate-400">
                  Estudio: {{ 100 - percentage }}%
                </span>
              </div>
              <input
                id="percentage"
                v-model.number="percentage"
                type="range"
                min="0"
                max="100"
                class="w-full accent-amber-400 cursor-pointer"
              />
              <div class="mt-2 flex items-center gap-2">
                <input
                  id="percentage-input"
                  v-model.number="percentage"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full rounded-xl border border-amber-400/60 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none transition focus:ring-2 focus:ring-amber-400/50"
                />
                <span
                  class="rounded-xl border border-amber-400/60 bg-slate-950/70 px-3 py-2 text-slate-300 font-medium"
                >
                  %
                </span>
              </div>
            </div>

            <!-- Valor por Token -->
            <div>
              <label
                for="token-value"
                class="mb-2 flex items-center text-sm font-medium text-slate-300"
              >
                <BiCoin class="mr-2 text-amber-400" /> Valor por Token (USD)
              </label>
              <div
                class="flex items-center overflow-hidden rounded-xl border border-amber-400/60 bg-slate-950/70 transition focus-within:ring-2 focus-within:ring-amber-400/50"
              >
                <span class="px-3 py-2 text-slate-400 font-medium">$</span>
                <input
                  id="token-value"
                  v-model.number="tokenValue"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full bg-transparent px-2 py-2 text-slate-100 outline-none"
                />
                <span class="px-3 py-2 text-xs text-slate-400">USD</span>
              </div>
            </div>

            <!-- TRM del Dólar -->
            <div>
              <div class="mb-2 flex items-center justify-between">
                <label
                  for="dollar-value"
                  class="flex items-center text-sm font-medium text-slate-300"
                >
                  <BiCurrencyDollar class="mr-1.5 text-amber-400" /> TRM del Dólar (COP)
                  <span
                    class="ml-1.5 inline-flex cursor-help text-slate-400 hover:text-amber-400 transition"
                    title="Tasa de cambio COP/USD. Puedes digitar cualquier valor manualmente o consultar la tasa oficial de DolarAPI con el botón Actualizar."
                  >
                    <BiInfoCircle class="w-4 h-4 inline" />
                  </span>
                </label>
                <span
                  v-if="isManualDollar"
                  class="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20"
                >
                  Manual
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20"
                >
                  DolarAPI
                </span>
              </div>

              <div
                class="flex items-center overflow-hidden rounded-xl border border-amber-400/60 bg-slate-950/70 transition focus-within:ring-2 focus-within:ring-amber-400/50"
              >
                <span class="px-3 py-2 text-slate-400 font-medium">$</span>
                <input
                  id="dollar-value"
                  v-model.number="dollarValue"
                  @input="isManualDollar = true"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  class="w-full bg-transparent px-2 py-2 text-slate-100 outline-none"
                />
                <button
                  type="button"
                  @click="fetchDolarRate"
                  :disabled="loadingRate"
                  class="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 disabled:opacity-50 transition cursor-pointer border-l border-slate-800 shrink-0"
                  title="Actualizar TRM oficial desde DolarAPI"
                >
                  <BiArrowClockwise
                    :class="['w-4 h-4', loadingRate ? 'animate-spin' : '']"
                  />
                  <span class="hidden sm:inline">{{ loadingRate ? 'Cargando...' : 'Actualizar TRM' }}</span>
                </button>
              </div>

              <div class="mt-2 flex items-center justify-between text-xs text-slate-400">
                <p>
                  TRM registrada:
                  <span class="font-semibold text-slate-200">{{ formatCOP(dollarValue) }} COP</span>
                </p>
                <button
                  v-if="isManualDollar"
                  type="button"
                  @click="fetchDolarRate"
                  class="text-amber-400 hover:underline cursor-pointer"
                >
                  Restablecer a oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de Resultados -->
      <div class="flex flex-col gap-4">
        <!-- Tarjeta Principal: Ganancia para la Modelo -->
        <div
          class="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-sm"
        >
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300"
          ></div>
          <p
            class="flex items-center justify-center text-sm font-semibold uppercase tracking-wider text-amber-400"
          >
            <BiPerson class="mr-2 w-5 h-5" /> Ganancia para la modelo
          </p>
          <p
            class="mt-3 text-4xl font-extrabold text-amber-400 sm:text-5xl md:text-6xl tracking-tight"
          >
            {{ formatCOP(modelEarningsCOP) }}
          </p>
          <div
            class="mt-3 flex items-center justify-center gap-2 text-sm text-slate-300"
          >
            <span
              class="rounded-lg bg-amber-400/10 px-2.5 py-1 font-semibold text-amber-300 border border-amber-400/20"
            >
              {{ formatUSD(modelEarningsUSD) }} USD
            </span>
            <span class="text-slate-400">({{ percentage }}% del total)</span>
          </div>
        </div>

        <!-- Tarjetas Secundarias: Estudio y Total -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Estudio -->
          <div
            class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-sm"
          >
            <p
              class="flex items-center justify-center text-sm font-medium text-slate-300"
            >
              <BiBuilding class="mr-2 text-amber-400 w-4 h-4" /> Valor para el estudio
            </p>
            <p class="mt-3 text-2xl sm:text-3xl font-bold text-slate-100">
              {{ formatCOP(studioEarningsCOP) }}
            </p>
            <div
              class="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400"
            >
              <span class="text-slate-300 font-medium">{{ formatUSD(studioEarningsUSD) }} USD</span>
              <span>({{ 100 - percentage }}%)</span>
            </div>
          </div>

          <!-- Total -->
          <div
            class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-sm"
          >
            <p
              class="flex items-center justify-center text-sm font-medium text-slate-300"
            >
              <BiGraphUp class="mr-2 text-amber-400 w-4 h-4" /> Total producido
            </p>
            <p class="mt-3 text-2xl sm:text-3xl font-bold text-slate-100">
              {{ formatCOP(totalCOP) }}
            </p>
            <div
              class="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400"
            >
              <span class="text-slate-300 font-medium">{{ formatUSD(totalUSD) }} USD</span>
              <span>({{ formattedAmount }} tokens)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import BiCalculator from '~icons/bi/calculator';
import BiGraphUp from '~icons/bi/graph-up';
import BiCoin from '~icons/bi/coin';
import BiPercent from '~icons/bi/percent';
import BiCurrencyDollar from '~icons/bi/currency-dollar';
import BiInfoCircle from '~icons/bi/info-circle';
import BiPerson from '~icons/bi/person';
import BiBuilding from '~icons/bi/building';
import BiArrowClockwise from '~icons/bi/arrow-clockwise';

const STORAGE_KEY = 'tokens-calculator-data';

const tokenValue = ref(0.05);
const modelTokens = ref(100);
const percentage = ref(60);
const dollarValue = ref(3600);
const isManualDollar = ref(false);
const loadingRate = ref(false);

const loadStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const saved = JSON.parse(stored);
    if (typeof saved.modelTokens === 'number')
      modelTokens.value = saved.modelTokens;
    if (typeof saved.percentage === 'number')
      percentage.value = saved.percentage;
    if (typeof saved.tokenValue === 'number')
      tokenValue.value = saved.tokenValue;
    if (typeof saved.dollarValue === 'number')
      dollarValue.value = saved.dollarValue;
    if (typeof saved.isManualDollar === 'boolean')
      isManualDollar.value = saved.isManualDollar;
    return true;
  } catch (error) {
    console.error('Error loading stored data:', error);
    return false;
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
        isManualDollar: isManualDollar.value,
      }),
    );
  } catch (error) {
    console.error('Error saving stored data:', error);
  }
};

const fetchDolarRate = async () => {
  loadingRate.value = true;
  try {
    const response = await fetch('https://co.dolarapi.com/v1/cotizaciones/usd');
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    if (typeof data.venta === 'number') {
      dollarValue.value = data.venta;
      isManualDollar.value = false;
      saveStoredData();
    }
  } catch (error) {
    console.error('Error fetching dollar value:', error);
  } finally {
    loadingRate.value = false;
  }
};

onMounted(async () => {
  const hasStored = loadStoredData();
  // Fetch from DolarAPI on first visit if no manual rate was registered
  if (!hasStored || !isManualDollar.value) {
    await fetchDolarRate();
  }
});

watch([modelTokens, percentage, tokenValue, dollarValue, isManualDollar], () => {
  saveStoredData();
});

// Formateo para cantidad de tokens (enteros)
const formattedAmount = computed({
  get() {
    return new Intl.NumberFormat('es-CO').format(modelTokens.value || 0);
  },
  set(valor) {
    const str = valor == null ? '' : String(valor).trim();
    const limpio = str.replace(/\D/g, '') || '0';
    modelTokens.value = Number(limpio);
  },
});

// Cálculos reactivos puros
const totalUSD = computed(
  () => (Number(modelTokens.value) || 0) * (Number(tokenValue.value) || 0),
);
const modelEarningsUSD = computed(
  () => (totalUSD.value * (Number(percentage.value) || 0)) / 100,
);
const studioEarningsUSD = computed(
  () => totalUSD.value - modelEarningsUSD.value,
);

const totalCOP = computed(
  () => totalUSD.value * (Number(dollarValue.value) || 0),
);
const modelEarningsCOP = computed(
  () => (totalCOP.value * (Number(percentage.value) || 0)) / 100,
);
const studioEarningsCOP = computed(
  () => totalCOP.value - modelEarningsCOP.value,
);

// Formateadores de moneda
const formatCOP = (num) =>
  '$ ' + Math.round(Number(num) || 0).toLocaleString('es-CO');

const formatUSD = (num) =>
  '$ ' +
  Number(num || 0).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
</script>
