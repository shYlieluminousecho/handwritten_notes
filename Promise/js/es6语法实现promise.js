const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    // 定义私有属性
    #state = PENDING;
    #result = 'undefined';
    #handles = []

    constructor(executor) {// 执行器函数

        const resolve = (res) => { // 成功回调, 改变 promise 的状态
            this.#changeState(FULFILLED, res)
        }

        const reject = (res) => {// 失败的回调, 改变 promise 的状态
            this.#changeState(REJECTED, res)
        }

        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    // 改变状态
    #changeState(type, res) {
        if (this.#getPromiseState()) return
        this.#state = type
        this.#result = res
        this.#run()
    }

    // 用来执行 pending 时保存的任务队列
    #run() {
        this.#handles.forEach(item => {
            typeof item[this.#state] === 'function' && item[this.#state](this.#result)
        })
    }

    // 获取 Promise 的状态
    #getPromiseState(status = PENDING) {
        return this.#state === status
    }

    // 处理成功和失败的回调
    #handleCallback(cb, resolve, reject) {
        try {
            // 判断回调函数的返回值
            // 如果是非promise对象, 则返回成功 值为返回的值
            // 如果是 promise 则会跟随该 promise 的状态和结果
            typeof cb === 'function' ? cb : cb = () => this.#result
            const result = cb(this.#result)
            if (result instanceof Promise) {
                result.then(resolve, reject)
            } else {
                this.#getPromiseState(FULFILLED) ? resolve(result) : reject(result)
            }
        } catch (error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            if (this.#getPromiseState()) {
                this.#handleCallback(this.#getPromiseState(FULFILLED) ? onFulfilled : onRejected, resolve, reject)
                return
            }
            this.#handles.push({
                [FULFILLED]() {
                    this.#handleCallback(onFulfilled, resolve, reject)
                },
                [REJECTED]() {
                    this.#handleCallback(onRejected, resolve, reject)
                }
            })
        })
    }
}