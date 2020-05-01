export function url(path: string) {
  // workaround to connect to localhost:2567 server endpoints
  return `${process.env.SERVER_URL_HTTP}${path}`
}
