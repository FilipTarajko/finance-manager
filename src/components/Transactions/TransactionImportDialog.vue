<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue';
import { useAccountsStore } from '@/stores/accountsStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import type { Category } from '@/types/types';

const accountsStore = useAccountsStore();
const currenciesStore = useCurrenciesStore();
const categoriesStore = useCategoriesStore();

const isDialogShown: Ref<boolean | undefined> = defineModel();
const parsedRows = ref<string[][] | null>(null);
const importRelativeFontSize = ref(1.0);
const sourceVisibility = ref(true);
const outputVisibility = ref(true);
const fileHasHeader = ref(true);
const output = ref<Record<FieldNames, any>[]>([]);

const columnSeparator = ',';

const props = defineProps<{
  fileToImportTransactions: any;
}>();

watch(isDialogShown, (isDialogShown) => {
  if (isDialogShown) {
    tryLoadFile();
  }
});

function tryLoadFile() {
  if (!props.fileToImportTransactions.length) {
    console.error('No file selected!');
    return;
  }
  const file = props.fileToImportTransactions[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileContent = e?.target?.result;
    if (typeof fileContent == 'string') {
      parsedRows.value = parseAsCsv(fileContent);
    }
  };
  reader.readAsText(file);
}

function parseAsCsv(text: string): string[][] {
  const rows = text.replaceAll('"', '').split('\n');
  rows.pop();
  const rowsParsed: string[][] = [];
  for (let i = 0; i < rows.length; i++) {
    rowsParsed.push(rows[i].split(columnSeparator));
  }
  return rowsParsed;
}

function getValueForField(field: FieldImportSetting, rowNumber: number) {
  if (field.selected === null) {
    return `not set`;
  }

  let rawValue;
  if (field.type === FieldInputType.readColumn) {
    rawValue = contentRows?.value![rowNumber][field.selected];
  } else if (field.type === FieldInputType.selectValue) {
    rawValue = field;
  } else if (field.type === FieldInputType.mapFromColumn) {
    rawValue = [field, contentRows?.value![rowNumber][field.selected]];
  }

  const format = field?.formats?.find((format) => format.id == field?.currentFormatId);

  if (field.validator) {
    const validationResult = field.validator(rawValue, format);
    if (validationResult !== true) {
      field.hasError = true;
      return { error: validationResult };
    }
  }

  return field.mapper(rawValue, format?.parse);
}

function valueOrEntire(x: { value?: any }): any {
  return x?.value ?? x;
}

function saveOutput() {
  // TODO: order transactions by date whenever edited
  // TODO: handle saving better
  output.value.forEach((outputTransaction) => {
    categoriesStore.createAndAddTransaction(
      valueOrEntire(outputTransaction.name),
      valueOrEntire(outputTransaction.amount),
      valueOrEntire(outputTransaction.category),
      valueOrEntire(outputTransaction.account),
      valueOrEntire(outputTransaction.timestamp),
    );
  });
  isDialogShown.value = false;
}

enum FieldInputType {
  readColumn,
  mapFromColumn,
  selectValue,
}

interface FieldImportSetting {
  name: FieldNames;
  type: FieldInputType;
  selected: any;
  options?: any;
  formats?: { id: number; name: string; parse: (raw: string) => any }[];
  currentFormatId?: number;
  mappings?: [string, Category | null][];
  mapper: (rawValue: any, parse?: any) => any;
  validator?: (rawValue: any, format?: { name: string; parse: (raw: any) => any }) => true | string;
  hasError?: boolean;
}

const usedColumns = computed(() => {
  return fields.value
    .filter((elem: FieldImportSetting) =>
      [FieldInputType.readColumn, FieldInputType.mapFromColumn].includes(elem.type),
    )
    .map((elem: FieldImportSetting) => elem.selected);
});

const columnSelectOptions = computed(() => {
  const result: { title: string; value: number }[] = [];
  if (!headerRow.value) {
    return result;
  }
  for (let i = 0; i < headerRow.value.length; i++) {
    result.push({
      title: headerRow.value[i],
      value: i,
    });
  }
  return result;
});

