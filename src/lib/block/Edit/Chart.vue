<template>
    <div>
        <fieldset class="form-group">
            List of all chart that are generated in the chart module.
            <textarea rows="5"></textarea>
        </fieldset>
    </div>
</template>
<script>
import optionsSyncProp from './mixins/optionsSyncProp.js'

export default {
  name: 'Chart',

  mixins: [
    optionsSyncProp,
  ],
}
</script>
