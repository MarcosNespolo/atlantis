import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAuth } from '../../../supabaseClient'
import { REQUEST_TYPE } from '../../utils/constants'
import { destroyCookie } from 'nookies'
import { getCurrentUser, registerNewUser } from '../../services/user'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  if (req.method != 'POST')
    return res.status(401).json({ error: 'Invalid Request 1' })

  const { email, password, event, name } = req.body

  if (!event)
    return res.status(401).json({ error: 'Invalid Request 2' })

  try {
    if (event === REQUEST_TYPE.SIGN_IN) {
      if (!email || !password)
        return res.status(401).json({ error: 'Invalid Request 3' })

      const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password })

      console.log(data, error)

      if (error) {
        if (error.message === 'Invalid email or password')
          return res.status(401).json({ error: 'Usuário ou senha incorretos' })
        else if (error.message === 'Invalid login credentials')
          return res.status(401).json({ error: 'Usuário ou senha inválidos' })
        else if (error.message === 'Email not confirmed')
          return res.status(401).json({ error: 'Endereço de email ainda não foi confirmado. Verifique a sua caixa de emails ou a caixa de SPAM' })
        else
          return res.status(401).json({ error: 'Oops... erro ao logar' })
      }

      if (!data?.session?.access_token) {
        return res.status(401).json({ error: 'Oops... erro ao logar' })
      }


      const user = await getCurrentUser(data?.session?.access_token)

      const response = {
        user: user.data,
        token: data?.session?.access_token,
        error: null
      }

      return res.status(200).json(response)
    }
    if (event === REQUEST_TYPE.SIGN_UP) {
      if (!email || !password) return res.status(401).json({ error: 'Invalid Request' })

      let { data, error } = await supabaseAuth.auth.signUp({
        email: email,
        password: password
      })
      if (error) {
        console.log('errors', error)
        return res.status(401).json({ error: error.message })
      }

      const user = await registerNewUser({name, email})

      const response = {
        user: user.data,
        token: data?.session?.access_token,
        error: null
      }

      return res.status(200).json(response)
    } else if (event == REQUEST_TYPE.SIGN_OUT) {
      await supabaseAuth.auth.signOut()
      destroyCookie(undefined, 'atlantis_token', {
          path: "/",
      })
      return res.status(200).json({})
    }
  } catch (error: any) {
    console.log('Error thrown:', error.error_description || error.message)
    return res.status(401).json({ error: 'Invalid Request' })
  }

}
