import { NextApiRequest, NextApiResponse } from 'next'
import getToken from '../../services/getToken'
import { createNewSubstrateService, listSubstrateService } from '../../services/substrate'
import { getCurrentUser } from '../../services/user'
import { USER_ROLE } from '../../utils/constants'
import { Substrate } from '../../utils/types'

const substrateApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken(req)

    if (!token) {
      throw new Error("Sem permissão de acesso")
    }

    const currentUser = await getCurrentUser(token)

    if (!currentUser || currentUser.data.role_id == USER_ROLE.AQUARIST) {
      throw new Error("Sem permissão de acesso")
    }

    switch (req.method) {
      case 'POST': {
        const substrate: Substrate = req.body

        const response = await createNewSubstrateService(substrate)

        return res.status(response.statusCode).json(response.data)
      }
      case 'GET': {
        const response = await listSubstrateService()

        return res.status(response.statusCode).json(response.data)

      }
      case 'PUT': {

      }
      case 'DELETE': {

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

export default substrateApi