import { NextApiRequest, NextApiResponse } from 'next'
import getToken from '../../services/getToken'
import { registerNewUser, getCurrentUser,updateUser } from '../../services/user'
import { USER_ROLE } from '../../utils/constants'
import { User } from '../../utils/types'

const userApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken(req)

    if (!token) {
      throw new Error("Sem permissão de acesso")
    }
    const currentUser = await getCurrentUser(token)

    switch (req.method) {
      case 'POST': {
        if (!currentUser || currentUser.data.role_id != USER_ROLE.ADMINISTRATOR) {
          throw new Error("Sem permissão de acesso")
        }
        const user: User = req.body

        const response = await registerNewUser(user)

        return res.status(response.statusCode).json(response.data)
      }
      case 'GET': {
        const user_id: string = req.body
        let response

        if (user_id) {
          response = currentUser
        } else {
          response = await getCurrentUser(token)
        }

        return res.status(response.statusCode).json(response.data)
      }
      case 'PUT': {
        if (!currentUser || currentUser.data.role_id != USER_ROLE.ADMINISTRATOR) {
          throw new Error("Sem permissão de acesso")
        }
        const user: User = req.body

        const response = await updateUser(user)

        return res.status(response.statusCode).json(response.data)
      }
      case 'DELETE': {
        if (!currentUser || currentUser.data.role_id != USER_ROLE.ADMINISTRATOR) {
          throw new Error("Sem permissão de acesso")
        }

      }
      default: {
        throw new Error("Requisição HTTP inválida")
      }
    }
  } catch (error: any) {
    console.log(error)
    return res.status(error.statusCode).json({ error: error.message })
  }
}

export default userApi