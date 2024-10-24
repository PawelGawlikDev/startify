export default function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}
