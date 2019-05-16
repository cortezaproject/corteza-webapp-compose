<template>
  <div class="ns-wrap">
    <div :class="{ 'ns-label': true, 'pointer': isEnabled }">
      <label
        class="ns-visual ns-logo">
        <i :style="'background-image:url(' + logo + ');'" />
      </label>
      <div>
        <label :class="{'ns-text': true, 'subtitle': namespace.meta.subtitle}">
          {{ namespace.name }}
          <span v-if="namespace.meta.subtitle">
            <br>{{ namespace.meta.subtitle }}
          </span>
        </label>
      </div>
    </div>
    <!-- this should appear on hover -->
    <div class="ns-display-options">
      <div class="options actions">
        <router-link :to="{ name: 'namespace.edit', params: { namespaceID: namespace.namespaceID } }" class="action p-0">
          <i class="icon-edit"></i>
        </router-link>
      </div>
      <div class="extra-text text">
        <p class="description" v-if="namespace.meta.description">{{ namespace.meta.description }}</p>
        <label v-else :class="{ 'click': true, 'pointer': isEnabled }">
          <span v-if="isEnabled">
            {{ $t('namespace.clickOpen') }}
          </span>
          <span v-else>
            {{ $t('namespace.disabled') }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    namespace: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      logo: require('@/assets/images/crust-logo-with-tagline.png'),
    }
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

  .ns-visual,
  .ns-text,
  .ns-display-options {
    display: block;
    text-align: center;
  }

  .ns-text {
    color: #90A3B1;
    line-height: 100px;
    height: 100px;
    font-size: 24px;
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
    line-height: $nsvisualheight;
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
        -webkit-line-clamp: 10;
        line-height: 16px;
        max-height: 160px;
        text-align: justify;
        max-width: 95%;
        margin: 0 auto;
      }

      .click {
        height: 170px;
        line-height: 130px;
        color: #90A3B1;
        font-size: 24px;
      }

      height: 160px;
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
      top: 50%;
      transform: translateY(10px);
      display: block;
      height: $nsvisualheight - 10px;
      margin: 0 auto;
      border-radius: 3px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
      background-position-y: center;
    }
  }

  .ns-letter i {
    font-weight: 600;
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
