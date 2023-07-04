// 模块化
(function () {
    // 定义常量
    const PENDING = 'pending' // 进行中
    const FULFILLED = 'fulfilled' // 成功
    const REJECTED = 'rejected' // 失败


    function Promise(executor) { // 执行器函数
        // 保存状态
        this.status = PENDING
        // 保存数据
        this.data = undefined

        // 缓存待执行的成功和失败的回调函数 [{fulfilled: fn, rejected: fn}]
        this.waitCallbackList = []

        // 缓存 this
        var _this = this

        // 封装函数：处理成功和失败的回调函数
        function handleResolveOrReject(type, result) {
            // Promise 状态只能改变一次
            if (_this.isNotInPending()) return
            _this.status = type
            _this.data = result

            // 执行所有成功或失败的回调函数
            if (_this.waitCallbackList.length !== 0) {
                _this.waitCallbackList.forEach(function (item) {
                    item[type](result)
                })
            }
        }

        // 第一种：执行 resolve 函数可以改变 p1 的状态
        function resolve(result) {// 将 Promise 对象从 pending 改变为 fulfilled
            handleResolveOrReject(FULFILLED, result)
        }

        // 第二种：执行reject 函数可以改变 p1 的状态
        function reject(result) {
            handleResolveOrReject(REJECTED, result)
        }

        // 第三种：出现异常或抛出错误可以改变 p1 的状态, 如果捕获错误->try...catch
        try {
            executor(resolve, reject)
        } catch (error) {
            // 表示出错了 改变p1的状态为失败状态,结果为捕获到的错误信息
            reject(error)
        }
    }

    // 判断状态是不是进行中
    Promise.prototype.isNotInPending = function () {
        return this.status !== PENDING
    }

    // then 方法用于指定Promise对象成功状态和失败状态的回调函数
    Promise.prototype.then = function (resolveCallback, rejectCallback) { // 异步执行的函数
        // 设置默认值的原因？保证能够继续链式调用
        resolveCallback = resolveCallback || function(res) { return res }
        rejectCallback = rejectCallback || function(res) { return res }
        var _this = this
        // 3. 返回一个新的 Promise 对象
        return new Promise(function (resolve, reject) {

            // 封装函数 处理 p1 的返回值
            function handleResult(cb) {
                try {
                    var result = cb(_this.data)
                    // 如果返回值为 Promise 该如何执行才能知道状态？通过执行result.then方法
                    if (result instanceof Promise) {
                        return result.then(resolve, reject)
                    }
                    // 非 Promise
                    return resolve(result)
                } catch (error) {
                    // 程序异常或抛出错误 改变 p2 的状态为失败结果为错误信息
                    reject(error)
                }
            }

            // 状态不为 pending 时
            if (_this.isNotInPending()) {
                setTimeout(function () {
                    handleResult(_this.status === FULFILLED ? resolveCallback : rejectCallback)
                }, 2000)
                return
            }

            // pending 状态时
            _this.waitCallbackList.push({
                [FULFILLED]: function () {
                    handleResult(resolveCallback)
                },
                [REJECTED]: function () {
                    handleResult(rejectCallback)
                }
            })

        })
    }

    Promise.prototype.catch = function (rejectCallback) {
        console.log('catch 方法执行...');
        return this.then(null, rejectCallback)
    }

    // 静态方法
    Promise.all = function () {
        console.log('all 方法执行...');
    }
    Promise.race = function () {
        console.log('race 方法执行...');
    }

    // 向全局暴露
    window.Promise = Promise
})()