const categoryOptions = computed(() => {
  return categoriesStore.categories.map((elem) => {
    return {
      title: elem.name,
      value: elem,
    };
  });
});

const accountOptions = computed(() => {
  return accountsStore.accounts.map((acc) => {
    return {
      title: acc.name + ' (' + currenciesStore.getCurrencyNameByAccount(acc) + ')',
      value: acc.id,
    };
  });
});

function formatOptions(field: FieldImportSetting) {
  return field?.formats?.map((format) => {
    return {
      title: format.name,
      value: format.id,
    };
  });
}

const basicReadColumnMapper = (rawValue: any) => rawValue;

function selectValueMapper(field: FieldImportSetting) {
  return {
    value: field.selected,
    title: field.options.find((e: any) => e.value === field.selected).title,
  };
}

function mapFromColumnMapper(fieldAndValueFromTableTuple: [FieldImportSetting, string]) {
  const field = fieldAndValueFromTableTuple[0];
  const valueFromTable = fieldAndValueFromTableTuple[1];
  for (let i = 0; i < field.mappings!.length; i++) {
    const mapping = field.mappings![i];
    if (mapping[1] && (valueFromTable ?? '').toLowerCase().includes(mapping[0].toLowerCase())) {
      return {
        value: mapping[1],
        title: mapping[1].name,
      };
    }
  }
}

enum FieldNames {
  name = 'name',
  amount = 'amount',
  category = 'category',
  account = 'account',
  timestamp = 'timestamp',
}

const fields = ref<FieldImportSetting[]>([
  {
    name: FieldNames.name,
    type: FieldInputType.readColumn,
    selected: null,
    mapper: basicReadColumnMapper,
  },
  {
    name: FieldNames.amount,
    type: FieldInputType.readColumn,
    selected: null,
    mapper: (rawValue) => Number(rawValue),
    validator: (rawValue) => {
      if (!rawValue || isNaN(rawValue)) {
        return 'not a valid number';
      }
      return true;
    },
  },
  {
    name: FieldNames.timestamp,
    type: FieldInputType.readColumn,
    selected: null,
    formats: [
      {
        id: 1,
        name: 'YYYY-MM-DD',
        parse: (dateString: string) => {
          const dateParts = dateString.split('-');
          return new Date(Date.UTC(+dateParts[0], +dateParts[1] - 1, +dateParts[2]));
        },
      },
      {
        id: 2,
        name: 'DD.MM.YYYY',
        parse: (dateString: string) => {
          const dateParts = dateString.split('.');
          return new Date(Date.UTC(+dateParts[2], +dateParts[1] - 1, +dateParts[0]));
        },
      },
    ],
    currentFormatId: 1,
    mapper: (rawValue, parse: (raw: string) => Date) => ({
      value: parse(rawValue).getTime(),
      title: parse(rawValue)?.toISOString()?.slice(0, 10),
    }),
    validator: function (rawValue: any, format?: { name: string; parse: (raw: string) => Date }) {
      if (
        !format?.parse ||
        !format.parse(rawValue) ||
        isNaN(format.parse(rawValue).getTime())
      ) {
        return `not a valid ${format?.name} date`;
      }
      return true;
    },
  },
  {
    name: FieldNames.account,
    type: FieldInputType.selectValue,
    options: accountOptions,
    selected: null,
    mapper: selectValueMapper,
  },
  {
    name: FieldNames.category,
    type: FieldInputType.mapFromColumn,
    selected: null,
    mappings: [['', null]],
    mapper: mapFromColumnMapper,
    validator: (fieldAndValueFromTableTuple: [FieldImportSetting, string]) => {
      const field = fieldAndValueFromTableTuple[0];

      for (let i = 0; i < field.mappings!.length; i++) {
        const isCategoryEmpty = !field.mappings![i][1];
        const isNeedleEmpty = !field.mappings![i][0];
        const isFallbackMapping = i === field.mappings!.length - 1;
        if (isCategoryEmpty || (isNeedleEmpty && !isFallbackMapping)) {
          return 'Please set all mapping fields or remove unnecessary mappings';
        }
      }
      return true;
    },
  },
]);

