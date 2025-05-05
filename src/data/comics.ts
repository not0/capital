import type { Comic } from "../types/comic";

export const comics: Comic[] = [
  {
    id: "1",
    title: "女子カバディ部",
    description: "なんか企画で描いたやつ。",
    thumbnailExt: "gif",
    updatedAt: new Date("2025-01-01T00:00:00+09:00"),
    episodes: [],
  },
  {
    id: "2",
    title: "南極伝説",
    description: "なんか北極伝説みたいな漫画に対抗して描いた記憶がある。",
    thumbnailExt: "png",
    updatedAt: new Date("2025-01-02T00:00:00+09:00"),
    episodes: [
      {
        number: 1,
        title: "第1話",
        thumbnailExt: "gif",
      },
      {
        number: 2,
        title: "第2話",
        thumbnailExt: "gif",
      }
    ]
  },
  {
    id: "10",
    title: "ノトデンジセカンドインプレッションで描いたやつ",
    description: "いつぞやのコミティアで出した",
    thumbnailExt: "png",
    updatedAt: new Date("2025-01-02T00:00:00+09:00"),
    episodes: [],
  },
  {
    id: "12",
    title: "超絶最強バトル漫画集",
    description: "マウス本でコミティアで出したやつ",
    thumbnailExt: "png",
    updatedAt: new Date("2025-01-03T00:00:00+09:00"),
    episodes: [],
  },
];
