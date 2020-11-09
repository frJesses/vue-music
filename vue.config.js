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

      // 2. 获取歌单详细数据
      app.get('/api/getDiscSong', function (req, res) {
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: `https://y.qq.com/n/yqq/playsquare/${req.query.disstid}.html`
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 3. 获取歌手
      app.get('/api/getSingerList', function (req, res) {
        var url = 'ttps://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/portal/singer_list.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 4. 获取歌手歌曲数据
      app.get('/api/getSingerSongs', function (req, res) {
        var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://i.y.qq.com',
            Referer: 'https://i.y.qq.com/n2/m/share/details/singer.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 5. 获取歌曲的vkey
      app.get('/api/getSongVkey', function (req, res) {
        var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/portal/player.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 6. 获取歌词
      app.get('/api/getLyric', function (req, res) {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/portal/player.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 7. 获取排行榜榜单数据
      app.post('/api/getRank', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/m/index.html',
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
          },
          "req_0": {
            "module": "musicToplist.ToplistInfoServer",
            "method": "GetAll",
            "param": {}
          },
          "comm": {
            "g_tk": 5381,
            "uin": 0,
            "format": "json",
            "ct": 23,
            "cv": 0
          }
        }).then(result => {
          res.json(result.data)
        })
      })

      // 8. 获取排行榜歌曲数据
      app.get('/api/getRankSongs', function (req, res) {
        var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/n/yqq/toplist/4.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 9. 获取排行榜歌曲 这个我没有使用
      app.get('/api/getRankDetail', function (req, res) {
        var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/portal/player.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 10. 获取热门搜索
      app.get('/api/getHotSearch', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/m/index.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })

      // 11. 获取搜索结果
      app.get('/api/getSearch', function (req, res) {
        var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            Origin: 'https://y.qq.com',
            Referer: 'https://y.qq.com/m/index.html'
          },
          params: req.query
        }).then(result => {
          res.json(result.data)
        })
      })
    }
  }
}