function namesOfFieldsBasedOnColumn(columnIndex: number): string {
  return fields.value
    .filter(
      (e) =>
        [FieldInputType.readColumn, FieldInputType.mapFromColumn].includes(e.type) &&
        e.selected == columnIndex,
    )
    .map((e) => e.name)
    .join(', ');
}

const headerRowRaw = computed(() => {
  if (!parsedRows?.value?.length) {
    return [];
  }

  if (fileHasHeader.value) {
    return parsedRows.value[0];
  }

  return new Array(parsedRows.value[0].length);
});

const headerRow = computed(() => {
  const result = JSON.parse(JSON.stringify(headerRowRaw.value ?? []));

  for (let i = 0; i < result.length; i++) {
    if (!result[i] || result[i] == '\r') {
      result[i] = `column ${i}`;
    }
  }

  return result;
});

const contentRows = computed(() => {
  if (fileHasHeader.value) {
    return parsedRows.value?.slice(1);
  }
  return parsedRows.value;
});

watch(
  () => [fields.value.map((field) => [field.selected, field?.mappings, field?.currentFormatId]), contentRows],
  () => {
    fields.value.forEach((field) => {
      if (field.selected !== null) {
        field.hasError = false;
      }
    });

    const result: any[] = [];
    if (!contentRows?.value?.length) {
      return result;
    }

    for (let rowNumber = 0; rowNumber < contentRows?.value?.length; rowNumber++) {
      const nextItem: Partial<Record<FieldNames, any>> = {};

      fields.value.forEach((field) => {
        nextItem[field.name] = getValueForField(field, rowNumber);
      });

      result.push(nextItem);
    }

    output.value = result;
  },
  { deep: true },
);

function swapOrderOfMappings(field: FieldImportSetting, lowerIndex: number) {
  const temp = field.mappings![lowerIndex];
  field.mappings![lowerIndex] = field.mappings![lowerIndex + 1];
  field.mappings![lowerIndex + 1] = temp;
}
</script>

