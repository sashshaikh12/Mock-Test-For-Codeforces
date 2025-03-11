import jwt from 'jsonwebtoken';

const userAuth = async(req, res, next) => {

  const {token} = req.cookies;

  if(!token)
  {
    return res.status(401).json({message: "Unauthorized"});
  }
  try{
    
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if(tokenDecode.id){
      req.body.userId = tokenDecode.id; 
    }
    else
    {
      return res.status(403).json({message: "unable to authenticate"});
    }

    next();

  }catch(error){
    res.json({message: error.message});
  }
};

export default userAuth;