import { mapGetters } from "vuex";

export const playMinix = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newList) {
      this.handlePlayList(newList)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('You need to handle the handleplaylist method')
    }
  }
}