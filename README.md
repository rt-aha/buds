REQUIRED:

- [x] 自動建立 repo
- [x] 自動拉 repo
- [x] 選擇模板
- [x] 將模板合併至現有新 repo
- [x] 選擇要使用的 libs
- [x] 修改 package.json
- [x] git commitlint
- [x] 推上 repo
- [x] jsconfig.json/tsconfig.json
- [x] .vscode setting
- [x] .prettier
- [x] stylelint
- [x] .browserslintrc
- [x] .editorconfig
- [x] husky 安裝 和 commit lint 寫進 package
- [ ] version-stable
- [x] eslint pre-commit
- [x] gitlab-ci.yml
- [x] addon: a node server(進專案拉 repo，然後移除該資料夾.git)
- [ ] 生成 README.ME(動態生成，初始化專案有配置的內容)
- [ ] jsconfig.json/tsconfig.json(內容屬性還要在了解)
- [ ] 寫 commit 規則文檔
- [ ] 寫文檔

## commit lint 進到專案後要做的事，看 doc

https://github.com/conventional-changelog/commitlint

```
yarn add -D @commitlint/config-conventional @commitlint/cli
yarn add -D husky@6.0.0
yarn husky install
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

## stylelint

```
yarn add -D stylelint
yarn add -D stylelint-config-prettier
yarn add -D stylelint-config-sass-guidelines
yarn add -D stylelint-config-standard
yarn add -D stylelint-order
yarn add -D stylelint-scss
yarn add -D stylelint-no-unsupported-browser-features
```

package.json script 下新增
`"fix:css": "stylelint src/**/*.scss src/**/*.css --syntax scss --fix"`

## 可能會遇到的問題

- lint 作為 option
- 後續更新可能會遇到問題

t3
t2
