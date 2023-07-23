// 模块化
(function() {
    function Promise(executor) { // 执行器函数
        console.log('构造函数调用...');
        // 保存状态
        this.status = 'pending'
        // 保存数据
        this.data = undefined

        // 缓存 this
        var _this = this
        // 第一种：执行 resolve 函数可以改变 p1 的状态
        function resolve(result) {// 将 Promise 对象从 pending 改变为 fulfilled
            console.log('resolve 函数执行...');
            // Promise 状态只能改变一次
            if (_this.status !== 'pending') return
            _this.status = 'fulfilled'
            _this.data = result
        }

        // 第二种：执行reject 函数可以改变 p1 的状态
        function reject(result) {
            console.log('reject 函数执行...');
            // Promise 状态只能改变一次
            if (_this.status !== 'pending') return
            _this.status = 'rejected'
            _this.data = result
        }

        // 第三种：出现异常或抛出错误可以改变 p1 的状态, 如果捕获错误->try...catch

        try {
            executor(resolve, reject)
        } catch (error) {
            // 表示出错了 改变p1的状态为失败状态,结果为捕获到的错误信息
            reject(error)
        }
    }

    Promise.prototype.then = function() {
        console.log('then 方法执行...');
    }
    Promise.prototype.catch = function() {
        console.log('catch 方法执行...');
    }

    // 静态方法
    Promise.all = function() {
        console.log('all 方法执行...');
    }
    Promise.race = function() {
        console.log('race 方法执行...');
    }

    // 向全局暴露
    window.Promise = Promise
})()