/**
 * Created by xiaer on 2018/8/7.
 */
var config = require('../config/config')
var fs = require('fs')
var axios = require('axios')


var CreateMusic = function () {
  this._getConfig = config
  this.musicCount = 0

  this.readFile = function (filename, onError) {
    var self = this
    var onSuccess = function (data) {
      var musicList = self.parseMusic(data)
      if(musicList.length) {
        self.processMusic(musicList)
      } else {
        onError('File ' + filename + ' has invalid content')
      }
    }

    fs.readFile(filename, function (err, data) {
      if(err) {
        onError('Error reading file: ' + filename)
      } else {
        onSuccess(data)
      }
    })
  }
  this.parseMusic = function (data) {
    var musicList = data.split('\n')

    return musicList.filter(function (t) {
      return !!t.trim().length
    })
  }
  this.processMusic = function (musicList) {
    var self = this
    this.musicCount = musicList.length
    musicList.forEach(function (t) { 
      self.getMusic(t)
    })
  }
  this.getMusic = function (musicName, onSuccess, onError) {
    var self = this
    this._getConfig.w = musicName
    this.axios.get('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: self._getConfig
    }).then(function (response) {
      onSuccess(musicName, response)
    }).catch(function (error) {
      onError(musicName, 'error to get file url')
    })
  }
  this.axios = axios
}

module.exports = CreateMusic