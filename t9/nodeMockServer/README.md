# node

## 讓 node 可以使用 es6 module

[參考連結](https://medium.com/10coding/node-js-%E4%BD%BF%E7%94%A8-babel-%E5%81%9A-es6-%E9%96%8B%E7%99%BC-44b5b9e5f508)

1. `yarn add babel-cli babel-preset-env --dev`
2. 建立 **.babelrc** 檔案，內容寫

```
{
  "presets": [
    "env"
  ]
}
```

3. **package.json** 中 **script** 寫
   `npx babel-node src/index.js` 或
   `nodemon src/index.js --exec babel-node`
