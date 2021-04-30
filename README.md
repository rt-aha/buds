REQUIRED:

- [x] 自動建立 repo
- [x] 自動拉 repo
- [x] 選擇模板
- [x] 將模板合併至現有新 repo
- [x] 選擇要使用的libs
- [x] 修改package.json
- [x] git commitlint
- [x] 推上 repo
- [ ] jsconfig.json/tsconfig.json
- [x] .vscode setting
- [ ] babel.config.js
- [x] .prettier
- [x] stylelint
- [ ] .browserslintrc
- [ ] .editorconfig
- [ ] gitlab-ci.yml
- [ ] addon: a node server(進專案拉repo，然後移除該資料夾.git)
- [ ] 生成README.ME(動態生成，初始化專案有配置的內容)
- [ ] 寫commit規則文檔
- [ ] 寫文檔
## commit lint 進到專案後要做的事，看doc
https://github.com/conventional-changelog/commitlint

## stylelint
```
yarn add -D stylelint
yarn add -D stylelint-config-prettier
yarn add -D stylelint-config-sass-guidelines
yarn add -D stylelint-config-standard
yarn add -D stylelint-order
yarn add -D stylelint-scss
```
package.json script 下新增
`"fix:scss": "stylelint src/**/*.scss --syntax scss --fix"`


## 可能會遇到的問題

- lint 作為option
- 後續更新可能會遇到問題

