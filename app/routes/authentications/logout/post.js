
export default async function(req, res){
  try {
    if(req.body.email){
      const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"]
     await destroyToken(req.user.id,tokenFromClient)
      return res.status(200).json('successfully')
    }
    else {
      return res.status(400).json({'status': false,'message':'error', 'data':''})
    
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}
export const destroyToken = async(userId,tokenFromClient)=>{ 
  const data=_.defaultsDeep({isActive:false},userToken)
  const tokenUser = await getTable('userToken').where('userId', '==', userId).where('tokenCode','==',tokenFromClient).update(data)
  return tokenUser
}