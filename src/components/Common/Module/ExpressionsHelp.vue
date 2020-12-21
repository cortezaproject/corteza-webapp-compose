<template>
  <b-container
    fluid
    class="scroll p-1"
  >
    <b-card
      title="Field Expresions"
      class="h-100 mh-100"
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
            Depending on where the field expression is used it has access to different variables:
            <ul>
              <li>
                Value expressions: <code>old</code>(record), <code>new</code>(record), <code>field-name</code>
              </li>
              <li>
                Sanitizers: <code>value</code>(new value)
              </li>
              <li>
                Validators: <code>value</code>(new value), <code>oldValue</code>(old value), <code>values</code>(all new values)
              </li>
            </ul>
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

      <hr>

      <h4>
        Examples
      </h4>
      <b-card-text
        class="px-2"
      >
        Below are a few examples of different use cases of field expressions.
      </b-card-text>

      <b-card
        v-for="example of examples"
        :key="example.name"
        :id="example.id"
        class="mt-2"
        @mouseover="example.chevron = true"
        @mouseleave="example.chevron = false"
      >
        <h4
          class="d-flex mb-0"
          @click="example.collapse = !example.collapse"
        >
          <span
            class="mr-auto"
          >
            {{ example.name }}
          </span>
          <transition name="fade" mode="out-in">
            <font-awesome-icon
              v-show="example.chevron"
              :icon="['fas', example.collapse ? 'chevron-down' : 'chevron-left']"
              class="pointer text-muted"
            />
          </transition>
        </h4>
        <b-collapse
          v-model="example.collapse"
        >
          <b-table
            responsive="md"
            striped
            :items="example.items"
            :fields="example.fields"
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
        We provide a set of helper functions that extend the capabilites of field expressions.<br>
        <small
          class="text-muted"
        >
          NOTE: Only the "General" functions can be used on all types of fields. The other functions are limited to their respective field type.
        </small>
      </b-card-text>

      <b-card
        v-for="category of categories"
        :key="category.name"
        :id="category.id"
        class="mt-2"
        @mouseover="category.chevron = true"
        @mouseleave="category.chevron = false"
      >
        <h4
          class="d-flex mb-0"
          @click="category.collapse = !category.collapse"
        >
          <span
            class="mr-auto"
          >
            {{ category.name }}
          </span>
          <transition name="fade" mode="out-in">
            <font-awesome-icon
              v-show="category.chevron"
              :icon="['fas', category.collapse ? 'chevron-down' : 'chevron-left']"
              class="pointer text-muted"
            />
          </transition>
        </h4>
        <b-collapse
          v-model="category.collapse"
        >
          <b-table
            responsive="md"
            striped
            :items="category.items"
            :fields="categoryFields"
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

      <hr>

      <h4>
        Formatting parameters
      </h4>
      <b-card-text
        class="px-2"
      >
        Here is a complete list of available formatting options.<br>
      </b-card-text>

      <b-card
        v-for="category of formatCategories"
        :key="category.name"
        :id="category.id"
        class="mt-2"
        @mouseover="category.chevron = true"
        @mouseleave="category.chevron = false"
      >
        <h4
          class="d-flex mb-0"
          @click="category.collapse = !category.collapse"
        >
          <span
            class="mr-auto"
          >
            {{ category.name }}
          </span>
          <transition name="fade" mode="out-in">
            <font-awesome-icon
              v-show="category.chevron"
              :icon="['fas', category.collapse ? 'chevron-down' : 'chevron-left']"
              class="pointer text-muted"
            />
          </transition>
        </h4>
        <b-collapse
          v-model="category.collapse"
        >
          <b-table
            responsive="md"
            striped
            :items="category.items"
            :fields="formatFields"
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
      categoryFields: [
        { key: 'syntax', class: 'w25 text-nowrap' },
        { key: 'description', class: 'w30 pr-5' },
        { key: 'example', class: 'w25 text-nowrap' },
        { key: 'result', class: 'w20 text-right text-nowrap' },
      ],

      formatFields: [
        { key: 'syntax' },
        { key: 'description' },
        { key: 'example' },
        { key: 'result' },
      ],

      categories: [
        {
          id: 'general',
          name: 'General',
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'coalesce(v1, v2, ...)', description: 'Returns the first non null value', example: 'coalesce(null, 0, 1, 2)', result: '0' },
          ],
        },
        {
          id: 'number',
          name: 'Number',
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'min(n1, n2, ...)', description: 'Returns item with the lowest value', example: 'min(0, 1, 2)', result: '0' },
            { syntax: 'max(n1, n2, ...)', description: 'Returns item with the highest value', example: 'max(0, 1, 2)', result: '2' },
            { syntax: 'round(number, digits)', description: 'Rounds a floating point number to the specified number of digits', example: 'round(3.14, 1)', result: '3.1' },
            { syntax: 'floor(number)', description: 'Rounds number down to the nearest integer', example: 'floor(3.14)', result: '3' },
            { syntax: 'ceil(number)', description: 'Rounds number up to the nearest integer', example: 'ceil(3.14)', result: '4' },
          ],
        },
        {
          id: 'string',
          name: 'String',
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'trim(string)', description: 'Removes spaces at the beginning and at the end of the string', example: 'trim(" foo ")', result: '"foo"' },
            { syntax: 'trimLeft(string, character)', description: 'Removes character from the beginning of the string', example: 'trim(" foo ", " ")', result: '"foo "' },
            { syntax: 'trimRight(string, character)', description: 'Removes character from the end of the string', example: 'trim(" foo ", " ")', result: '" foo"' },
            { syntax: 'toLower(string)', description: 'Converts all characters to lowercase', example: 'toLower("FOO")', result: '"foo"' },
            { syntax: 'toUpper(string)', description: 'Converts all characters to uppercase', example: 'toUpper("foo")', result: '"FOO"' },
            { syntax: 'shortest(s1, s2, ...)', description: 'Returns the shortest string', example: 'shortest("foo", "foobar")', result: '"foo"' },
            { syntax: 'longest(s1, s2, ...)', description: 'Returns the longest string', example: 'longest("foo", "foobar")', result: '"foobar"' },
            { syntax: 'format(format, arg1, arg2, ...)', description: 'Returns the formatted string', example: 'format("test %d", 10)', result: '"test 10"' },
          ],
        },
        {
          id: 'dateTime',
          name: 'Date and Time',
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'strftime(datetime, format)', description: 'Returns DateTime string for the specified date and format', example: 'strftime(datefield, "%Y-%m-%d")', result: '"1970-01-01"' },
            { syntax: 'modTime(datetime, duration)', description: 'Returns modified DateTime string', example: 'modTime(datefield, "+30m")', result: '"1970-01-01T00:30:00"' },
            { syntax: 'parseISOTime(datetime)', description: 'Returns parsed ISO DateTime string', example: 'parseISOTime(datefield)', result: '"1970-01-01T00:00:00+00:00"' },
            { syntax: 'parseDuration(duration)', description: 'Returns parsed duration', example: 'parseDuration("2h")', result: '"2h0m0s"' },
            { syntax: 'earliest(d1, d2, ...)', description: 'Returns earliest DateTime', example: 'earliest(datefield1, datefield2)', result: '"1970-01-01T00:00:00"' },
            { syntax: 'latest(d1, d2, ...)', description: 'Returns latest DateTime', example: 'latest(datefield1, datefield2)', result: '"1970-01-01T00:30:00"' },
          ],
        },
      ],

      formatCategories: [
        {
          id: 'format',
          name: 'String formatting',
          collapse: false,
          chevron: false,
          items: [
            { syntax: '%v', description: 'Returns the raw value', example: 'format("%v", "test")', result: '"test"' },
            { syntax: '%t', description: 'Returns the boolean value as true/false', example: 'format("%t", true)', result: 'true' },
            { syntax: '%t', description: 'Returns the boolean value as true/false', example: 'format("%t", true)', result: 'true' },
            { syntax: '%b', description: 'Returns the number in base 2 (in the binary format)', example: 'format("%b", 10)', result: '1010' },
            { syntax: '%d', description: 'Returns the number in base 10', example: 'format("%d", 10)', result: '10' },
            { syntax: '%o', description: 'Returns the number in base 8', example: 'format("%o", 10)', result: '12' },
            { syntax: '%O', description: 'Returns the number in base 8 with 0o prefix', example: 'format("%O", 10)', result: '0o12' },
            { syntax: '%x', description: 'Returns the number in base 16; lower-case a-f', example: 'format("%x", 10)', result: 'a' },
            { syntax: '%X', description: 'Returns the number in base 16; upper-case A-F', example: 'format("%X", 10)', result: 'A' },
            { syntax: '%b', description: 'Returns the floating point number in scientific notation with binary exponent', example: 'format("%b", 10.11)', result: '5691424029089464p-49' },
            { syntax: '%e', description: 'Returns the floating point number in scientific notation; lower-case e', example: 'format("%e", 10.11)', result: '1.011000e+01' },
            { syntax: '%E', description: 'Returns the floating point number in scientific notation; upper-case E', example: 'format("%E", 10.11)', result: '1.011000E+01' },
            { syntax: '%f', description: 'Returns the floating point number with a decimal point', example: 'format("%f", 10.11)', result: '10.110000' },
          ],
        },
        {
          id: 'strftime',
          name: 'Date and Time formatting',
          collapse: false,
          chevron: false,
          items: [
            { syntax: '%Y', description: 'Returns the year with century as a decimal number', example: 'strftime(dateField, "%Y")', result: '"1993"' },
            { syntax: '%y', description: 'Returns the year without century as a decimal number (00-99)', example: 'strftime(dateField, "%y")', result: '"93"' },
            { syntax: '%C', description: 'Returns year / 100 as a decimal number; single digits are preceded by a zero', example: 'strftime(dateField, "%C")', result: '"19"' },

            { syntax: '%m', description: 'Returns the month as a decimal number (01-12)', example: 'strftime(dateField, "%m")', result: '"02"' },
            { syntax: '%B', description: 'Returns the full national month name', example: 'strftime(dateField, "%B")', result: '"February"' },
            { syntax: '%b', description: 'Returns the abbreviated national month name', example: 'strftime(dateField, "%b")', result: '"Feb"' },

            { syntax: '%U', description: 'Returns the week number of the year (Sunday as the first day of the week) as a decimal number (00-53)', example: 'strftime(dateField, "%U")', result: '"05"' },
            { syntax: '%V', description: 'Returns the week number of the year (Monday as the first day of the week) as a decimal number (01-53)', example: 'strftime(dateField, "%V")', result: '"05"' },
            { syntax: '%W', description: 'Returns the week number of the year (Monday as the first day of the week) as a decimal number (00-53)', example: 'strftime(dateField, "%W")', result: '"05"' },

            { syntax: '%A', description: 'Returns the full national weekday name', example: 'strftime(dateField, "%A")', result: '"Tuesday"' },
            { syntax: '%a', description: 'Returns the abbreviated national weekday name', example: 'strftime(dateField, "%a")', result: '"Tue"' },
            { syntax: '%d', description: 'Returns the day of the month as a decimal number (01-31)', example: 'strftime(dateField, "%d")', result: '"02"' },
            { syntax: '%e', description: 'Returns the day of the month as a decimal number (1-31)', example: 'strftime(dateField, "%e")', result: '" 2"' },
            { syntax: '%j', description: 'Returns the day of the year as a decimal number (001-366)', example: 'strftime(dateField, "%j")', result: '"033"' },
            { syntax: '%u', description: 'Returns the weekday (Monday as the first day of the week) as a decimal number (1-7)', example: 'strftime(dateField, "%u")', result: '"5"' },
            { syntax: '%w', description: 'Returns the weekday (Sunday as the first day of the week) as a decimal number (0-6)', example: 'strftime(dateField, "%w")', result: '"2"' },

            { syntax: '%H', description: 'Returns the hour (24-hour clock) as a decimal number (00-23)', example: 'strftime(dateField, "%H")', result: '"06"' },
            { syntax: '%k', description: 'Returns the hour (24-hour clock) as a decimal number (0-23)', example: 'strftime(dateField, "%k")', result: '" 6"' },
            { syntax: '%I', description: 'Returns the hour (12-hour clock) as a decimal number (01-12)', example: 'strftime(dateField, "%I")', result: '"06"' },
            { syntax: '%l', description: 'Returns the hour (12-hour clock) as a decimal number (1-12)', example: 'strftime(dateField, "%l")', result: '" 6"' },

            { syntax: '%M', description: 'Returns the minute as a decimal number (00-59)', example: 'strftime(dateField, "%M")', result: '"00"' },

            { syntax: '%S', description: 'Returns the second as a decimal number (00-60)', example: 'strftime(dateField, "%S")', result: '"00"' },

            { syntax: '%S', description: 'Returns the millisecond as a decimal number (000-999)', example: 'strftime(dateField, "%S")', result: '"000"' },

            { syntax: '%p', description: 'Returns the national representation of either "ante meridiem" (a.m.)  or "post meridiem" (p.m.)', example: 'strftime(dateField, "%p")', result: '"AM"' },
            { syntax: '%c', description: 'Returns the national representation of time and date', example: 'strftime(dateField, "%c")', result: '"Tue Feb  2 06:00:00 1993"' },
            { syntax: '%X', description: 'Returns the national representation of the time', example: 'strftime(dateField, "%X")', result: '"06:00:00"' },
            { syntax: '%x', description: 'Returns the national representation of the date', example: 'strftime(dateField, "%x")', result: '"02/02/93"' },
            { syntax: '%Z', description: 'Returns the time zone name', example: 'strftime(dateField, "%Z")', result: '"-0500"' },
            { syntax: '%z', description: 'Returns the time zone offset from UTC', example: 'strftime(dateField, "%z")', result: '"-0500"' },

            { syntax: '%n', description: 'Returns a newline (\n)', example: 'strftime(dateField, "%n")', result: '"\n"' },
            { syntax: '%t', description: 'Returns a tab', example: 'strftime(dateField, "%t")', result: '"\t"' },
            { syntax: '%%', description: 'Returns a %', example: 'strftime(dateField, "%%")', result: '"%"' },

            { syntax: '%F', description: 'Equivalent to %Y-%m-%d', example: 'strftime(dateField, "%F")', result: '"1993-02-02"' },
            { syntax: '%D', description: 'Equivalent to %m/%d/%y', example: 'strftime(dateField, "%D")', result: '"02/02/93"' },
            { syntax: '%R', description: 'Equivalent to %H:%M', example: 'strftime(dateField, "%R")', result: '"06:00"' },
            { syntax: '%r', description: 'Equivalent to %I:%M:%S %p', example: 'strftime(dateField, "%r")', result: '"06:00:00 AM"' },
            { syntax: '%T', description: 'Equivalent to %H:%M:%S', example: 'strftime(dateField, "%T")', result: '"06:00:00"' },
            { syntax: '%v', description: 'Equivalent to %e-%b-%Y', example: 'strftime(dateField, "%v")', result: '" 2-Feb-1993"' },
          ],
        },
      ],

      examples: [
        {
          id: 'valueExpressions',
          name: 'Value expression',
          collapse: false,
          chevron: false,
          fields: [
            { key: 'expression', class: 'text-nowrap' },
            { key: 'field1', label: 'field1', class: 'w10 text-nowrap' },
            { key: 'old.values.field1', label: 'old.values.field1', class: 'w10 text-nowrap' },
            { key: 'field2', label: 'field2', class: 'w10 text-nowrap' },
            { key: 'result', class: 'w10 text-right' },
          ],
          items: [
            { expression: '(field1  / 10) + 2', field1: '400', result: '42' },
            { expression: '((floor(field1) + field2) / 10) + 2', field1: '21.6', field2: '19', result: '42' },
          ],
        },
        {
          id: 'sanitizer',
          name: 'Sanitizer',
          collapse: false,
          chevron: false,
          fields: [
            { key: 'expression', class: 'text-nowrap' },
            { key: 'value', label: 'value', class: 'w10 text-nowrap' },
            { key: 'result', class: 'w10 text-right' },
          ],
          items: [
            { expression: 'trim(value)', value: '" foo "', result: '"foo"' },
            { expression: 'floor(value)', value: '42.42', result: '42' },
          ],
        },
        {
          id: 'validator',
          name: 'Validator',
          collapse: false,
          chevron: false,
          fields: [
            { key: 'expression', class: 'text-nowrap' },
            { key: 'value', label: 'value', class: 'w10 text-nowrap' },
            { key: 'oldValue', label: 'oldValue', class: 'w10 text-nowrap' },

            { key: 'result', class: 'w10 text-right' },
          ],
          items: [
            { expression: 'oldValue > value', value: '41', oldValue: '42', result: 'false' },
          ],
        },
      ],
    }
  },

  mounted () {
    if (this.$route.hash) {
      const exampleID = this.$route.hash.substring(1)
      this.examples.find(({ id }) => id === exampleID).collapse = true
    }
  },
}
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.scroll {
  height: 100%;
  max-height: 100vh;
  overflow-y: auto;
}

/deep/.w10 {
  width: 10%;
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
