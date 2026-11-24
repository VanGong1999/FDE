# Day 1 · 克隆 UnderCover 仓库、uv sync 与 .env

一句话总结：装好 Python/Jupyter 扩展 → 用 git clone 拉取 UnderCover 仓库 → 打开项目 → uv sync 建环境 → 写 .env 放 API key。

## 装 VS Code 扩展

- 视图菜单 → Extensions（Mac `Command+Shift+X`，PC `Ctrl+Shift+X`）。
- 搜 **Python**（Microsoft 出品，约 2.38 亿下载）→ 若显示 install 就安装。
- 搜 **Jupyter**（拼写 J-U-P-Y-T-E-R，Microsoft 出品，约 1 亿下载）→ 安装。
- 这两个扩展分别用于运行 Python 与 Jupyter notebook（按 cell 执行）。

## 克隆仓库

```bash
pwd            # 打印当前目录，确认在主目录
cd ~           # 回到主目录（~ 是 tilde，不是连字符）
mkdir projects # 若没有 projects 目录则创建
cd projects
git clone https://github.com/ed-donner/undercover
cd undercover
```

- 主目录：Mac `/Users/<用户名>`，PC `C:\Users\<用户名>`。
- `cd ..` 上移一级。
- `Undercover` 是课程项目代号（明天才揭晓是什么）。

## 打开项目（VS Code 里的「易错」步骤）

1. File 菜单 → **New Window**。
2. 点 **Open**（Mac）或 **Open Folder**（PC）。
3. 导航到 `projects` → **单击选中 undercover（不要双击）**。
4. 点 **Open**（Mac）或 **Select Folder**（PC）。
5. **关键校验**：左上角 explorer 顶部必须显示 **undercover**（而不是它的父目录），否则重来。

## uv sync 构建环境

```bash
uv sync
```

- 让 uv 用正确的 Python 包构建完整环境，会生成 **`.venv`** 文件夹（含全部依赖）。
- 项目指定 **Python 3.12.12**；若机器没装 Python，**uv 会在后台自动安装**。

## 创建 .env 文件（最易翻车的一步）

1. 在 explorer 空白处右键 → New File。
2. 文件名**必须精确**叫 **`.env`**（点 + env，三个字母，不能叫别的）。
3. 位置：项目根目录（undercover 顶层）。
4. 内容（唯一一个环境变量）：
   ```
   OPENROUTER_API_KEY=sk-or-v1xxxxxxxxxxxx
   ```
   - 拼写：`OPENROUTER_API_KEY`（Open Router 下划线 API 下划线 KEY，不是 "Open Rura"）。
   - key 直接来自 OpenRouter，**必须精确**（以 `sk-or-v1` 开头）。
   - **不要把 key 先粘到文字处理器**（会把连字符改成特殊 Unicode / 长破折号），必须从 OpenRouter 直粘到这里。

### 必须保存（最隐蔽的坑）
- 右上角出现**白色圆点 = 文件已改但未保存**。
- 按 `Ctrl+S`（PC）/ `Command+S`（Mac）或 File → Save，白点消失才算真正写盘。

## .env 的作用

- `.env` 是存放环境变量的特殊文件，由 `load_dotenv`（Python 程序）读入并设为项目环境变量。
- 本课程目前只有一个环境变量：OpenRouter API key。
