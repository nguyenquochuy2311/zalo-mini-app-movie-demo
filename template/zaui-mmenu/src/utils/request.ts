import { generatePath, PathParam } from 'react-router-dom'
import { getAccessToken } from 'zmp-sdk'

import { API_URL } from '@/constants/common'
import { MerchantNotFoundError } from '@/constants/errors'

let token = ''
let expireAt = 0
export async function getCurrentAccessToken() {
  if (expireAt > Date.now() && token) {
    return token
  }
  token = await getAccessToken()
  expireAt = Date.now() + 1000 * 60 * 55 // Expired after 60m, we will refresh token after 55m
  return token
}

/**
 * Make a request to mMenu API.
 *
 * Notes: Do not explicitly pass in the generic type of Path, otherwise `options.params` types will have trouble infering.
 *
 * @param path string You can pass in params using colon sign. The actual value of the param can be passed in `options.params`. Document on how to pass params, @see https://reactrouter.com/utils/generate-path
 * @param options
 * @returns Use as at the end to tell the type of the response. Use @quicktype's Paste JSON as Code extension to automatically generate TypeScript types from the JSON responses.
 */
export async function request<Path extends string>(
  path: Path,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    params?: { [key in PathParam<Path>]: string | null }
    queries?: Record<string, string>
    headers?: Record<string, string>
    body?: object
    endpoint?: string
  },
): Promise<unknown> {
  let url = `${options?.endpoint ?? API_URL}${generatePath(path, options?.params)}`
  if (options?.queries) {
    const query = new URLSearchParams(options.queries)
    url = `${url}?${query.toString()}`
  }
  const body = options?.body ? JSON.stringify(options.body) : undefined
  const response = await fetch(url, {
    ...options,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!response.ok) {
    let errorMsg = response.statusText
    try {
      const errorData = await response.json()
      errorMsg = errorData.message
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errorMsg)
    }
  }
  const json = await response.json()
  if (json.error < 0) {
    if (json.message === 'Merchant not found') throw new MerchantNotFoundError()
    throw new Error(json.message)
  }
  return json
}
