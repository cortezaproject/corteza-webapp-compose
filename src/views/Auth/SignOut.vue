<template>
    <div class="signIn login-process centered">
        <div class="app-form-wrap shaded">
            <div class="crust-window-header">
                <div class="crust_main-header_title-wrap">
                    <strong class="crust_main-header_title">Crust</strong>
                    <span class="crust_main-header_title__pf">platform</span>
                </div>
            </div>
            <form class="large-form">
                Signing out...
            </form>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            oidc: this.$auth.baseURL() + '/oidc',
        };
    },
    computed: {
        ...mapGetters({
            isAuthenticated: 'auth/isAuthenticated',
        }),
    },
    mounted() {
        if (this.isAuthenticated) {
            this.$auth.clear().catch(err => {
                console.error(err);
            });
        }
        this.$router.push({ name: 'signin' });
    },
};
</script>