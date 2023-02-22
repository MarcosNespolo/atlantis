import { REQUEST_TYPE } from "../utils/constants"

type SignInRequestData = {
  email: string
  password: string
  type: number
  name?: string
}

export async function signOutRequest() {

  const auth = await fetch(`/api/auth`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event: REQUEST_TYPE.SIGN_OUT }),
  }).then((res) => {
    return res.json()
  })

  if (auth.error) {
    console.log('error', auth.error)
    return {
      user: null,
      error: auth.error
    }
  }

  return true
}

type SignInRequestResponse = {
  user: string,
  error: string,
  token: string
}

export async function signInRequest({ email, password, type, name }: SignInRequestData) {
  try {
    const auth = await fetch(`/api/auth`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ email: email, password: password, event: type, name }),
    }).then((res) => {
      return res.json()
    })

    if (auth.error) {
      throw new Error(auth.error)
    }

    const response: SignInRequestResponse = {
      token: auth.token,
      user: auth.user,
      error: auth.error
    }
    return response

  } catch (error: any) {
    console.log('Error thrown:', error)
    return {
      token: null,
      user: null,
      error: error.message
    }
  }
}

export async function recoverUserInformation() {
  try {
    const user = await fetch(`/api/user`, {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin'
    }).then(async (res) => {
      if (res.status == 200) {
        return res.json()
      }
      throw new Error(await res.json())
    })

    return {
      user: user,
      error: null
    }

  } catch (error: any) {
    console.log('Error thrown:', error)
    return {
      user: null,
      error: error.message
    }
  }
}