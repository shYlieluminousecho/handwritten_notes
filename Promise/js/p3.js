// 模块化
(function () {
    function Promise(executor) { // 执行器函数
        console.log('构造函数调用...');
        // 保存状态
        this.status = 'pending'
        // 保存数据
        this.data = undefined

        // 缓存待执行的成功和失败的回调函数 [{fulfilled: fn, rejected: fn}]
        this.waitCallbackList = []

        // 缓存 this
        var _this = this
        // 第一种：执行 resolve 函数可以改变 p1 的状态
        function resolve(result) {// 将 Promise 对象从 pending 改变为 fulfilled
            console.log('resolve 函数执行...');
            // Promise 状态只能改变一次
            if (_this.status !== 'pending') return
            _this.status = 'fulfilled'
            _this.data = result

            // 执行所有成功的回调函数
            if (_this.waitCallbackList.length !== 0) {
                _this.waitCallbackList.forEach(function(item) {
                    item.fulfilled(result)
                })
            }
        }

        // 第二种：执行reject 函数可以改变 p1 的状态
        function reject(result) {
            console.log('reject 函数执行...');
            // Promise 状态只能改变一次
            if (_this.status !== 'pending') return
            _this.status = 'rejected'
            _this.data = result

            // 执行所有失败的回调函数
            if (_this.waitCallbackList.length !== 0) {
                _this.waitCallbackList.forEach(function(item) {
                    item.rejected(result)
                })
            }
        }

        // 第三种：出现异常或抛出错误可以改变 p1 的状态, 如果捕获错误->try...catch

        try {
            executor(resolve, reject)
        } catch (error) {
            // 表示出错了 改变p1的状态为失败状态,结果为捕获到的错误信息
            reject(error)
        }
    }

    // then 方法用于指定Promise对象成功状态和失败状态的回调函数
    Promise.prototype.then = function (resolveCallback, rejectCallback) { // 异步执行的函数
        console.log('then 方法执行...');
        // 1. 判断状态 成功执行成功的回调 
        if (this.status === 'fulfilled') { // 成功
            setTimeout(resolveCallback, 2000)
            return
        }
        // 失败执行失败的回调
        if (this.status === 'rejected') {
            setTimeout(rejectCallback, 2000)
            return
        }
        
        // 2. 在 pending 需要做的事情：
        // 情况一：如果是先定义了回调函数, 在改变的状态, 那么此时的状态为 pending 就会进来, 那么我们如何知道成功或失败的回调函数执行完成返回的状态？
        // 将待执行的回调函数保存在一个数组中
        this.waitCallbackList.push({
            fulfilled: resolveCallback,
            rejected: rejectCallback
        })
    }

    Promise.prototype.catch = function () {
        console.log('catch 方法执行...');
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