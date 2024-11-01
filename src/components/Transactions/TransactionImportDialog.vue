<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue';
import { useAccountsStore } from '@/stores/accountsStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import { useCategoriesStore } from '@/stores/categoriesStore';

const accountsStore = useAccountsStore();
const currenciesStore = useCurrenciesStore();
const categoriesStore = useCategoriesStore();

const isDialogShown: Ref<boolean | undefined> = defineModel();
const parsedRows = ref<string[][] | null>(null);
const importRelativeFontSize = ref(1.0);
const sourceVisibility = ref(true);
const outputVisibility = ref(true);
const fileHasHeader = ref(true);

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
  } else {
    return 'not implemented'; // TODO
  }
  return field.mapper(rawValue);
}

const output = computed(() => {
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

  return result;
});

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
  // includeToValue?: [string, any][], // TODO
  mapper: (rawValue: any) => any;
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

const basicReadColumnMapper = (rawValue: any) => rawValue;

function selectValueMapper(field: FieldImportSetting) {
  return {
    value: field.selected,
    title: field.options.find((e: any) => e.value === field.selected).title,
  };
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
  },
  {
    name: FieldNames.category,
    // type: fieldInputType.mapFromColumn, // TODO
    type: FieldInputType.selectValue,
    options: categoryOptions,
    selected: null,
    mapper: selectValueMapper,
  },
  {
    name: FieldNames.account,
    type: FieldInputType.selectValue,
    options: accountOptions,
    selected: null,
    mapper: selectValueMapper,
  },
  {
    name: FieldNames.timestamp,
    type: FieldInputType.readColumn,
    selected: null,
    mapper: (rawValue) => ({
      value: new Date(rawValue).getTime(),
      title: rawValue,
    }),
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
  if (fileHasHeader.value) {
    return parsedRows.value?.at(0);
  }

  return new Array(parsedRows.value?.at(0)?.length);
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
</script>

<template>
  <v-dialog v-model="isDialogShown">
    <v-card class="w-full" style="height: 95vh">
      <v-card-title> Import transactions</v-card-title>
      <v-card-text :style="`overflow: scroll; font-size: ${importRelativeFontSize}rem;`">
        <v-select
          v-for="field in fields"
          :key="field.name"
          v-model="field.selected"
          :items="field.options ?? columnSelectOptions"
          :label="field.name"
          class="mb-2"
        ></v-select>

        <div class="mb-4">
          <div>
            <v-btn color="primary" type="button" @click="importRelativeFontSize -= 0.1"
              >zoom out</v-btn
            >
            <v-btn class="mx-2" color="primary" type="button" @click="importRelativeFontSize += 0.1"
              >zoom in
            </v-btn>
          </div>
          <v-switch v-model="sourceVisibility" density="compact" :hide-details="true" class="mt-4" label="toggle source visibility"></v-switch>
          <v-switch v-model="outputVisibility" density="compact" :hide-details="true" label="Toggle output visibility"></v-switch>
          <v-switch v-model="fileHasHeader" density="compact" :hide-details="true" class="my-4" label="Use 1st row as header"></v-switch>
          <v-btn
            color="primary"
            type="button"
            @click="saveOutput"
            :disabled="fields.some((field) => field.selected === null)"
          >
            Import transactions
          </v-btn>
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
                  <th v-for="(elem, j) in fields" :key="j">{{ elem.name }}</th>
                </tr>
              </thead>
              <tr style="border: 1px solid black" v-for="(row, i) in output" :key="i">
                <td v-for="(elem, j) in row" :key="j">
                  {{ elem?.title ? elem.title : elem }}
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

.used {
  background-color: #4caf5055;
}
</style>
