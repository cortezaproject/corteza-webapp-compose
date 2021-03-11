<template class="h-100">
  <b-card class="h-100"
          footer-bg-variant="white"
  >
    <h2 class="h5">{{ namespace.name }}</h2>
    <p v-if="namespace.meta.subtitle"
       class="font-weight-bold"
    >
          {{ namespace.meta.subtitle }}
    </p>
    <p v-if="namespace.meta.description">
      {{ namespace.meta.description }}
    </p>
    <span slot="footer">
      <b-button v-if="namespace.enabled"
                :to="{ name: 'pages', params: { slug: (namespace.slug || namespace.namespaceID) } }"
                variant="light"
                size="lg">
        Visit namespace
      </b-button>
      <b-button v-if="namespace.canUpdateNamespace"
                :to="{ name: 'namespace.edit', params: { namespaceID: namespace.namespaceID } }"
                variant="light"
                class="float-right"
                size="lg">
        <font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
      </b-button>
      <slot />
    </span>
  </b-card>
</template>
<script>
export default {
  props: {
    namespace: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isEnabled () {
      return !!this.namespace.enabled
    },
  },
}
</script>
<style lang="scss" scoped>
  $nsheight: 200px;
  $nsvisualheight: 100px;

  .pointer {
    cursor: pointer;
  }

  .ns-text {
    color: $secondary;
    line-height: 50px;
    height: 100px;
    font-size: 20px;
    max-width: 85%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 auto;
  }

  .subtitle {
    line-height: 45px;
    height: 100px;

    span {
      font-size: 15px;
    }
  }

  .text {
    font-size: 15px;
    color: #000;
  }

  .ns-visual {
    height: $nsvisualheight;
    transition: opacity 0.5s;
  }

  .ns-display-options {
    transition: opacity 0.75s;
    opacity: 0;

    .extra-text {
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-height: 16px;
        max-height: 160px;
        text-align: justify;
        max-width: 95%;
        margin: 0 auto;
      }

      .click {
        height: 170px;
        line-height: 130px;
        color: $secondary;
        font-size: 24px;
      }

      height: 160px;
    }

    .no-edit {
      padding-top: 10px;
    }

    .options {
      height: 35px;
      line-height: 30px;
      font-size: 20px;
      text-align: left;
      width: 95%;
      margin: 0 auto;
    }
  }

  .ns-logo {
    i {
      transform: translateY(10px);
      height: $nsvisualheight - 10px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-y: center;
      width: 75%;
    }

    img {
      transform: translateY(10px);
      height: $nsvisualheight - 10px;
      width: 75%;
    }
  }

  .ns-wrap {
    min-height: 200px;
    max-height: 200px;
    min-width: 240px;
    max-width: 100%;
    overflow: hidden;
    background-color: #fff;

    .ns-label {
      transition: all 0.25s;
    }

    &:hover,
    &:focus {
      .ns-label {
        margin-top: -200px;
      }

      .ns-visual {
        opacity: 0;
      }

      .ns-display-options {
        opacity: 1;
      }
    }
  }
</style>
