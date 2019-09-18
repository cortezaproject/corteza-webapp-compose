import { storiesOf } from '@storybook/vue'
import { Confirm, DateTime } from 'corteza-webapp-common/src/components/Input'
import i18n from 'corteza-webapp-compose/src/i18n'
import { withKnobs, boolean, text } from '@storybook/addon-knobs'

const input = storiesOf('Components/Input', module)
input.addDecorator(withKnobs)

input.add('Confirm', () => ({
  components: { Confirm },

  props: {
    disabled: {
      default: boolean('Disabled', false),
    },
    noPrompt: {
      default: boolean('NoPrompt', false),
    },
    borderless: {
      default: boolean('Borderless', false),
    },
    variant: {
      default: text('Variant', 'outline-danger'),
    },
    size: {
      default: text('Size', 'sm'),
    },
    variantOk: {
      default: text('VariantOk', 'danger'),
    },
    variantCancel: {
      default: text('VariantCancel', undefined),
    },
    sizeConfirm: {
      default: text('SizeConfirm', 'sm'),
    },
  },

  template: `
    <confirm :disabled="disabled"
             :noPrompt="noPrompt"
             :borderless="borderless"
             :variant="variant"
             :size="size"
             :variantOk="variantOk"
             :variantCancel="variantCancel"
             :sizeConfirm="sizeConfirm">

      <span>Remove</span>
      <span slot="yes">Confirm</span>
      <span slot="no">No</span>
    </confirm>
  `,
  i18n: i18n(),
}))

input.add('DateTime', () => ({
  components: { DateTime },

  props: {
    noTime: {
      default: boolean('No Time', false),
    },
    noDate: {
      default: boolean('No Date', false),
    },
  },

  template: `
    <date-time :noTime="noTime"
               :noDate="noDate" />
  `,
  i18n: i18n(),
}))
