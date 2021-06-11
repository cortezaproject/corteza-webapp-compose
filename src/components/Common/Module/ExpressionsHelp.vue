<template>
  <b-container
    fluid
    class="scroll p-1"
  >
    <b-card
      :title="$t('field')"
      class="h-100 mh-100"
      body-class="mh-100 overflow-auto"
    >
      <b-card-text
        class="px-2"
      >
        {{ $t('calculate') }}
        <br>
        {{ $t('write') }}
        <br><br>
        {{ $t('instructions') }}
        <ul>
          <li>
            {{ $t('operators.location')}}
            <ul>
              <li>
                {{ $t('operators.value-expressions') }}
                <code>{{ $t('operators.old') }}</code>{{ $t('operators.record') }}
                <code>{{ $t('operators.new') }}</code>{{ $t('operators.record') }}
                <code>{{ $t('operators.field-name') }}</code>
              </li>
              <li>
                {{ $t('operators.sanitizers') }}<code>{{ $t('operators.values') }}</code>
                {{ $t('operators.new-value') }}
              </li>
              <li>
                {{ $t('operators.validators') }}
                <code>{{ $t('operators.value') }}</code>{{ $t('operators.new-value-with-comma') }}
                <code>{{ $t('operators.old-value') }}</code>{{ $t('operators.old-value-brackets') }}
                <code>{{ $t('operators.values') }}</code>{{ $t('operators.all-new-values') }}
              </li>
            </ul>
          </li>
          <li>
            {{ $t('operators.modifiers') }} <kbd>+</kbd> <kbd>-</kbd> <kbd>*</kbd> <kbd>/</kbd> <kbd>%</kbd> <kbd>**</kbd>
          </li>
          <li>
            {{ $t('operators.comparators') }} <kbd>&gt;</kbd> <kbd>&gt;=</kbd> <kbd>&lt;</kbd> <kbd>&lt;=</kbd> <kbd>==</kbd> <kbd>!=</kbd>
          </li>
          <li>
            {{ $t('operators.logical') }}<kbd>&&</kbd> <kbd>||</kbd>
          </li>
          <li>
            {{ $t('operators.control-order') }} <kbd>(</kbd> <kbd>)</kbd>
          </li>
          <li>
            <a
              href="https://github.com/PaesslerAG/gval#evaluate"
              target="_blank"
            >
              {{ $t('operators.more') }}
            </a>
          </li>
        </ul>
      </b-card-text>

      <hr>

      <h4>
        {{ $t('examples') }}
      </h4>
      <b-card-text
        class="px-2"
      >
        {{ $t('example-description') }}
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
        {{ $t('helper-functions.label') }}
      </h4>
      <b-card-text
        class="px-2"
      >
        {{ $t('helper-functions.description') }}<br>
        <small
          class="text-muted"
        >
          {{ $t('helper-functions.note') }}
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
        {{ $t('formatting-parameters.label') }}
      </h4>
      <b-card-text
        class="px-2"
      >
        {{ $t('formatting-parameters.description') }}<br>
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
import i18n from '../../../i18n'

