<template>
  <FixedLeftColumn>
    <template #fixed>
      <Button class="button-mobile block" color="gray">Назад</Button>
      <div class="block">
        <InputDate v-model:model-value="dateRange" placeholder="Период" :editable="true" :range="true" />
        <Search
          v-model:search-query="searchValue"
          v-model:search-type="filter"
          :search-types="searchTypes"
          select-display-value="icon"
          @submit="handleSearch"
        />
        <div class="toggles">
          <Toggle color="gray" @click="handleAll">Все</Toggle>
          <Toggle color="gray" @click="handleReverse"><i class="fa-regular fa-arrow-down-arrow-up" /></Toggle>
        </div>
      </div>
      <div class="block">
        <Select v-model:model-value="select" placeholder="Год" :items="yearItems" />
        <div class="buttons">
          <Button class="button" @click="handleSelect">Показать</Button>
          <Button class="button" color="gray" @click="handleClear">Сбросить</Button>
        </div>
      </div>
    </template>
    <template #default>
      <ScrollArea v-if="orders">
        <StatusCard v-for="order in orders" :key="order.id" :status="statuses[order.status]">
          №: {{ order.id }}
        </StatusCard>
      </ScrollArea>
      <Empty v-else />
    </template>
  </FixedLeftColumn>
</template>

<script setup lang="ts">
import { formatDate } from "@vueuse/core";

import { Search } from "~/shared/ui/search";
import { InputDate } from "~/shared/ui/inputs/input-date";
import { FixedLeftColumn } from "~/shared/ui/templates";
import { Toggle } from "~/shared/ui/toggle";
import { Button } from "~/shared/ui/button";
import { Select } from "~/shared/ui/select";
import { ScrollArea } from "~/shared/ui/scroll-area";
import { StatusCard } from "~/shared/ui/status-card";
import { Empty } from "~/shared/ui/empty";

import { internalAPIFetch } from "~/shared/api/internal/instance";

import type { RequestType, OrderType, StatusesType } from "./types";

const yearItems = ref([
  {
    value: "2023"
  },
  {
    value: "2022"
  },
  {
    value: "2021"
  }
]);

const searchTypes = ref({
  order_number: {
    placeholder: "Номер заказа",
    title: "Номер заказа"
  },
  psid: {
    placeholder: "Номер фотосессии",
    title: "Номер фотосессии"
  },
  client_id: {
    placeholder: "Клиент ID",
    title: "Клиент ID"
  },
  phone: {
    placeholder: "Телефон",
    title: "Телефон"
  },
  email: {
    placeholder: "Email",
    title: "Email"
  },
  payer: {
    placeholder: "Плательщик",
    title: "Плательщик"
  }
});

const statuses: StatusesType = {
  1: "idle",
  2: "success"
};

const dateRange = ref<Date[]>([new Date(), new Date()]);
const searchValue = ref("");
const filter = ref("order_number");
const select = ref("2023");

const url = "orders.getTest" as const;
const orders = ref<OrderType[] | undefined>([]);

const handleSearch = async () => {
  const dateStart = formatDate(new Date(dateRange.value[0]), "YYYYMMDD");
  const dateFinish = formatDate(new Date(dateRange.value[1]), "YYYYMMDD");

  const dateQuery = dateRange.value ? `&date_start=${dateStart}&date_finish=${dateFinish}` : "";

  const requestUrl = `${url}?search_type=${filter.value}&search_value=${searchValue.value}${dateQuery}`;
  const { response }: RequestType = await internalAPIFetch(requestUrl);

  orders.value = response.data.orders;
};

const handleSelect = async () => {
  const requestUrl = `${url}?year=${select.value}`;
  const { response }: RequestType = await internalAPIFetch(requestUrl);

  orders.value = response.data.orders;
};

const handleClear = () => (orders.value = []);

const handleAll = async () => {
  const requestUrl = `${url}?search_type=${filter.value}`;
  const { response }: RequestType = await internalAPIFetch(requestUrl);

  orders.value = response.data.orders;
};

const handleReverse = () => orders.value?.reverse();
</script>

<style scoped>
@import "~/shared/assets/styles/components/orders/_orders.scss";
</style>
