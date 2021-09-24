<template>
  <b-container fluid>
    <b-row>
      <b-col
        cols="4"
      >
        <b-list-group>
          <b-list-group-item
            v-for="(type) in types"
            :key="type.label"
            :disabled="!recordPage && type.recordPageOnly"
            button
            @click="$emit('select', type.block)"
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
      <b-col>{{ $t('selectBlockFootnote') }}.</b-col>
    </b-row>
  </b-container>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'
import * as images from '../../../../assets/PageBlocks'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

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
          label: this.$t('content.label'),
          recordPageOnly: false,
          block: new compose.PageBlockContent(),
          image: images.Content,
        },
        {
          label: this.$t('metric.label'),
          recordPageOnly: false,
          block: new compose.PageBlockMetric(),
          image: images.Metric,
        },
        {
          label: this.$t('chart.label'),
          recordPageOnly: false,
          block: new compose.PageBlockChart(),
          image: images.Chart,
        },
        {
          label: this.$t('socialFeed.label'),
          recordPageOnly: false,
          block: new compose.PageBlockSocialFeed(),
          image: images.SocialFeed,
        },
        {
          label: this.$t('record.label'),
          recordPageOnly: true,
          block: new compose.PageBlockRecord(),
          image: images.Record,
        },
        {
          label: this.$t('recordList.label'),
          recordPageOnly: false,
          block: new compose.PageBlockRecordList(),
          image: images.RecordList,
        },
        {
          label: this.$t('automation.label'),
          recordPageOnly: false,
          block: new compose.PageBlockAutomation(),
          image: images.Automation,
        },
        {
          label: this.$t('calendar.label'),
          recordPageOnly: false,
          block: new compose.PageBlockCalendar(),
          image: images.Calendar,
        },
        {
          label: this.$t('file.label'),
          recordPageOnly: false,
          block: new compose.PageBlockFile(),
          image: images.File,
        },
        {
          label: this.$t('recordOrganizer.label'),
          recordPageOnly: false,
          block: new compose.PageBlockRecordOrganizer(),
          image: images.RecordOrganizer,
        },
        {
          label: this.$t('iframe.label'),
          recordPageOnly: false,
          block: new compose.PageBlockIFrame(),
          image: images.IFrame,
        },
        {
          label: this.$t('comment.label'),
          recordPageOnly: false,
          block: new compose.PageBlockComment(),
          image: images.Comment,
        },
      ],
    }
  },
}
</script>
