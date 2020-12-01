<template>
  <b-container
    fluid
    class="scroll p-1"
  >
    <b-card
      title="Field Expresions"
      class="mh-100"
      body-class="mh-100 overflow-auto"
    >
      <b-card-text
        class="px-2"
      >
        Field expressions provide a way to calculate field values based on the defined expression.
        <br>
        Writing field expressions is like writing an equation. Instead of only using constants, you can pass in the field name, and it will be evaluated as the field value for that record.
        <br><br>
        To write the expression you can use the following operators:
        <ul>
          <li>
            Variables: <code>fieldName</code>
          </li>
          <li>
            Modifiers: <kbd>+</kbd> <kbd>-</kbd> <kbd>*</kbd> <kbd>/</kbd> <kbd>%</kbd> <kbd>**</kbd>
          </li>
          <li>
            Comparators: <kbd>&gt;</kbd> <kbd>&gt;=</kbd> <kbd>&lt;</kbd> <kbd>&lt;=</kbd> <kbd>==</kbd> <kbd>!=</kbd>
          </li>
          <li>
            Logical: <kbd>&&</kbd> <kbd>||</kbd>
          </li>
          <li>
            Control order of evaluation: <kbd>(</kbd> <kbd>)</kbd>
          </li>
          <li>
            <a
              href="https://github.com/PaesslerAG/gval#evaluate"
              target="_blank"
            >
              More
            </a>
          </li>
        </ul>
      </b-card-text>

      <b-card>
        <h4
          v-b-toggle.examples
          class="mb-0"
        >
          Examples
        </h4>
        <b-collapse
          id="examples"
          visible
        >
          <b-table
            responsive
            striped
            :items="examples"
            :fields="exampleFields"
            class="mt-2 mb-0"
          >
            <template #cell(expression)="data">
              <code>
                {{ data.value }}
              </code>
            </template>
            <template #cell(fieldValues)="data">
              <var>
                {{ data.value }}
              </var>
            </template>
            <template #cell(result)="data">
              <samp>
                {{ data.value }}
              </samp>
            </template>
          </b-table>
        </b-collapse>
      </b-card>

      <hr>

      <h4>
        Helper functions
      </h4>
      <b-card-text
        class="px-2"
      >
        We also provide a set of helper functions that extend the capabilites of field expressions.<br>
        <small
          class="text-muted"
        >
          NOTE: Only the "General" functions can be used on all types of fields. The other functions are limited to their respective field types.
        </small>
      </b-card-text>

      <b-card
        v-for="category of categories"
        :key="category.name"
        class="mt-2"
      >
        <h4
          class="mb-0"
          @click="category.collapse = !category.collapse"
        >
          {{ category.name }}
        </h4>
        <b-collapse
          v-model="category.collapse"
        >
          <b-table
            fixed
            striped
            :items="category.items"
            :fields="fields"
            class="mt-2 mb-0"
          >
            <template #cell(syntax)="data">
              <var>
                {{ data.value }}
              </var>
            </template>
            <template #cell(example)="data">
              <code>
                {{ data.value }}
              </code>
            </template>
            <template #cell(result)="data">
              <samp>
                {{ data.value }}
              </samp>
            </template>
          </b-table>
        </b-collapse>
      </b-card>
    </b-card>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      exampleFields: [
        { key: 'expression', class: '' },
        { key: 'field1', class: '' },
        { key: 'field2', class: '' },
        { key: 'result', class: '' },
      ],
      examples: [
        { expression: '(field1  / 10) + 2', field1: '400', result: '42' },
        { expression: 'field1 > 10', field1: '10', result: 'false' },
        { expression: '(field1 > 10) || (field2 > field1)', field1: '10', field2: '11', result: 'true' },
        { expression: '((floor(numField1) + numField2) / 10) + 2', field1: '21.6', field2: '19', result: '42' },
      ],

      fields: [
        { key: 'name', class: 'w10' },
        { key: 'description', class: 'w30' },
        { key: 'syntax', class: 'w20 pr-5 text-nowrap' },
        { key: 'example', class: 'w25 text-nowrap' },
        { key: 'result', class: 'w15 text-right text-nowrap pr-2' },
      ],

      categories: [
        {
          name: 'General',
          collapse: true,
          items: [
            { name: 'Coalesce', description: 'Returns the first non null value', syntax: 'coalesce(v1, v2, ...)', example: 'coalesce(null, 0, 1, 2)', result: '0' },
          ],
        },
        {
          name: 'Number',
          collapse: true,
          items: [
            { name: 'Min', description: 'Returns item with the lowest value', syntax: 'min(n1, n2, ...)', example: 'min(0, 1, 2)', result: '0' },
            { name: 'Max', description: 'Returns item with the highest value', syntax: 'max(n1, n2, ...)', example: 'max(0, 1, 2)', result: '2' },
            { name: 'Round', description: 'Rounds a floating point number to the specified number of digits', syntax: 'round(number, digits)', example: 'round(3.14, 1)', result: '3.1' },
            { name: 'Floor', description: 'Rounds number down to the nearest integer', syntax: 'floor(number)', example: 'floor(3.14)', result: '3' },
            { name: 'Ceil', description: 'Rounds number up to the nearest integer', syntax: 'ceil(number)', example: 'ceil(3.14)', result: '4' },
          ],
        },
        {
          name: 'String',
          collapse: true,
          items: [
            { name: 'Trim', description: 'Removes spaces at the beginning and at the end of the string', syntax: 'trim(string)', example: 'trim(" foo ")', result: '"foo"' },
            { name: 'Trim left', description: 'Removes character from the beginning of the string', syntax: 'trimLeft(string, character)', example: 'trim(" foo ", " ")', result: '"foo "' },
            { name: 'Trim right', description: 'Removes character from the beginning of the string', syntax: 'trimRight(string, character)', example: 'trim(" foo ", " ")', result: '" foo"' },
            { name: 'To lowercase', description: 'Converts all characters to lowercase', syntax: 'toLower(string)', example: 'toLower("FOO")', result: '"foo"' },
            { name: 'To uppercase', description: 'Converts all characters to uppercase', syntax: 'toUpper(string)', example: 'toUpper("foo")', result: '"FOO"' },
            { name: 'Shortest', description: 'Returns the shortest string', syntax: 'shortest(s1, s2, ...)', example: 'shortest("foo", "foobar")', result: '"foo"' },
            { name: 'Longest', description: 'Returns the longest string', syntax: 'longest(s1, s2, ...)', example: 'longest("foo", "foobar")', result: '"foobar"' },
          ],
        },
        {
          name: 'Date and Time',
          collapse: true,
          items: [
            { name: 'To string', description: 'Returns DateTime string for the specified date and format', syntax: 'strftime(datetime, format)', example: 'strftime(datefield, "%Y-%m-%d")', result: '"1970-01-01"' },
            { name: 'Modify date', description: 'Returns modified DateTime string', syntax: 'modTime(datetime, duration)', example: 'modTime(datefield), "+30m")', result: '"1970-01-01T00:30:00"' },
            { name: 'Parse ISO date', description: 'Returns parsed ISO DateTime string', syntax: 'parseISOTime(datetime)', example: 'parseISOTime(datefield))', result: '"1970-01-01T00:00:00+00:00"' },
            { name: 'Parse duration', description: 'Returns parsed duration', syntax: 'parseDuration(duration)', example: 'parseDuration("2h")', result: '"2h0m0s"' },
            { name: 'Earliest', description: 'Returns earliest DateTime', syntax: 'earliest(d1, d2, ...)', example: 'earliest(datefield1, datefield2)', result: '"1970-01-01T00:00:00"' },
            { name: 'Latest', description: 'Returns latest DateTime', syntax: 'latest(d1, d2, ...)', example: 'latest(datefield1, datefield2)', result: '"1970-01-01T00:30:00"' },
          ],
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.scroll {
  max-height: 100vh;
  overflow-y: auto;
}

/deep/.w10 {
  width: 10%;
}

/deep/.w15 {
  width: 15%;
}

/deep/.w20 {
  width: 20%;
}

/deep/.w25 {
  width: 25%;
}

/deep/.w30 {
  width: 30%;
}

kbd {
  margin: 2px;
}

li {
  margin-bottom: 0.25rem;
}
</style>
