import momentjs from 'moment'

export default {
  methods: {
    prettyDate (input) {
      if (typeof input === 'string') {
        return momentjs(input).format('DD/MM/YYYY')
      }

      return input
    },
  },
}
