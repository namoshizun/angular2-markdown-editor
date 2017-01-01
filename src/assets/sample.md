# ES6 - Notes

### **Destructor**:

*Based on pattern matching. Destructed target can be any **iteratable** object (object that has the iterator interface)*

* Left value must provide a pattern that is the ***subset***  of the right value pattern.

  * ```javascript
    let [a, [b, d]] = [1, [2,3], 4]  👍
    let [foo] = [] 👎
    ```

* Default value is allowed. If default value is an expression, it will be lazily evaluated, implying that it won't be used at all if the right value is specified.

  * ```javascript
    let [foo = true] = [];
    let [x = f()] = [1];  /* f() won't be called */
    ```

* Object Destruction: (Yes! how cool is that!)

  * ```javascript
    var { bar/* bbb */, foo /* aaa */ } = { foo: "aaa", bar: "bbb" };

    // 'aliasing' foo to baz (allowing acceptor be a different name from the target 😃)
    var { foo: baz /* aaa */ } = { foo: 'aaa', bar: 'bbb' };
    ```

* **Application**:

  * *Swap values*: 

    ```javascript
    [x, y] = [y, x] // lol! pythonic o.0
    ```

  * Function *argumentation and value output* with stronger semantics. 

  * *JSON parsing*

    ```javascript
    var jsonData = {
      id: 42,
      status: "OK",
      data: [867, 5309]
    };

    let { id, status, data: number } = jsonData;
    ```

### Function



### Object



### Proxy & Reflect

Proxy does the ***pre-processing*** work before the access or command is passed to the actual object.  It re-defines the behaviour of an object from the language level <== '***Meta-programming***'… 

```javascript
var proxy = new Proxy(target, handler)
/* Basic syntax of proxy. Handler contains the implementation details of overloaded methods. (get, set ... )
 */
```



**Proxy can be the prototype of other objects**

```javascript
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 42;
  }
});
let obj = Object.create(proxy);
obj.time // 42
```



| Proxy method                             | Method Agented                           |
| ---------------------------------------- | ---------------------------------------- |
| get(target, propKey, receiver)           | …                                        |
| set(target, propKey, value, receiver)    | …                                        |
| has(target, propKey)                     | propKey in target (NOT hasOwnProerty) |
| deleteProperty(target, propKey)          | delete proxy[propKey]                    |
| ownKeys(target)                          | Object.getOwnPropertyNames(proxy) & Object.keys(proxy) |
| getOwnPropertyDescriptor(target, propKey) | SAME                                     |
| defineProperty(target, propKey, propDesc) | SAME                                     |
| preventExtensions(target)                | SAME                                     |
| getPrototypeOf(target)                   | SAME                                     |
| setPrototypeOf(target, proto)            | SAME                                     |
| apply(target, thisArg, args)             | proxy(…args), proxy.call(obj, …args)     |
| construct(target, args)                  | new proxy(…args)                         |



**Be Mindful of THIS**

Inside proxy handlers, 'this' does not refer to the proxied object itself!😵 (which is somewhat apprent but worth mentioning)

```javascript
const target = {
  m: function () { console.log(this === proxy) }
};
const proxy = new Proxy(target, {});

target.m() // false
proxy.m()  // true 😱
```

Solution: bind 'this' to the target

```javascript
const target = {
  m: function () { console.log(this === proxy) }
};
const proxy = new Proxy(target, {
  get(target, prop) {
    if (prop === 'm') return target.m.bind(target);
    return Reflect.get(target, prop);
  }
});

target.m() // false
proxy.m()  // false 😀
```



**Applications**:

* Define custom array which allows negative indexing. [get]
* Object property validation. [set]
* Sync check (e.g, when clicks a DOM object, check it is up-to-date by requesting its newest sate from server) [get]
* Data stream transformation. [apply]
* Hide object property from being detected by 'in' or 'Object.keys()'. [has], [ownKeys]
* ***Implements Observer Pattern***

```javascript
const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```



### Asynchronous

Once upon a time, long long ago, people are tutored by async programming (they are still tho) …. And there are multiple tricks tested to make the this async programming a bit less painful. 

* Callback Function:
  * passes a function that ***consumes***  the result of callee function. 
  * can easily lead to the ***callback hell*** 😈
* Promie:
  * a very promising solution to serialise & flattens the async calls. 
  * but floods your code base with lots of Promise syntaxes. 
* Generator:
  * an interesting co-routine approach. Functions ***executions are made interchangeable***, so each async calls can be lined up together, each can handover the the result as well as execution to its consumer routine. 
  * poor semantics (w.t.f is next()) and complex routine management (in-and-out all the time). Other modules are needed to manage and automate routines (Thunkify, Co … ) 😣
* Event Listening:
* Publish & Subscribe

All the above are different ***PUSH&PULL*** implementations with their own significances and sucks, until **async/await** is brought to JS (in the future) …. 



**What is Async/Await?** It is just a super sweetie syntax sugar for generator 😊

**How do we Async/Await?**

```javascript
asyncFunc = async function() {  // return type: Promise<any>
  let result = await asyncCall(); 
  // far clearer semantic; built-in task runner; yay!!
}
```

**Exception Handling**

Catch by caller:

```javascript
// 1. async function throws
...() { throw new Error('Oouch!') }
// 2. await Promise rejects
...() { await Promise.reject('Oouch!') } // OR
...() { return await Promise.reject('Oouch!') }
```

Catch inside the routine

```javascript
...() {
  let result1 = asyncCall().catch(handler)
  let result2 = asyncCall2().catch(handler)
}
```

**Implementation**: [basically just wraps up the generator and its runner inside a function](http://es6.ruanyifeng.com/#docs/async#async函数)

### Decorator