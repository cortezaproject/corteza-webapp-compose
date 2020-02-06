import momentjs from 'moment'

export default {
  methods: {
    prettyDate (input) {
      return momentjs(input).format('DD/MM/YYYY')
    },
  },
}
