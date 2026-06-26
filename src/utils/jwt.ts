function base64UrlDecode(str) {
  // base64url -> base64
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4
  if (pad) {
    str += '='.repeat(4 - pad)
  }

  // 转成字节数组
  const binary = atob(str)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))

  // 用 TextDecoder 还原 UTF-8（避免中文乱码）
  return new TextDecoder().decode(bytes)
}

export function parseJWT(token) {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format')
  }

  const [encodedHeader, encodedPayload, signature] = parts

  // 1. 解析 Header
  const header = JSON.parse(base64UrlDecode(encodedHeader))

  // 2. 解析 Payload
  const payload = JSON.parse(base64UrlDecode(encodedPayload))

  return { header, payload, signature }
}
