import {isDev} from "@port-of-mars/shared/settings";

export function url(path: string) {
  return `${process.env.SERVER_URL_HTTP}${path}`
}
