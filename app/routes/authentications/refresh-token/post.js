
/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
import{ verifyToken, generateToken } from '@helpers/jwt.helper'

const debug = console.log.bind(console);

module.exports = async (req, res) =>  {
  const refreshTokenFromClient = req.body.refreshToken;
  if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
    try {
      const decoded = await verifyToken(refreshTokenFromClient, refreshTokenSecret);
      const userFakeData = decoded.data;
      debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
      const accessToken = await generateToken(userFakeData, accessTokenSecret, accessTokenLife);
      return res.status(200).json({accessToken});
    } catch (error) {
      res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
};
