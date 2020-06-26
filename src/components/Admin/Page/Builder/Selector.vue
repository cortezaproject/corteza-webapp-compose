<template>
  <b-container fluid>
    <b-row>
      <b-col
        cols="4"
      >
        <b-list-group
        >
          <b-list-group-item
            v-for="(type) in types"
            :disabled="!recordPage && type.recordPageOnly"
            @click="$emit('select', type.block)"
            :key="type.label"
            button
            @mouseover="current = type.image"
          >
            {{ type.label }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col
        cols="8"
        class="my-auto"
      >
        <b-img
          v-if="current"
          fluid
          thumbnail
          :src="current"
        />
      </b-col>
    </b-row>
    <b-row
      class="border-top mt-2"
    >
      <b-col>{{ $t('page.build.selectBlockFootnote') }}.</b-col>
    </b-row>
  </b-container>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'
import * as images from '../../../../assets/PageBlocks'

export default {
  props: {
    recordPage: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      current: undefined,
      types: [
        {
          label: this.$t('block.content.label'),
          recordPageOnly: false,
          block: new compose.PageBlockContent(),
          image: images.Content,
        },
        {
          label: this.$t('block.metric.label'),
          recordPageOnly: false,
          block: new compose.PageBlockMetric(),
          image: images.Metric,
        },
        {
          label: this.$t('block.chart.label'),
          recordPageOnly: false,
          block: new compose.PageBlockChart(),
          image: images.Chart,
        },
        {
          label: this.$t('block.socialFeed.label'),
          recordPageOnly: false,
          block: new compose.PageBlockSocialFeed(),
          image: images.SocialFeed,
        },
        {
          label: this.$t('block.record.label'),
          recordPageOnly: true,
          block: new compose.PageBlockRecord(),
          image: images.Record,
        },
        {
          label: this.$t('block.recordList.label'),
          recordPageOnly: false,
          block: new compose.PageBlockRecordList(),
          image: images.RecordList,
        },
        {
          label: this.$t('block.automation.label'),
          recordPageOnly: false,
          block: new compose.PageBlockAutomation(),
          image: images.Automation,
        },
        {
          label: this.$t('block.calendar.label'),
          recordPageOnly: false,
          block: new compose.PageBlockCalendar(),
          image: images.Calendar,
        },
        {
          label: this.$t('block.file.label'),
          recordPageOnly: false,
          block: new compose.PageBlockFile(),
          image: images.File,
        },
        {
          label: this.$t('block.recordOrganizer.label'),
          recordPageOnly: false,
          block: new compose.PageBlockRecordOrganizer(),
          image: images.RecordOrganizer,
        },
        {
          label: this.$t('block.iframe.label'),
          recordPageOnly: false,
          block: new compose.PageBlockIFrame(),
          image: images.IFrame,
        },
      ],
    }
  },
}
</script>
