## 介绍
这是一个统计 git 仓库贡献的工具；主要统计作者所贡献的行数；统计每个文件夹和文件的贡献占比，还有项目中文件类型的占比等。

## 使用方法

* 使用 npx 命令生成

```bash 
$ cd git-repository /* 进入需要统计的 git 仓库文件夹 */
$ npx visualize-commit
$ cd commit-analyze /* 打开文件夹的 index.html 文件即可 */
```

* 安装包到对应仓库

```bash
$ cd git-repository
$ npm install visualize-commit --save-dev 
```

or

```
$ yarn add visualize-commit --dev
```


在`package.json`加入对应的脚本：

```json
{
  "scripts": {
    "vsz": "vsz-commit"
  }
}
```

执行命令：

```bash
$ npm run vsz  /  yarn add vsz
$ cd commit-analyze /* 打开文件夹的 index.html 文件即可 */
```

## 依赖环境

* node > 8 (支持 async function) 建议安装最新稳定版 node 版本 

## 统计截图
文件类型
![author](https://i.loli.net/2019/07/18/5d30848a8ff7c74276.png)

文件数量
![filetype](https://i.loli.net/2019/07/18/5d30848ad1e0b50400.png)