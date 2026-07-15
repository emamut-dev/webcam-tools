<template>
  <div class="mt-4 flex justify-center">
    <div class="w-full max-w-3xl text-center">
      <h1 class="text-center text-3xl font-bold text-slate-100">
        <BiCalculator class="mr-2 inline" /> Calculadora de Tokens
      </h1>
      <p class="mx-auto mt-3 max-w-2xl text-slate-400">
        Ingresa los datos y obtén el desglose de ganancias para modelo y estudio
        de manera instantánea.
      </p>
    </div>
  </div>

  <div
    class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] mx-auto"
  >
    <div
      class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
    >
      <h4 class="text-xl font-semibold text-slate-100">
        <BiGraphUp class="mr-2 inline text-amber-400" /> Parámetros de Cálculo
      </h4>

      <form @change="calcular" class="mt-6 space-y-5">
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
            class="w-full rounded-xl border border-amber-400/60 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none ring-0"
          />
        </div>

        <div>
          <label
            for="percentage"
            class="mb-2 flex items-center text-sm font-medium text-slate-300"
          >
            <BiPercent class="mr-2 text-amber-400" /> Porcentaje para la modelo
          </label>
          <input
            id="percentage"
            v-model="percentage"
            type="range"
            min="0"
            max="100"
            class="w-full accent-amber-400"
          />
          <div class="mt-2 flex items-center gap-2">
            <input
              id="percentage-input"
              v-model="percentage"
              type="number"
              min="0"
              max="100"
              class="w-full rounded-xl border border-amber-400/60 bg-slate-950/70 px-3 py-2 text-slate-100 outline-none ring-0"
            />
            <span
              class="rounded-xl border border-amber-400/60 bg-slate-950/70 px-3 py-2 text-slate-100"
              >%</span
            >
          </div>
        </div>

        <div>
          <label
            for="token-value"
            class="mb-2 flex items-center text-sm font-medium text-slate-300"
          >
            <BiCoin class="mr-2 text-amber-400" /> Valor por Token
          </label>
          <div
            class="flex items-center overflow-hidden rounded-xl border border-amber-400/60 bg-slate-950/70"
          >
            <span class="px-3 py-2 text-slate-100">$</span>
            <input
              id="token-value"
              v-model="tokenValue"
              type="number"
              class="w-full bg-transparent px-3 py-2 text-slate-100 outline-none ring-0"
            />
          </div>
        </div>

        <div>
          <label
            for="dollar-value"
            class="mb-2 flex items-center text-sm font-medium text-slate-300"
          >
            <BiCurrencyDollar class="mr-2 text-amber-400" /> TRM del Dólar
          </label>
          <a
            href="#"
            class="ml-1 inline-flex text-amber-400"
            data-bs-toggle="tooltip"
            data-bs-title="Valor tomado automáticamente desde la API de DolarAPI, puedes modificarlo si lo deseas"
          >
            <BiInfoCircle />
          </a>
          <div
            class="mt-2 flex items-center overflow-hidden rounded-xl border border-amber-400/60 bg-slate-950/70"
          >
            <span class="px-3 py-2 text-slate-100">$</span>
            <input
              id="dollar-value"
              v-model="formattedDollar"
              type="text"
              inputmode="decimal"
              class="w-full bg-transparent px-3 py-2 text-slate-100 outline-none ring-0"
            />
          </div>
        </div>
      </form>
    </div>

    <div class="flex flex-col gap-4">
      <div
        class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-sm"
      >
        <p class="flex items-center justify-center text-slate-300">
          <BiPerson class="mr-2 text-amber-400" /> Valor para la modelo
        </p>
        <p class="mt-3 text-5xl font-bold text-amber-400 sm:text-6xl">
          {{ calcular() }}
        </p>
        <p class="mt-2 text-sm text-slate-400">
          {{ percentage }}% del total producido
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div
          class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-sm"
        >
          <p class="flex items-center justify-center text-slate-300">
            <BiBuilding class="mr-2 text-amber-400" /> Valor para el estudio
          </p>
          <p class="mt-3 text-3xl font-bold text-slate-100">
            {{ parseUSD(studioValue) }}
          </p>
        </div>
        <div
          class="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 text-center shadow-sm"
        >
          <p class="flex items-center justify-center text-slate-300">
            <BiGraphUp class="mr-2 text-amber-400" /> Total producido
          </p>
          <p class="mt-3 text-3xl font-bold text-slate-100">
            {{ parseUSD(totalValue) }}
          </p>
          <p class="mt-2 text-sm text-slate-400">
            En dolares: {{ parseUSD(totalValue / dollarValue) }}
          </p>
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

const createFormattedComputed = (
  numRef,
  { decimals = 0, locale = 'es-CO' } = {},
) => {
  const formatter = new Intl.NumberFormat(
    locale,
    decimals > 0
      ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
      : {},
  );

  return computed({
    get() {
      return formatter.format(numRef.value);
    },
    set(valor) {
      const str = valor == null ? '' : String(valor).trim();
      if (decimals > 0) {
        let v = str.replace(/[^0-9.,]/g, '');
        const lastComma = v.lastIndexOf(',');
        const lastDot = v.lastIndexOf('.');
        const lastSep = Math.max(lastComma, lastDot);
        if (lastSep !== -1) {
          const integerPart = v.slice(0, lastSep).replace(/[.,]/g, '') || '0';
          let fractionPart = v.slice(lastSep + 1).replace(/[.,]/g, '');
          fractionPart = fractionPart.slice(0, decimals);
          v = fractionPart ? `${integerPart}.${fractionPart}` : integerPart;
        } else {
          v = v.replace(/[.,]/g, '') || '0';
        }
        numRef.value = v === '' ? 0 : Number(v);
      } else {
        const limpio = str.replace(/\D/g, '') || '0';
        numRef.value = Number(limpio);
      }
    },
  });
};

const formattedAmount = createFormattedComputed(modelTokens, { decimals: 0 });

const formattedDollar = createFormattedComputed(dollarValue, { decimals: 2 });

const parseUSD = (num) => '$' + Number(num).toLocaleString('es-CO');

const calcular = () => {
  totalValue.value = modelTokens.value * tokenValue.value * dollarValue.value;
  studioValue.value = (totalValue.value * (100 - percentage.value)) / 100;
  return parseUSD(totalValue.value * (percentage.value / 100));
};
</script>
