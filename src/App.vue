<template>
    <div id="app">
        <router-view class="view"></router-view>
    </div>
</template>
<script>
export default {
    created() {},
}
</script>

<style lang="scss">
/* Shared
 * ================================================== */
@import 'assets/styles/shared';

/* Commons
 * ================================================== */
@import 'assets/styles/common/sanitize';
@import 'assets/styles/common/global';
// @import 'assets/styles/common/font';
</style>
