import { NextApiRequest, NextApiResponse } from 'next'
import { listAquariumsService, upsertAquariumService } from '../../services/aquarium'
import getToken from '../../services/getToken'
import { getCurrentUser } from '../../services/user'
import { Aquarium } from '../../utils/types'

const aquariumApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken(req)

    if (!token) {
      return res.status(403).json({ error: 'É necessário estar logado para salvar um aquário' })
    }

    const currentUser = await getCurrentUser(token)

    if (!currentUser) {
      return res.status(403).json({ error: 'É necessário estar logado para salvar um aquário' })
    }

    switch (req.method) {
      case 'POST': {
        const aquarium: Aquarium = req.body

        const response = await upsertAquariumService(aquarium, currentUser.data.user_id)

        return res.status(response.statusCode).json(response.data)
      }
      case 'GET': {
        const response = await listAquariumsService(currentUser.data.user_id)

        return res.status(response.statusCode).json(response.data)
      }
      default: {
        throw new Error("Requisição HTTP inválida")
      }
    }
  } catch (error: any) {
    console.log(error.message)
    return res.status(error.statusCode).json({ error: error.message })
  }
}

export default aquariumApi