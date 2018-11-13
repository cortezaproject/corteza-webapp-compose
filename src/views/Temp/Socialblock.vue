<template>
  <div>
    <div class="vue-grid-item cssTransforms" style="transform: translate3d(10px, 10px, 0px); width: 500px; height: 430px; position: absolute;">
      <!-- start CRM page block -->
      <div class="gridblock_contents">
        <div class="blockname">Twitter Timeline</div>
        <div class="form_row">
          <a class="twitter-timeline"
            href="https://twitter.com/TwitterDev"
            data-height="400"
            data-chrome="nofooter"
            data-link-color="#820bbb"
            data-border-color="#a80000">
          </a>
        </div>
      </div>
      <!-- start CRM page block -->
    </div>

    <div class="vue-grid-item cssTransforms" style="transform: translate3d(520px, 10px, 0px); width: 500px; height: 430px; position: absolute;">
      <!-- start CRM page block -->
      <div class="gridblock_contents">
        <div class="blockname">Twitter keyword</div>
        <div class="form_row">
          <a href="https://twitter.com/intent/tweet?button_hashtag=LoveTwitter&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-show-count="false">Tweet #LoveTwitter</a>
        </div>
      </div>
      <!-- start CRM page block -->
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let twitterScript = document.createElement('script')
    twitterScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    document.head.appendChild(twitterScript)
  },
}
</script>