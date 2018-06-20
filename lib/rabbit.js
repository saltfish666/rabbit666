const http = require('http')

class rabbit {
  constructor () {
    this.afterReqArrayFuns = []
    this.beforeResArrayFuns = []
    this.routerArr = []
  }

  listen (port) {
    const server = http.createServer(this.getCallbackFun())
    return server.listen(port)
  }
  getCallbackFun () {
    let that = this
    return function (req, res) {
      console.log(req, res)

      that.afterReqArrayFuns.forEach(fun => { // 不同的req中间件可能冲突，不方便维护扩展啊，难道只能不断测试？
        fun(req)
      })

      function excRouter () {
        for (let router of that.routerArr) {
          if (router.method.toLocaleLowerCase() === req.method.toLocaleLowerCase() &&
                                        router.pathReg.test(req.url.split('?')[0])) {
            router.callback(req, res)
            break
          }
        }
      }

      if (req.method.toLocaleLowerCase() === 'get') {
        excRouter()
        that.beforeResArrayFuns.forEach(fun => {
          fun(req)
        })
        that.NotExistUrl(req, res)
      }

      /* get请求会忽略这一段 */
      req.on('data', function (dataBuf) {
        console.log('ondata')
        req.body = dataBuf.toString('utf8')
        console.log(req, res)
        excRouter()
        that.beforeResArrayFuns.forEach(fun => {
          fun(req)
        })
        that.NotExistUrl(req, res)
      })
    }
  }

  afterReq () {
    for (let i = 0; i < arguments.length; i++) {
      this.afterReqArrayFuns.push(arguments[i])
    }
  }
  beforeRes () {
    for (let i = 0; i < arguments.length; i++) {
      this.beforeResArrayFuns.push(arguments[i])
    }
  }

  router (method, pathReg, callback) {
    let obj = {
      method,
      pathReg,
      callback
    }
    this.routerArr.push(obj)
  }

  static NotExistUrl (req, res) {
    try {
      res.end('Not Exist Url')
    } catch (e) {

    }
  }
}

module.exports = rabbit
