<template>
    <div>
        <fieldset class="form-group">
            Social media feed from Twitter.
            <br />
            Must allow to read the value of a field if the page has a module, such as account.twitter-handle (which could be @tesla for example for a lead from Tesla)
            <br />
            Alternatively, if there is no module, it should allow any value from a normal text input field, where we can load for example: "@bloomberg" (for a feed from bloomberg on a dashboard page)
        </fieldset>
    </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
  name: 'SocialFeed',
}
</script>
