import { NextApiRequest, NextApiResponse } from 'next'
import { createNewFishService, listFishesService, updateFishService } from '../../services/fish'
import getToken from '../../services/getToken'
import { getCurrentUser } from '../../services/user'
import { USER_ROLE } from '../../utils/constants'
import { Fish } from '../../utils/types'

const fishApi = async (req: NextApiRequest, res: NextApiResponse) => {
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
        const fish: Fish = req.body

        const response = await createNewFishService(fish, currentUser.data.user_id)

        return res.status(response.statusCode).json(response.data)
      }
      case 'GET': {
        const response = await listFishesService()

        return res.status(response.statusCode).json(response.data)
      }
      case 'PUT': {
        const fish: Fish = req.body

        const response = await updateFishService(fish, currentUser.data.user_id)

        return res.status(response.statusCode).json(response.data)
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

export default fishApi