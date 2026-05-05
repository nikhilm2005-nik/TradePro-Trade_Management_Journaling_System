const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Look for the token in the headers
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    // Verify token and extract the user's ID
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user ID to the request so our routes can use it!
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, invalid token' });
  }
};

module.exports = protect;