import moment from 'moment'

const sortMethod = {
  string: (a, b) => a.localeCompare(b),
  number: (a, b) => a - b,
  date: (a, b) => (new Date(a)) - (new Date(b)),
  moment: (a, b) => moment(a) - moment(b),
  boolean: (a, b) => {
    if (a && !b) { return -1 }
    if (!a && b) { return 1 }
    return 0
  }
}

function nextDirection (dir) {
  if (dir === 0) { return 1 }
  if (dir === 1) { return -1 }
  return 0
}

function getSortFn (sort, type) {
  if (typeof sort === 'function') {
    return sort
  }
  if (type && sortMethod[type]) {
    return sortMethod[type]
  }
}

export default {
  data () {
    return {
      sorting: {
        field: '',
        dir: 0,
        fn: false
      }
    }
  },
  watch: {
    'sorting.dir' () {
      this.resetBody()
    }
  },
  methods: {
    setSortField (col) {
      if (this.sorting.field === col.field) {
        this.sorting.dir = nextDirection(this.sorting.dir)
        if (this.sorting.dir === 0) {
          this.sorting.field = ''
        }
        return
      }

      this.sorting.field = col.field
      this.sorting.dir = 1
      this.sorting.fn = getSortFn(col.sort, col.type)
    },
    sort (rows) {
      let sortFn = this.sorting.fn
      const
        field = this.sorting.field,
        dir = this.sorting.dir

      if (!sortFn) {
        sortFn = sortMethod[typeof rows[0][field]] || ((a, b) => a - b)
      }
      rows.sort((a, b) => dir * sortFn(a[field], b[field]))
    }
  }
}
