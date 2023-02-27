import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabaseClient'
import getToken from '../../services/getToken'
import { getCurrentUser } from '../../services/user'

const fishApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = await getToken(req)

    if (!token) {
      throw new Error("Sem permissão de acesso")
    }

    const currentUser = await getCurrentUser(token)

    if (!currentUser) {
      throw new Error("Sem permissão de acesso")
    }

    switch (req.method) {
      case 'POST': {
        const { file, name, bucket } = req.body
        console.log(name)
        const imageBlob = Buffer.from(file.split("base64,")[1], 'base64')

        const { data, error } = await supabase
          .storage
          .from(bucket)
          .upload('public/' + name, imageBlob, {
            cacheControl: '3600',
            upsert: false
          })

        console.log(data, error)

        if (error) {
          return res.status(500).json({ error: error })
        }

        return res.status(200).json({ message: data })
      }
      // case 'GET': {
      //   const response = await listFishesService()

      //   return res.status(response.statusCode).json(response.data)
      // }
      // case 'PUT': {
      //   const fish: Fish = req.body

      //   const response = await updateFishService(fish, currentUser.data.user_id)

      //   return res.status(response.statusCode).json(response.data)
      // }
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