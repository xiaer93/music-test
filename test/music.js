/**
 * Created by xiaer on 2018/8/7.
 */
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
var expect = require('chai').expect
var sinon = require('sinon')
var fs = require('fs')
var CreateMusic = require('../src/music')

chai.use(chaiAsPromised)

// 在每个测试实例之前创建对象~~~还可以声明在describe中？
var createMusic, sandbox
beforeEach(function () {
  createMusic = new CreateMusic()
  sandbox = sinon.createSandbox()
})
afterEach(function () {
  createMusic = null
  sandbox.restore()
})

// 金丝雀测试
describe('canary test', function () {
  it('canary test', function () {
    expect(true).to.be.true
  })
})

// readFile测试.【流程检测，特殊情况检测？】
describe('readFile test', function () {
  // 无效文件应该报错
  it('readFile should invoke error handler for invalid file', function (done) {
    var onError = function (error) {
      expect(error).to.be.eql('Error reading file: InvalidFile')
      done()
    }
    
    sandbox.stub(fs, 'readFile').callsFake(function (filename, callback) {
      callback(new Error('failed'))
    })
    
    createMusic.readFile('InvalidFile', onError)
  })

  // 有效文件应该正确解析后，传递给processMusic
  it('readFile should invoke parseMusic for valid file', function (done) {
    var rawData = '小螺号\n爱你的365天'
    var parseData = ['小螺号', '爱你的365天']

    sandbox.stub(createMusic, 'parseMusic')
      .withArgs(rawData)
      .returns(parseData)
    
    sandbox.stub(createMusic, 'processMusic').callsFake(function (data) {
      expect(data).to.be.eql(parseData)
      done()
    })

    sandbox.stub(fs, 'readFile').callsFake(function (filename, callback) {
      callback(null, rawData)
    })

    createMusic.readFile('123.txt')
  })

  // 有效文件，但内容为空应该报错
  it('readFile should return error if given file is empty', function (done) {
    var onError = function (error) {
      expect(error).to.be.eql('File 123.txt has invalid content')
      done()
    }

    sandbox.stub(fs, 'readFile').callsFake(function (filename, callback) {
      callback(null, '')
    })
    sandbox.stub(createMusic, 'parseMusic')
      .withArgs('')
      .returns([])

    createMusic.readFile('123.txt', onError)
  })
})

// parseMusic测试
describe('parseMusic test', function () {
  it('parseMusic should return musicList', function () {
    var rawData = '天使之城\nlove day\n想你的365天'
    var musicList = createMusic.parseMusic(rawData)

    expect(musicList).to.be.eql(['天使之城', 'love day', '想你的365天'])
  })
  it('parseMusic should return empty for white-space', function () {
    expect(createMusic.parseMusic('   ')).to.be.eql([])
  })
  it('parseMusic should ignore unexpected format in content', function () {
    // 歌曲名为空获取空格符，则忽略此歌曲
    var rawData = '天使之城\n                \nlove day\n\n想你的365天'
    var musicList = createMusic.parseMusic(rawData)

    expect(musicList).to.be.eql(['天使之城', 'love day', '想你的365天'])
  })
})

// processMusic测试
describe('processMusic test', function () {
  it('processMusic should call getMusic for each music', function () {
    var createMusicMock = sandbox.mock(createMusic)
    createMusicMock.expects('getMusic').withArgs('天使之城')
    createMusicMock.expects('getMusic').withArgs('love day')
    createMusicMock.expects('getMusic').withArgs('想你的365天')

    createMusic.processMusic(['天使之城', 'love day', '想你的365天'])
    createMusicMock.verify()
  })
  it('processMusic should save musicList count', function () {
    createMusic.processMusic(['天使之城', 'love day', '想你的365天'])
    expect(createMusic.musicCount).to.be.eql(3)
  })
})

// getMusic测试
describe('getMusic test', function () {
  it('getMusic should call get on http with valid url', function () {
    // 创建了替身，原有代码应该不会运行的呀？
    var axiosHttp = sandbox.stub(createMusic.axios, 'get').callsFake(function (url, obj) {
      expect(url).to.be.eql('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp')
      expect(obj.params.w).to.be.eql('abc')
      // fixme: 返回promise对象，允许后续then
      return Promise.resolve()
    })

    return createMusic.getMusic('abc')
  })

  // axios返回promise对象，如何测试？----promise能够根据结果正确执行processMusic和processError~~~
  // https://stackoverflow.com/questions/31845329/testing-rejected-promise-in-mocha-chai
  it('getMusic should invoke right handler', function () {
    var onSuccess = function (){}
    var onError = function () {}
    var onStub = Promise.resolve()
    var mock = sandbox.mock()

    sandbox.stub(createMusic.axios, 'get').callsFake(function () {
      return mock
    })

    mock.expects('then').returns('http://example.com')
    mock.expects('catch').returns('error')

    expect(onSuccess).calledOnce()
    expect(onError).calledOnce()


    return createMusic.getMusic('abc', onSuccess, onError)
  })
})
