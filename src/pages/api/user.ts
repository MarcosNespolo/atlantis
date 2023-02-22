import { NextApiRequest, NextApiResponse } from 'next'
import getToken from '../../services/getToken'
import { registerNewUser, getCurrentUser } from '../../services/user'
import { User } from '../../utils/types'

const userApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken(req)
    if(!token){}

    switch (req.method) {
      case 'POST': {
        const user: User = req.body

        const response = await registerNewUser(user)

        return res.status(response.statusCode).json(response.message)
      }
      case 'GET': {
        const response = await getCurrentUser(token)

        return res.status(response.statusCode).json(response.message)
      }
      case 'PUT': {

      }
      case 'DELETE': {

      }
      default: {
        return res.status(400).json("Requisição HTTP inválida")
      }
    }
  } catch (error: any) {
    console.log(error)
    return res.status(error.statusCode).json({ error: error.message })
  }
}

export default userApi