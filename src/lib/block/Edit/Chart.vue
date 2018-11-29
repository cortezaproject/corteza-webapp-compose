<template>
    <div>
        <fieldset class="form-group">
            List of all chart that are generated in the chart module.
            <textarea rows="5"></textarea>
        </fieldset>
    </div>
</template>
<script>
import optionSyncProp from './mixins/optionSyncProp.js'

export default {
  name: 'Chart',

  mixins: [
    optionSyncProp,
  ],
}
</script>