<template>
  <v-dialog v-model="isDialogShown">
    <v-card class="w-full" style="height: 95vh">
      <v-card-title> Import transactions</v-card-title>
      <v-card-text :style="`overflow: scroll; font-size: ${importRelativeFontSize}rem;`">
        <div style="max-width: 50rem">
          <template v-for="field in fields" :key="field.name">
            <div style="display: flex">
              <v-select
                v-model="field.selected"
                :items="field.options ?? columnSelectOptions"
                :label="field.name"
                class="mb-2"
                style="width: 100%"
                :error-messages="
                  field.hasError ? 'Selected column can\'t be mapped to expected values' : ''
                "
              ></v-select>
              <v-select
                v-if="field.formats"
                v-model="field.currentFormatId"
                class="mb-2 ml-2"
                style="width: 100%"
                :items="formatOptions(field)"
                label="format"
                :error-messages="
                  field.hasError ? 'Please check the format' : ''
                "
              >
              </v-select>
            </div>

            <div class="pl-4" v-for="(mapping, i) in field?.mappings" :key="i">
              <v-btn
                v-if="i === field.mappings!.length - 1"
                @click="field.mappings!.splice(field.mappings!.length - 1, 0, ['', null])"
                color="primary"
                class="mb-4"
                style="width: calc(100% - 9ch)"
              >
                add another mapping
              </v-btn>
              <div
                class="mb-4"
                style="display: grid; grid-template-columns: 1fr 1fr 3ch 3ch; gap: 1ch"
              >
                <v-text-field
                  :disabled="i === field.mappings!.length - 1"
                  type="text"
                  :label="
                    i === field.mappings!.length - 1
                      ? 'default category (if nothing matched)'
                      : `text included by ${headerRow[JSON.stringify(field.selected)] ?? 'not-yet-selected'} field`
                  "
                  v-model="mapping[0]"
                  :hide-details="true"
                ></v-text-field>
                <v-select
                  v-model="mapping[1]"
                  :items="categoryOptions"
                  label="resulting category"
                  :hide-details="true"
                ></v-select>
                <div
                  v-if="i !== field.mappings!.length - 1"
                  style="display: flex; flex-direction: column"
                >
                  <button
                    :disabled="i === 0"
                    class="delete-button"
                    @click="swapOrderOfMappings(field, i - 1)"
                    aria-label="swap mapping order with previous"
                    :style="`color: ${i === 0 ? 'gray' : 'primary'};`"
                  >
                    <v-icon icon="mdi-menu-up" />
                  </button>
                  <button
                    :disabled="i === field.mappings!.length - 2"
                    class="delete-button"
                    @click="swapOrderOfMappings(field, i)"
                    aria-label="swap mapping order with next"
                    :style="`color: ${i === field.mappings!.length - 2 ? 'gray' : 'primary'};`"
                  >
                    <v-icon icon="mdi-menu-down" />
                  </button>
                </div>
                <button
                  v-if="i !== field.mappings!.length - 1"
                  class="delete-button"
                  @click="field.mappings!.splice(i, 1)"
                  aria-label="delete mapping"
                  style="color: red"
                >
                  <v-icon icon="mdi-delete" />
                </button>
              </div>
            </div>
          </template>

          <div class="mb-4">
            <div>
              <v-btn color="primary" type="button" @click="importRelativeFontSize -= 0.1"
                >zoom out
              </v-btn>
              <v-btn
                class="mx-2"
                color="primary"
                type="button"
                @click="importRelativeFontSize += 0.1"
                >zoom in
              </v-btn>
            </div>
            <v-switch
              v-model="sourceVisibility"
              density="compact"
              :hide-details="true"
              class="mt-4"
              label="Toggle source visibility"
            ></v-switch>
            <v-switch
              v-model="outputVisibility"
              density="compact"
              :hide-details="true"
              label="Toggle output visibility"
            ></v-switch>
            <v-switch
              v-model="fileHasHeader"
              density="compact"
              :hide-details="true"
              class="my-4"
              label="Use 1st row as header"
            ></v-switch>
            <v-btn
              color="primary"
              type="button"
              @click="saveOutput"
              :disabled="fields.some((field) => field.selected === null || field?.hasError)"
            >
              Import transactions
            </v-btn>
          </div>
        </div>

        <template v-if="parsedRows && parsedRows.length > 0">
          <div v-show="sourceVisibility">
            source
            <table>
              <thead style="border: 1px solid black">
                <tr>
                  <th
                    v-for="(_elem, j) in headerRow"
                    :key="j"
                    :class="{ used: usedColumns.includes(j) }"
                  >
                    {{ namesOfFieldsBasedOnColumn(j) }}
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="(elem, j) in headerRow"
                    :key="j"
                    :class="{ used: usedColumns.includes(j) }"
                    style="font-weight: bold"
                  >
                    {{ elem }}
                  </th>
                </tr>
              </thead>
              <tr style="border: 1px solid black" v-for="(row, i) in contentRows" :key="i">
                <td v-for="(elem, j) in row" :key="j" :class="{ used: usedColumns.includes(j) }">
                  {{ elem }}
                </td>
              </tr>
            </table>
          </div>

          <div v-show="outputVisibility">
            output
            <table>
              <thead style="border: 1px solid black">
                <tr>
                  <th
                    v-for="(field, j) in fields"
                    :key="j"
                    :class="{ invalid: field?.hasError, valid: field?.hasError === false }"
                  >
                    {{ field.name }}
                  </th>
                </tr>
              </thead>
              <tr style="border: 1px solid black" v-for="(row, i) in output" :key="i">
                <td v-for="(elem, j) in row" :key="j" :class="{ invalid: elem?.error }">
                  {{ elem?.error ?? elem?.title ?? elem }}
                </td>
              </tr>
            </table>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
table,
td,
th {
  border: 1px solid white;
  border-collapse: collapse;
}

td,
th {
  padding: 4px;
}

th {
  background-color: #adf3;
}

th.used {
  background-color: #0ff5;
}

td.used {
  background-color: #0ff3;
}

.valid {
  background-color: #0f05;
}

.invalid {
  background-color: #f005;
}
</style>
