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

const props = defineProps<{
  fileToImportTransactions: any;
}>();

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

const columnSeparator = ',';

function parseAsCsv(text: string): string[][] {
  const rows = text.replaceAll('"', '').split('\n');
  rows.pop();
  const rowsParsed: string[][] = [];
  for (let i = 0; i < rows.length; i++) {
    rowsParsed.push(rows[i].split(columnSeparator));
  }
  for (let i = 0; i < rowsParsed[0].length; i++) {
    if (!rowsParsed[0][i] || rowsParsed[0][i] == '\r') {
      rowsParsed[0][i] = `column ${i}`;
    }
  }
  return rowsParsed;
}

watch(isDialogShown, (isDialogShown) => {
  if (isDialogShown) {
    tryLoadFile();
  }
});

const output = computed(() => {
  const result: any[] = [];
  if (!parsedRows?.value?.length) {
    return result;
  }

  for (let i = 1; i < parsedRows?.value?.length; i++) {
    const nextItem = {};

    fields.value.forEach((field) => {
      if (field.type === fieldInputType.readColumn) {
        if (field.name === 'amount') {
          nextItem[field.name] = Number(parsedRows?.value![i][field.selected]);
        } else if (field.name === 'timestamp') {
          nextItem[field.name] = {
            value: new Date(parsedRows?.value![i][field.selected]).getTime(),
            title: parsedRows?.value![i][field.selected],
          };
        } else {
          nextItem[field.name] = parsedRows?.value![i][field.selected];
        }
      } else if (field.type === fieldInputType.select) {
        if (field.selected != null) {
          nextItem[field.name] = {
            value: field.selected,
            title: field.options.find((e) => e.value === field.selected).title,
          };
        } else {
          nextItem[field.name] = `please select the ${field.name}`;
        }
      } else {
        nextItem[field.name] = 'TODO';
      }
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

enum fieldInputType {
  readColumn,
  mapFromColumn,
  select,
}

interface FieldImportSetting {
  name: string;
  type: fieldInputType;
  selected: any;
  options?: any;
  // includeToValue?: [string, any][], // TODO
}

const usedColumns = computed(() => {
  return fields.value
    .filter((elem: FieldImportSetting) =>
      [fieldInputType.readColumn, fieldInputType.mapFromColumn].includes(elem.type),
    )
    .map((elem: FieldImportSetting) => elem.selected);
});

const columnSelectOptions = computed(() => {
  const result: { title: string; value: number }[] = [];
  if (!parsedRows.value) {
    return result;
  }
  for (let i = 0; i < parsedRows.value[0].length; i++) {
    result.push({
      title: parsedRows.value[0][i],
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

const fields = ref<FieldImportSetting[]>([
  {
    name: 'name',
    type: fieldInputType.readColumn,
    selected: null,
  },
  {
    name: 'amount',
    type: fieldInputType.readColumn,
    selected: null,
  },
  {
    name: 'category',
    // type: fieldInputType.mapFromColumn, // TODO
    type: fieldInputType.select,
    options: categoryOptions,
    selected: null,
  },
  {
    name: 'account',
    type: fieldInputType.select,
    options: accountOptions,
    selected: null,
  },
  {
    name: 'timestamp',
    type: fieldInputType.readColumn,
    selected: null,
  },
]);
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
          <v-btn color="primary" type="button" @click="importRelativeFontSize -= 0.1">-</v-btn>
          <v-btn class="mx-2" color="primary" type="button" @click="importRelativeFontSize += 0.1"
            >+
          </v-btn>
          <v-btn
            class="mx-4"
            color="primary"
            type="button"
            @click="sourceVisibility = !sourceVisibility"
            >toggle source visibility
          </v-btn>
          <v-btn
            class="mx-4"
            color="primary"
            type="button"
            @click="outputVisibility = !outputVisibility"
            >toggle output visibility
          </v-btn>
          <v-btn
            class="mx-4"
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
                    v-for="(_elem, j) in parsedRows[0]"
                    :key="j"
                    :class="{ used: usedColumns.includes(j) }"
                  >
                    {{
                      fields
                        .filter(
                          (e) =>
                            [fieldInputType.readColumn, fieldInputType.mapFromColumn].includes(
                              e.type,
                            ) && e.selected == j,
                        )
                        .map((e) => e.name)
                        .join(', ')
                    }}
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="(elem, j) in parsedRows[0]"
                    :key="j"
                    :class="{ used: usedColumns.includes(j) }"
                  >
                    {{ elem }}
                  </th>
                </tr>
              </thead>
              <tr style="border: 1px solid black" v-for="(row, i) in parsedRows.slice(1)" :key="i">
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
