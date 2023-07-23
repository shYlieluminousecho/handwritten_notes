// 模块化
(function() {
    function Promise(executor) { // 执行器函数
        console.log('构造函数调用...');

        function resolve() {
            console.log('resolve 函数执行...');
        }

        function reject() {
            console.log('reject 函数执行...');
        }

        executor(resolve, reject)
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