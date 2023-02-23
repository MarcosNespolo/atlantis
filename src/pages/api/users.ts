import { NextApiRequest, NextApiResponse } from 'next'
import getToken from '../../services/getToken'
import { getCurrentUser, listUsers } from '../../services/user'
import { USER_ROLE } from '../../utils/constants'

const usersApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken(req)

    if (!token) {
      throw new Error("Sem permissão de acesso")
    }

    const currentUser = await getCurrentUser(token)

    if (!currentUser || currentUser.data.role_id != USER_ROLE.ADMINISTRATOR) {
      throw new Error("Sem permissão de acesso")
    }

    switch (req.method) {
      case 'GET': {
        const response = await listUsers()

        return res.status(response.statusCode).json(response.data)
      }
      default: {
        throw new Error("Requisição HTTP inválida")
      }
    }
  } catch (error: any) {
    console.log(error)
    return res.status(error.statusCode).json({ error: error.data })
  }
}

export default usersApi