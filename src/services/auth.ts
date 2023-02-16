type SignInRequestData = {
  email: string
  password: string
}

export async function signOutRequest() {

  const auth = await fetch(`/api/auth`, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ t: 'signout' }),
  }).then((res) => {
    return res.json()
  }
  )

  if (auth.error) {
    console.log('error', auth.error)
    return {
      user: null,
      error: auth.error
    }
  }

  const event = 'SIGNED_OUT'
  const session = null

  const login = await fetch('/api/authorize', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event, session }),
  }).then((res) => {
    return res.json()
  }
  )

  return true
}



export async function signInRequest({email, password}: SignInRequestData) {
  try {

    const auth = await fetch(`/api/auth`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ email: email, password: password, t: 'signin' }),
    }).then((res) => {
      return res.json()
    }
    )

    if (auth.error) {
      console.log('error', auth.error)
      return {
        user: null,
        error: auth.error
      }
    }

    const event = 'SIGNED_IN'
    const session = auth.session

    const login = await fetch('/api/authorize', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    }).then((res) => {
      return res.json()
    }
    )

    const info = {
      user: {
        email: email
      },
      error: null
    }
    return info

  } catch (error) {
    console.log('Error thrown:', error)
    return {
      user: null,
      error: 'Error'
    }
  }
}

/*
export async function recoverUserInformation() {
  try {
    const session = supabase.auth.session()

    if (session) {

      const info = {
        user: {
          id: session.user.id,
          avatar_url: null,
          email: session.user.email
        },
        error: null
      }

      return info
    }
    return null

  } catch (error) {
    console.log('Error thrown:', error.error_description || error.message)
  }
}
  */
