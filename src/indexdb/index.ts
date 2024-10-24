import Dexie, { type EntityTable } from "dexie"

import type { QuickLink, UserWallpaper } from "~types"

const db = new Dexie("UserData") as Dexie & {
  quickLinks: EntityTable<QuickLink, "id">
  wallpaper: EntityTable<UserWallpaper, "id">
}

db.version(1).stores({
  quickLinks: "++id, name, url, favicon, textColor, backgroundColor",
  wallpaper: "++id, name, imageBlob"
})

export { db }
