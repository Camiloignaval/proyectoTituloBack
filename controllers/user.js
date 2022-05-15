const { pagoEfectivo, selectPagos, selectEstadoFinanciero, insertReserva, searchReservedHoursByDay, selectAforoByDay, getDaysOff, selectReserve, deletReserve } = require('../database/querys')
const moment = require('moment')
const dayjs = require('dayjs')

const cambioPalabraDia = (str) => {
  const pal = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const lower = pal.toLowerCase()
  return pal.charAt(0).toUpperCase() + lower.slice(1)
}

const ingresarPago = async (req, res) => {
  const body = req.body
  const fechaActual = moment().format('DD/MM/YYYY HH:mm')
  body.fecha = fechaActual
  try {
    await pagoEfectivo(Object.values(body))
    res.status(200).json({
      msg: 'Pago registrado con éxito',
      ok: true
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const traerPagos = async (req, res) => {
  const { id } = req.params

  try {
    const pagos = await selectPagos([id])
    const estado = await selectEstadoFinanciero([id])
    res.status(200).json({
      ok: true,
      msg: 'Pagos cargados con exito',
      data: { pagos, estado }
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const obtenerAforoPorDia = async (req, res) => {
  const { fecha } = req.params
  const dia = dayjs(fecha).format('dddd')
  const diaSinAcent = cambioPalabraDia(dia)
  try {
    const horasReservadas = await searchReservedHoursByDay([fecha])
    const aforoDia = await selectAforoByDay([diaSinAcent])
    const arrayDevolver = horasReservadas.map(a => ({ hora: a.hora.slice(0, 5), aforo: Number(aforoDia?.aforo) - Number(a.count) }))
    res.status(200).json({
      dataDia: aforoDia,
      response: arrayDevolver,
      msg: 'Hora reservada',
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const insertReserve = async (req, res) => {
  try {
    const response = await insertReserva(Object.values(req.body))
    res.status(200).json({
      response,
      msg: 'Hora reservada',
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const getDayOff = async (req, res) => {
  try {
    const response = await getDaysOff()
    res.status(200).json({
      response,
      ok: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}

const getReserve = async (req, res) => {
  const { id } = req.params
  try {
    const response = await selectReserve([id, dayjs().format('YYYY-MM-DD')])
    if (response) {
      res.status(200).json({
        response,
        ok: true
      })
    } else {
      res.status(200).json({
        ok: false
      })
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}
const deleteReserve = async (req, res) => {
  const { id } = req.body
  try {
    await deletReserve([id])
    res.status(200).json({
      ok: true,
      message: 'Eliminada con exito'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ha ocurrido un error',
      ok: false
    })
  }
}
module.exports = {
  deleteReserve,
  getReserve,
  getDayOff,
  ingresarPago,
  traerPagos,
  obtenerAforoPorDia,
  insertReserve
}
