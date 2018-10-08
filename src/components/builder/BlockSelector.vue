<template>
    <div class="block-selector">

        <select :value="blockType" v-on:change="handleBlockTypeChange" name="block-type" id="block-type">
            <option v-bind:value="''" default selected disabled>-- Select a block type --</option>
            <option v-bind:value="'stats'">Stats</option>
            <option v-bind:value="'slack-channel'">Slack Channel</option>
            <option v-bind:value="'google-meet'">Google meet</option>
        </select>

        <form @submit.prevent="handleBlockSelectorFormSubmit">
            <!-- This will need to be dynamic -->

            <div class="input-container">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" v-model="addblockFormData.title">
            </div>

            <div class="input-container">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" v-model="addblockFormData.url">
            </div>

            <input type="submit" value="Add block">

        </form>

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'BlockSelector',

    computed: {
        ...mapState({
            blockType: state => state.builder.blockType,
            addblockFormData: state => state.builder.addblockFormData,
        }),
    },

    methods: {
        ...mapActions('builder', ['handleBlockTypeChange', 'handleBlockSelectorFormSubmit']),
    },
};
</script>

<style lang="scss" scoped>
.block-selector {
    z-index: 999;
    padding: 1em;
    background: lightgrey;
    position: absolute;
    bottom: 2em;
    left: 2em;
}
</style>
