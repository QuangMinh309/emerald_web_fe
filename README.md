# Emerald Web FE

## Tech Stack

* Vite + React 18 + TypeScript
* Tailwind CSS v3
* React Router DOM v6
* Biome (linter + formatter + organize imports)
* Font: [Reem Kufi Fun](https://fonts.google.com/specimen/Reem+Kufi+Fun)

## Palette

| Tên        | Hex       |
| ---------- | --------- |
| Main       | `#244B35` |
| Secondary  | `#E09B6B` |
| Third      | `#EFEAE1` |
| Border     | `#D9D9D9` |
| Background | `#FFFFFF` |
| Text       | `#000000` |

## Cấu trúc thư mục

```
src/
├── assets/          → ảnh, icon, logo
├── components/      → component tái sử dụng
│   ├── ui/          → Button, Card, Input...
│   ├── layout/      → Header, Footer, Container
│   └── common/      → Loading, Error, EmptyState
├── hooks/           → custom hooks
├── pages/           → mỗi trang 1 folder
├── routes/          → cấu hình route + lazy load
├── services/        → API calls (axios)
├── store/           → Zustand / Context (sau này thêm)
├── styles/          → globals.css (Tailwind + font)
├── types/           → global types
├── utils/           → hàm thuần (cn.ts, format.ts...)
└── App.tsx + main.tsx
```

### Alias

| Alias         | Path             |
| ------------- | ---------------- |
| `@`           | `src/`           |
| `@pages`      | `src/pages`      |
| `@components` | `src/components` |
| `@hooks`      | `src/hooks`      |
| `@assets`     | `src/assets`     |
| `@utils`      | `src/utils`      |
| `@services`   | `src/services`   |
| `@store`      | `src/store`      |
| `@types`      | `src/types`      |
| `@styles`     | `src/styles`     |

**Ví dụ sử dụng:**

```ts
import Home from '@pages/Home';
import { Button } from '@components/ui/Button';
import logo from '@assets/images/logo.svg';
```

## Development

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build
```
