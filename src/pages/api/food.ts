import { NextApiRequest, NextApiResponse } from 'next'
import createNewFood from '../../services/food'
import { Food } from '../../utils/types'

const foodApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case 'POST': {
        const food: Food = req.body

        const response = await createNewFood(food)

        return res.status(response.statusCode).json(response.message)
      }
      case 'GET': {

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

export default foodApi