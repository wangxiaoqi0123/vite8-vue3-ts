import { webUpdateNotice } from '@plugin-web-update-notification/vite'
export default function updateNotice() {
  return webUpdateNotice({ logVersion: true })
}
