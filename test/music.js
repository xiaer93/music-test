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

// ��ÿ������ʵ��֮ǰ��������~~~������������describe�У�
var createMusic, sandbox
beforeEach(function () {
  createMusic = new CreateMusic()
  sandbox = sinon.createSandbox()
})
afterEach(function () {
  createMusic = null
  sandbox.restore()
})

// ��˿ȸ����
describe('canary test', function () {
  it('canary test', function () {
    expect(true).to.be.true
  })
})

// readFile����.�����̼�⣬���������⣿��
describe('readFile test', function () {
  // ��Ч�ļ�Ӧ�ñ���
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

  // ��Ч�ļ�Ӧ����ȷ�����󣬴��ݸ�processMusic
  it('readFile should invoke parseMusic for valid file', function (done) {
    var rawData = 'С�ݺ�\n�����365��'
    var parseData = ['С�ݺ�', '�����365��']

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

  // ��Ч�ļ���������Ϊ��Ӧ�ñ���
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

// parseMusic����
describe('parseMusic test', function () {
  it('parseMusic should return musicList', function () {
    var rawData = '��ʹ֮��\nlove day\n�����365��'
    var musicList = createMusic.parseMusic(rawData)

    expect(musicList).to.be.eql(['��ʹ֮��', 'love day', '�����365��'])
  })
  it('parseMusic should return empty for white-space', function () {
    expect(createMusic.parseMusic('   ')).to.be.eql([])
  })
  it('parseMusic should ignore unexpected format in content', function () {
    // ������Ϊ�ջ�ȡ�ո��������Դ˸���
    var rawData = '��ʹ֮��\n                \nlove day\n\n�����365��'
    var musicList = createMusic.parseMusic(rawData)

    expect(musicList).to.be.eql(['��ʹ֮��', 'love day', '�����365��'])
  })
})

// processMusic����
describe('processMusic test', function () {
  it('processMusic should call getMusic for each music', function () {
    var createMusicMock = sandbox.mock(createMusic)
    createMusicMock.expects('getMusic').withArgs('��ʹ֮��')
    createMusicMock.expects('getMusic').withArgs('love day')
    createMusicMock.expects('getMusic').withArgs('�����365��')

    createMusic.processMusic(['��ʹ֮��', 'love day', '�����365��'])
    createMusicMock.verify()
  })
  it('processMusic should save musicList count', function () {
    createMusic.processMusic(['��ʹ֮��', 'love day', '�����365��'])
    expect(createMusic.musicCount).to.be.eql(3)
  })
})

// getMusic����
describe('getMusic test', function () {
  it('getMusic should call get on http with valid url', function () {
    // ����������ԭ�д���Ӧ�ò������е�ѽ��
    var axiosHttp = sandbox.stub(createMusic.axios, 'get').callsFake(function (url, obj) {
      expect(url).to.be.eql('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp')
      expect(obj.params.w).to.be.eql('abc')
      // fixme: ����promise�����������then
      return Promise.resolve()
    })

    return createMusic.getMusic('abc')
  })

  // axios����promise������β��ԣ�----promise�ܹ����ݽ����ȷִ��processMusic��processError~~~
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
