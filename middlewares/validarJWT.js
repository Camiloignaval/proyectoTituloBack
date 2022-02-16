const { response } = require('express')
const jwt = require('jsonwebtoken')

const validarJWT = (req, res = response, next) => {
  // X-TOKEN headers

  const token = req.header('x-token')
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Ocurrió un problema, identifiquese nuevamente porfavor'
    })
  }

  try {
    const { uid, cid, rut } = jwt.verify(token, process.env.SECRET_JWT_SEED)
    req.uid = uid
    req.cid = cid
    req.rut = rut
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Su sesión ha expirado'
    })
  }

  next()
}

module.exports = {
  validarJWT
}
