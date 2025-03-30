import jwt from 'jsonwebtoken';

const testAuth = async(req, res, next) => {

  const {testToken} = req.cookies;

  if(!testToken && req.method === "POST" && req.body.selectedTags && req.body.lowerBound) {
    // This is a new test setup - allow it to proceed without a token
    return next();
  }

  if(!testToken)
  {
    return res.status(401).json({message: "No ongoing Tests"});
  }
  try{
    
    const tokenDecode = jwt.verify(testToken, process.env.JWT_SECRET);

    if(tokenDecode.testId){
      req.body.testId = tokenDecode.testId;
    }
    else
    {
      return res.status(403).json({message: "unable to fetch questions from cookies"});
    }

    next();

  }catch(error){
    res.clearCookie('testToken');
    res.json({message: error.message});
  }
};

export default testAuth;