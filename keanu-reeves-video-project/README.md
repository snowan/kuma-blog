# 🎬 基努·里维斯高燃动作短视频项目

## 项目概述

使用 **media-downloader** 技能下载基努·里维斯的经典电影片段，并使用 **remotion-best-practices** 剪辑成一个高燃的动作短视频。

## 📁 项目结构

```
keanu-reeves-video-project/
├── source-clips/                    # 下载的原始视频片段
│   ├── clip1_johnwick3_knives.mp4   # John Wick 3 飞刀场景
│   ├── clip2_johnwick2_museum.mp4   # John Wick 2 博物馆打斗
│   ├── clip3_johnwick2_cassian.mp4  # John Wick 2 vs Cassian
│   ├── clip4_matrix_theone.mp4      # Matrix - The One
│   └── clip5_matrix_smithclones.mp4 # Matrix - Smith 克隆人
├── keanu-action-video/              # Remotion 项目
│   ├── src/
│   │   ├── KeanuAction/
│   │   │   └── KeanuActionVideo.tsx # 主视频组件
│   │   ├── Root.tsx                 # 组合配置
│   │   └── index.ts
│   ├── public/videos/               # 视频素材
│   └── output/
│       └── keanu_action_reeves.mp4  # 最终输出视频
└── README.md
```

## 🎥 视频特效

### 开场动画
- 🔥 火焰渐变文字 "KEANU REEVES"
- ✨ 脉动发光效果
- 📝 动画字幕 "Action Legend"

### 视频片段
| 片段 | 来源 | 时长 | 名言 |
|------|------|------|------|
| 1 | John Wick 3 | 20s | "Be excellent to each other." |
| 2 | John Wick 2 | 20s | "I know kung fu." |
| 3 | John Wick 2 | 20s | "Yeah... I'm thinking I'm back." |
| 4 | The Matrix | 20s | "I once saw him kill three men... with a pencil." |
| 5 | The Matrix Reloaded | 20s | "Wake up, Neo..." |

### 转场效果
- 🌊 Wipe 擦除转场
- 📱 Slide 滑动转场  
- 🌫️ Fade 淡入淡出
- ⚡ 闪光效果

### 后期处理
- 🎚️ 暗角效果 (Vignette)
- 🔍 动态缩放
- 🎵 音频混音 (30% 音量)

## 📊 输出规格

| 版本 | 分辨率 | 帧率 | 时长 |
|------|--------|------|------|
| KeanuActionVideo | 1920x1080 | 30fps | ~17秒 |
| KeanuActionPreview | 1280x720 | 30fps | ~8.5秒 |
| KeanuActionVertical | 1080x1920 | 30fps | ~17秒 |

## 🛠️ 使用的技术

- **media-downloader**: YouTube 视频下载和剪辑
- **Remotion**: React 视频编辑框架
- **@remotion/media**: 视频/音频处理
- **@remotion/transitions**: 转场效果
- **yt-dlp**: YouTube 下载工具
- **ffmpeg**: 视频处理工具

## 📖 使用方法

### 预览视频
```bash
cd keanu-action-video
npm run dev
# 打开 http://localhost:3001
```

### 渲染视频
```bash
# 标准 1080p
npx remotion render KeanuActionVideo --output=output/keanu.mp4

# 竖屏版本 (社交媒体)
npx remotion render KeanuActionVertical --output=output/keanu_vertical.mp4
```

## 🎨 设计理念

1. **高燃节奏**: 每个片段 3 秒，快速切换保持紧张感
2. **标志性场景**: 选取 John Wick 和 Matrix 最经典的动作场面
3. **名言配字**: 每个片段配上基努·里维斯的标志性台词
4. **专业后期**: 暗角、动态缩放、精致转场

## ⚠️ 版权声明

本项目仅用于学习和演示目的。视频素材来自 YouTube 公开内容，版权归原权利人所有。

---

🎬 *Made with Remotion & ❤️*
