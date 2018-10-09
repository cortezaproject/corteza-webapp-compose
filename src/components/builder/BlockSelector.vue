<template>
    <div class="block-selector">

        <select :value="blockType" v-on:change="handleBlockTypeChange" name="block-type" id="block-type">
            <option v-bind:value="''" default selected disabled>-- Select a block type --</option>
            <option v-bind:value="'stats'">Stats</option>
            <option v-bind:value="'slack-channel'">Slack Channel</option>
            <option v-bind:value="'google-meet'">Google meet</option>
        </select>

        <FormSchema ref="formSchema" v-model="addBlockFormData" @submit.prevent="handleBlockSelectorFormSubmit">
            <button type="submit">Insert Block</button>
        </FormSchema>

        <!-- This will need to be dynamic -->
        <!-- <form @submit.prevent="handleBlockSelectorFormSubmit">

            <div class="input-container">
                <label for="title">Title</label>
                <input type="text" name="title" id="title" v-model="addBlockFormData.title">
            </div>

            <div class="input-container">
                <label for="url">URL</label>
                <input type="text" name="url" id="url" v-model="addBlockFormData.url">
            </div>

            <input type="submit" value="Add block">

        </form> -->

    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FormSchema from '@formschema/native';
import axios from 'axios';

export default {
    name: 'BlockSelector',
    components: {
        FormSchema,
    },

    data() {
        return {
            model: {},
        };
    },

    computed: {
        ...mapState({
            blockType: state => state.builder.blockType,
            jsonSchema: state => state.builder.jsonSchema,
        }),

        addBlockFormData: {
            get() {
                return this.$store.state.builder.addBlockFormData;
            },
            set(newValue) {
                this.$store.commit('builder/addBlockFormData', newValue);
            },
        },
    },

    methods: {
        ...mapActions('builder', ['handleBlockTypeChange', 'handleBlockSelectorFormSubmit']),

        submit(e) {
            console.log('submitted', this.model);
        },
    },

    watch: {
        jsonSchema(value) {
            this.$refs.formSchema.load(value);
        },
    },
};
</script>

<style lang="scss">
.block-selector {
    z-index: 999;
    padding: 1em;
    background: lightgrey;
    position: absolute;
    bottom: 2em;
    left: 2em;
}

[id^='form-schema'] {
    margin: 20px 0;
    padding: 1em;
    border: 1px dashed grey;

    form {
        & > div {
            margin-bottom: 1em;
        }
    }
}
</style>
