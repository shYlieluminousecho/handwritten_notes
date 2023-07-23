(function () {
    const PENDING = 'pending'
    const FULFILLED = 'fulfilled'
    const REJECTED = 'rejected'

    class MyPromise {
        constructor(executor) {
            this.status = PENDING // 保存状态
            this.data = undefined // 保存结果
            this.tasks = [] // 任务队列
            var _this = this
            function resolve(result) {
                _this.changeState(FULFILLED, result)
                _this.runTasks()
            }
            function reject(result) {
                _this.changeState(REJECTED, result)
                _this.runTasks()
            }
            try {
                executor(resolve, reject)
            } catch (error) {
                reject(error)
            }
        }
        // 改变状态
        changeState(state, result) {
            if (this.status !== PENDING) return
            this.status = state
            this.data = result
        }
        // 执行异步任务
        runTasks() {
            this.tasks.forEach(task => {
                if (this.status === FULFILLED) {
                    task[FULFILLED](this.data)
                } else {
                    task[REJECTED](this.data)
                }
            })
        }

        // 处理回调
        handleCallback(promise, cb, resolve, reject) {
            try {
                setTimeout(() => {
                    const result = cb(this.data)
                    // 判断是否是循环引用
                    if (result === promise) {
                        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
                    }
                    if (result instanceof MyPromise) {
                        // 判断返回值的类型
                        result.then(resolve, reject)
                    } else {
                        resolve(result)
                    }
                }, 0)
            } catch (error) {
                reject(error)
            }
        }

        // then 方法
        then(onFulfilled, onRejected) {
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : result => result
            onRejected = typeof onRejected === 'function' ? onRejected : result => result
            const promise = new MyPromise((resolve, reject) => {
                if (this.status === PENDING) {
                    // 保存状态 then 可以多次调用
                    setTimeout(() => {
                        this.tasks.push({
                            [FULFILLED]: () => {
                                this.handleCallback(promise, onFulfilled, resolve, reject)
                            },
                            [REJECTED]: () => {
                                this.handleCallback(promise, onRejected, resolve, reject)
                            }
                        })
                    }, 0)
                    return
                }
                setTimeout(() => {
                    this.handleCallback(
                        promise,
                        this.status === FULFILLED ? onFulfilled : onRejected,
                        resolve,
                        reject
                    )
                }, 0)

            })
            return promise
        }
    }

    window.MyPromise = MyPromise
})()