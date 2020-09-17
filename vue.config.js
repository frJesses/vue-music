const axios = require('axios')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        api: '@/api',
        base: '@/base',
        common: '@/common',
        components: '@/components',
        router: '@/router',
        store: '@/store'
      }
    }
  },
  devServer: {
    before(app) {
      // 1. 获取首页歌单
      app.get('/api/getSongList', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/portal/playlist.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })
    }
  }
}