export default {
  i18nOptions: {
    keyPrefix: 'expressions-help',
  },

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
          name: this.$t('categories.general.label'),
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'coalesce(v1, v2, ...)', description: this.$t('categories.general.description'), example: 'coalesce(null, 0, 1, 2)', result: '0' },
          ],
        },
        {
          id: 'number',
          name: this.$t('categories.number.label'),
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'min(n1, n2, ...)', description: this.$t('categories.number.min'), example: 'min(0, 1, 2)', result: '0' },
            { syntax: 'max(n1, n2, ...)', description: this.$t('categories.number.max'), example: 'max(0, 1, 2)', result: '2' },
            { syntax: 'round(number, digits)', description: this.$t('categories.number.rounds'), example: 'round(3.14, 1)', result: '3.1' },
            { syntax: 'floor(number)', description: this.$t('categories.number.floor'), example: 'floor(3.14)', result: '3' },
            { syntax: 'ceil(number)', description: this.$t('categories.number.ceil'), example: 'ceil(3.14)', result: '4' },
          ],
        },
        {
          id: 'string',
          name: this.$t('categories.string.label'),
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'trim(string)', description: this.$t('categories.string.trim'), example: 'trim(" foo ")', result: '"foo"' },
            { syntax: 'trimLeft(string, character)', description: this.$t('categories.string.trimLeft'), example: 'trim(" foo ", " ")', result: '"foo "' },
            { syntax: 'trimRight(string, character)', description: this.$t('categories.string.trimRight'), example: 'trim(" foo ", " ")', result: '" foo"' },
            { syntax: 'toLower(string)', description: this.$t('categories.string.toLower'), example: 'toLower("FOO")', result: '"foo"' },
            { syntax: 'toUpper(string)', description: this.$t('categories.string.toUpper'), example: 'toUpper("foo")', result: '"FOO"' },
            { syntax: 'shortest(s1, s2, ...)', description: this.$t('categories.string.shortest'), example: 'shortest("foo", "foobar")', result: '"foo"' },
            { syntax: 'longest(s1, s2, ...)', description: this.$t('categories.string.longest'), example: 'longest("foo", "foobar")', result: '"foobar"' },
            { syntax: 'format(format, arg1, arg2, ...)', description: this.$t('categories.string.format'), example: 'format("test %d", 10)', result: '"test 10"' },
          ],
        },
        {
          id: 'dateTime',
          name: this.$t('categories.dateTime.label'),
          collapse: false,
          chevron: false,
          items: [
            { syntax: 'strftime(datetime, format)', description: this.$t('categories.dateTime.strftime'), example: 'strftime(datefield, "%Y-%m-%d")', result: '"1970-01-01"' },
            { syntax: 'modTime(datetime, duration)', description: this.$t('categories.dateTime.modTime'), example: 'modTime(datefield, "+30m")', result: '"1970-01-01T00:30:00"' },
            { syntax: 'parseISOTime(datetime)', description: this.$t('categories.dateTime.parseISOTime'), example: 'parseISOTime(datefield)', result: '"1970-01-01T00:00:00+00:00"' },
            { syntax: 'parseDuration(duration)', description: this.$t('categories.dateTime.parseDuration'), example: 'parseDuration("2h")', result: '"2h0m0s"' },
            { syntax: 'earliest(d1, d2, ...)', description: this.$t('categories.dateTime.earliest'), example: 'earliest(datefield1, datefield2)', result: '"1970-01-01T00:00:00"' },
            { syntax: 'latest(d1, d2, ...)', description: this.$t('categories.dateTime.latest'), example: 'latest(datefield1, datefield2)', result: '"1970-01-01T00:30:00"' },
          ],
        },
      ],

      formatCategories: [
        {
          id: 'format',
          name: this.$t('formatCategories.string.label'),
          collapse: false,
          chevron: false,
          items: [
            { syntax: '%v', description: this.$t('formatCategories.string.v'), example: 'format("%v", "test")', result: '"test"' },
            { syntax: '%t', description: this.$t('formatCategories.string.t'), example: 'format("%t", true)', result: 'true' },
            { syntax: '%b', description: this.$t('formatCategories.string.b'), example: 'format("%b", 10)', result: '1010' },
            { syntax: '%d', description: this.$t('formatCategories.string.d'), example: 'format("%d", 10)', result: '10' },
            { syntax: '%o', description: this.$t('formatCategories.string.o'), example: 'format("%o", 10)', result: '12' },
            { syntax: '%O', description: this.$t('formatCategories.string.O'), example: 'format("%O", 10)', result: '0o12' },
            { syntax: '%x', description: this.$t('formatCategories.string.x'), example: 'format("%x", 10)', result: 'a' },
            { syntax: '%X', description: this.$t('formatCategories.string.X'), example: 'format("%X", 10)', result: 'A' },
            { syntax: '%b', description: this.$t('formatCategories.string.binary'), example: 'format("%b", 10.11)', result: '5691424029089464p-49' },
            { syntax: '%e', description: this.$t('formatCategories.string.e'), example: 'format("%e", 10.11)', result: '1.011000e+01' },
            { syntax: '%E', description: this.$t('formatCategories.string.E'), example: 'format("%E", 10.11)', result: '1.011000E+01' },
            { syntax: '%f', description: this.$t('formatCategories.string.f'), example: 'format("%f", 10.11)', result: '10.110000' },
          ],
        },
        {
          id: 'strftime',
          name: this.$t('formatCategories.dateTime.label'),
          collapse: false,
          chevron: false,
          items: [
            { syntax: '%Y', description: this.$t('formatCategories.dateTime.Y'), example: 'strftime(dateField, "%Y")', result: '"1993"' },
            { syntax: '%y', description: this.$t('formatCategories.dateTime.y'), example: 'strftime(dateField, "%y")', result: '"93"' },
            { syntax: '%C', description: this.$t('formatCategories.dateTime.C'), example: 'strftime(dateField, "%C")', result: '"19"' },

            { syntax: '%m', description: this.$t('formatCategories.dateTime.m'), example: 'strftime(dateField, "%m")', result: '"02"' },
            { syntax: '%B', description: this.$t('formatCategories.dateTime.B'), example: 'strftime(dateField, "%B")', result: '"February"' },
            { syntax: '%b', description: this.$t('formatCategories.dateTime.b'), example: 'strftime(dateField, "%b")', result: '"Feb"' },

            { syntax: '%U', description: this.$t('formatCategories.dateTime.U'), example: 'strftime(dateField, "%U")', result: '"05"' },
            { syntax: '%V', description: this.$t('formatCategories.dateTime.V'), example: 'strftime(dateField, "%V")', result: '"05"' },
            { syntax: '%W', description: this.$t('formatCategories.dateTime.W'), example: 'strftime(dateField, "%W")', result: '"05"' },

            { syntax: '%A', description: this.$t('formatCategories.dateTime.A'), example: 'strftime(dateField, "%A")', result: '"Tuesday"' },
            { syntax: '%a', description: this.$t('formatCategories.dateTime.a'), example: 'strftime(dateField, "%a")', result: '"Tue"' },
            { syntax: '%d', description: this.$t('formatCategories.dateTime.d'), example: 'strftime(dateField, "%d")', result: '"02"' },
            { syntax: '%e', description: this.$t('formatCategories.dateTime.e'), example: 'strftime(dateField, "%e")', result: '" 2"' },
            { syntax: '%j', description: this.$t('formatCategories.dateTime.j'), example: 'strftime(dateField, "%j")', result: '"033"' },
            { syntax: '%u', description: this.$t('formatCategories.dateTime.u'), example: 'strftime(dateField, "%u")', result: '"5"' },
            { syntax: '%w', description: this.$t('formatCategories.dateTime.w'), example: 'strftime(dateField, "%w")', result: '"2"' },

            { syntax: '%H', description: this.$t('formatCategories.dateTime.H'), example: 'strftime(dateField, "%H")', result: '"06"' },
            { syntax: '%k', description: this.$t('formatCategories.dateTime.k'), example: 'strftime(dateField, "%k")', result: '" 6"' },
            { syntax: '%I', description: this.$t('formatCategories.dateTime.I'), example: 'strftime(dateField, "%I")', result: '"06"' },
            { syntax: '%l', description: this.$t('formatCategories.dateTime.l'), example: 'strftime(dateField, "%l")', result: '" 6"' },

            { syntax: '%M', description: this.$t('formatCategories.dateTime.M'), example: 'strftime(dateField, "%M")', result: '"00"' },

            { syntax: '%S', description: this.$t('formatCategories.dateTime.S-second'), example: 'strftime(dateField, "%S")', result: '"00"' },

            { syntax: '%S', description: this.$t('formatCategories.dateTime.S-middle'), example: 'strftime(dateField, "%S")', result: '"000"' },

            { syntax: '%p', description: this.$t('formatCategories.dateTime.p'), example: 'strftime(dateField, "%p")', result: '"AM"' },
            { syntax: '%c', description: this.$t('formatCategories.dateTime.c'), example: 'strftime(dateField, "%c")', result: '"Tue Feb  2 06:00:00 1993"' },
            { syntax: '%X', description: this.$t('formatCategories.dateTime.X'), example: 'strftime(dateField, "%X")', result: '"06:00:00"' },
            { syntax: '%x', description: this.$t('formatCategories.dateTime.x'), example: 'strftime(dateField, "%x")', result: '"02/02/93"' },
            { syntax: '%Z', description: this.$t('formatCategories.dateTime.Z'), example: 'strftime(dateField, "%Z")', result: '"-0500"' },
            { syntax: '%z', description: this.$t('formatCategories.dateTime.z'), example: 'strftime(dateField, "%z")', result: '"-0500"' },

            { syntax: '%n', description: this.$t('formatCategories.dateTime.n'), example: 'strftime(dateField, "%n")', result: '"\n"' },
            { syntax: '%t', description: this.$t('formatCategories.dateTime.t'), example: 'strftime(dateField, "%t")', result: '"\t"' },
            { syntax: '%%', description: this.$t('formatCategories.dateTime.percent'), example: 'strftime(dateField, "%%")', result: '"%"' },

            { syntax: '%F', description: this.$t('formatCategories.dateTime.F'), example: 'strftime(dateField, "%F")', result: '"1993-02-02"' },
            { syntax: '%D', description: this.$t('formatCategories.dateTime.D'), example: 'strftime(dateField, "%D")', result: '"02/02/93"' },
            { syntax: '%R', description: this.$t('formatCategories.dateTime.R'), example: 'strftime(dateField, "%R")', result: '"06:00"' },
            { syntax: '%r', description: this.$t('formatCategories.dateTime.r'), example: 'strftime(dateField, "%r")', result: '"06:00:00 AM"' },
            { syntax: '%T', description: this.$t('formatCategories.dateTime.T'), example: 'strftime(dateField, "%T")', result: '"06:00:00"' },
            { syntax: '%v', description: this.$t('formatCategories.dateTime.v'), example: 'strftime(dateField, "%v")', result: '" 2-Feb-1993"' },
          ],
        },
      ],

      examples: [
        {
          id: 'valueExpressions',
          name: this.$t('operators.value-expression'),
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
          name: this.$t('operators.sanitizer'),
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
          name: this.$t('operators.validator'),
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
  i18n: i18n(),
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
