const http = require("http");

class rabbit {
    constructor(){
        this.afterReqArrayFuns = [];
        this.router = {
            "GET":{},
            "POST":{},
        }
    }

    listen(port){
        const server = http.createServer(this.getCallbackFun());
        return server.listen(port)
    }
    getCallbackFun(){
        let that =this;
        return function (req,res) {
            that.afterReqArrayFuns.forEach(fun => {         // 不同的req中间件可能冲突，不方便维护扩展啊，难道只能不断测试？
                fun(req)
            });
            res.write(JSON.stringify(req.query));
            //res.write(JSON.stringify(req.cookie))

            let path = req.url.split("?")[0];
            let callback = that.router[req.method] ? (that.router[req.method][path] || that.NotExistUrl) : that.NotExistUrl;
            callback(req,res);
        }
    }

    afterReq(){
        for(let i = 0;i<arguments.length;i++){
            this.afterReqArrayFuns.push(arguments[i])
        }
    }

    get(path,callback) {
        this.router["GET"][path] = callback
    }
    post(path,callback){
        this.router["POST"][path] = callback
    }

    NotExistUrl(req,res){
        res.end('Not found')
    }
}

module.exports = rabbit;
