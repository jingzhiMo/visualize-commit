## 介绍
这是一个统计 git 仓库贡献的工具；主要统计作者所贡献的行数；统计每个文件夹和文件的贡献占比，还有项目中文件类型的占比等。具体如下：

1. 统计每个文件夹下成员的贡献占比
2. 统计每个文件夹下不同文件的占比
3. 统计成员commit的数量与每个commit平均更改行数
4. 统计成员贡献的文件类型占比
5. 统计成员commit的提交信息词云分析

## 使用方法

* 使用 npx 命令生成（推荐）

```bash
$ cd git-repository /* 进入需要统计的 git 仓库文件夹 */
$ npx visualize-commit
```

* 安装包到对应仓库

```bash
$ cd git-repository
$ npm install visualize-commit --save-dev
# or
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
$ npm run vsz
# or
$ yarn add vsz
```

## 依赖环境

* node > 8 (支持 async function) 建议安装最新稳定版 node 版本
* npx (建议安装，通常 npm 5.2.0 版本之后会自动安装)
* git

## 统计截图
下面的统计截图是对[`create-react-app`仓库](https://github.com/facebook/create-react-app)的`v3.3.0`版本统计的demo

* 统计每个文件夹下成员的贡献占比
![vsz-1.png](https://i.loli.net/2020/04/16/GvIqZgNJBsuAUy9.png)

* 统计每个文件夹下不同文件的占比
![vsz-2.png](https://i.loli.net/2020/04/16/N71aEZRvFm85uA3.png)

* 统计成员commit的数量与每个commit平均更改行数
![vsz-3.png](https://i.loli.net/2020/04/16/l2y6HX8SzwtEJO3.png)

* 统计成员贡献的文件类型占比
![vsz-4.png](https://i.loli.net/2020/04/16/oGiWFhc457CbAdV.png)

* 统计成员commit的提交信息词云分析
![vsz-5.png](https://i.loli.net/2020/04/16/UerDEdBCoI6Qsbk.png)
