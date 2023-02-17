import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAuth } from '../../../supabaseClient'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  if (req.method != 'POST')
    return res.status(401).json({ error: 'Invalid Request' })

  const { u, p, e } = req.body

  console.log(u, p, e)

  if (!e)
    return res.status(401).json({ error: 'Invalid Request' })

  try {
    let event = e.toString()

    if (event === 'signin') {
      if (!u || !p)
        return res.status(401).json({ error: 'Invalid Request' })

      let email = u.toString()
      let password = p.toString()

      const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password })

      console.log(data, error)

      if (error) {
        console.log('errors', error)
        if (error.message === 'Invalid email or password')
          return res.status(401).json({ error: 'Usuário ou senha incorretos' })
        else if (error.message === 'Invalid login credentials')
          return res.status(401).json({ error: 'Usuário ou senha inválidos' })
        else if (error.message === 'Email not confirmed')
          return res.status(401).json({ error: 'Endereço de email ainda não foi confirmado. Verifique a sua caixa de emails ou a caixa de SPAM' })
        else
          return res.status(401).json({ error: 'Oops... erro ao logar' })
      }

      const info = {
        data: data,
        error: null
      }

      return res.status(200).json(info)
    } else if (event == 'signout') {
      supabaseAuth.auth.signOut()

      return res.status(200).json({})
    } else if (event === 'recover') {
      if (!u) return res.status(401).json({ error: 'Invalid Request' })
      let email = u.toString()

      const { data, error } = await supabaseAuth.auth.resetPasswordForEmail(email)

      if (error) {
        console.log('errors', error)
        return res.status(401).json({ error: error.message })
      }
      const info = {
        user: data,
        error: null
      }

      return res.status(200).json(info)
    } else if (event === 'reset') {
      if (!p)
        return res.status(401).json({ error: 'Invalid Request' })

      let email = u.toString()
      let password = p.toString()

      const { data: loggedUser, error: userError } = await supabaseAuth.auth.signInWithPassword({ email, password })

      if (userError) return res.status(401).json({ error: userError.message })

      const { data, error } = await supabaseAuth.auth.updateUser({email})

      if (error) {
        console.log('errors', error)
        return res.status(401).json({ error: error.message })
      }
      const info = {
        user: data,
        error: null
      }

      return res.status(200).json(info)

    }
  } catch (error: any) {
    console.log('Error thrown:', error.error_description || error.message)
    return res.status(401).json({ error: 'Invalid Request' })
  }

}
