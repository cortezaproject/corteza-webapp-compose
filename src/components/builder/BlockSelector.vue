<template>
    <div class="block-selector">

        <select :value="blockType" v-on:change="handleBlockTypeChange" name="block-type" id="block-type">
            <option v-bind:value="''" default selected disabled>-- Select a block type --</option>
            <option v-bind:value="'stats'">Stats</option>
            <option v-bind:value="'slack-channel'">Slack Channel</option>
            <option v-bind:value="'google-meet'">Google meet</option>
        </select>

        <form v-if="blockType" @submit.prevent="handleFormSubmit">
            <!-- This will need to be dynamic -->

            <div class="input-container">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" v-model="formData.title">
            </div>

            <div class="input-container">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" v-model="formData.url">
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
            formData: state => state.builder.formData,
        }),
    },

    methods: {
        ...mapActions('builder', ['handleBlockTypeChange', 'handleFormSubmit']),
    },
};
</script>

<style lang="scss" scoped>
.block-selector {
    padding: 1em;
    background: lightgrey;
}
</style>
