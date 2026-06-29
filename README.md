# 耶输陀罗：莲华因缘

基于巴利语《Yasodharātherī-apadāna》的网页版剧情式语言学习游戏 MVP。

## 启动

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

生产构建：

```bash
npm run build
npm start
```

## 主要目录

```text
app/                    Next.js 页面、全局样式
components/             剧情播放器、题目、莲花进度等组件
context/                localStorage 进度状态
data/chapters.json      剧情、对话、题目、反馈和奖励
data/game-config.json   游戏标题与莲花瓣数量配置
lib/                    数据读取与进度默认值
public/images/          可替换的场景图和人物图
types/                  TypeScript 数据类型
```

## 替换图片

把正式素材放入 `public/images/`，并保持 JSON 中的路径一致。推荐：

- 背景图：1920x1080 或更宽的 JPG
- 人物图：透明背景 PNG
- 文件名：见 `public/images/README.md`

项目自带轻量 SVG 占位图。也可以加入 JPG/PNG，并在
`data/chapters.json` 中修改对应路径。图片加载失败时，页面仍会保留 CSS
渐变和纹理。

## 新增关卡

1. 在 `data/chapters.json` 追加一个 chapter。
2. `order` 递增，`id` 保持唯一；章节页会按排序后的位置自动显示连续章号。
3. 在 `scenes` 中添加剧情节点。
4. 用每个节点的 `nextScene` 指向下一节点；最后一个节点填 `null`。
5. 题目、提示、反馈和奖励都写在对应 scene 内。

播放器支持 `narration`、`dialogue`、`quiz`、`reward`、`offering`、`ending`、`completion` 七种节点。奖励节点可用稳定的 `rewardId` 防止重温时重复领取；题目可用 `explanation` 在答对后显示轻量解析。选择题选项使用稳定的 `{ id, text }`，以 `correctAnswerId` 判断答案，显示顺序由题目 id 确定性打乱。

`offering` 节点可通过 `interaction` 配置献花按钮、所需莲花瓣、供花图片与完成反馈，确认供养后仍使用普通的 `nextScene` 继续剧情。

`ending` 节点通过 `ending` 配置结尾静帧、虹彩莲花、结束文案与导航按钮；动画完成后会同时记录章节完成和 `hasSeenFinalEnding`，不会改变莲花瓣奖励。

## 莲花瓣总数

当前主线配置为 8 片莲花瓣：

```json
{
  "totalPetals": 8,
  "maxSupportedPetals": 8
}
```

新增后续奖励时，应同步调整配置上限，并确保全部 `lotusPetalsReward` 的合计与配置一致。莲花组件与进度存储目前支持最多 8 片。
