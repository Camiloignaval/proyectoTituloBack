const jwt = require("jsonwebtoken");
const moment = require("moment");
const { buscarUsuarioPorRutdeClientes, mesesActivo, montoTotalPagadoPorUser, updateEstadoFinanciero } = require("../database/querys");

const validarEstadoFinanciero = async(req,res,next) => {
    const token = req.header("x-token");
    const { rut } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const datos=await buscarUsuarioPorRutdeClientes([rut])
    const {id_usuario,id_cargo}=datos[0]
    if(id_cargo==3){
        console.log('analize finanza de usuario')
        //  seleccionar fecha aceptado
	const {fecha_aceptado}= await mesesActivo([id_usuario])
    // calculando cuandos meses lleva activo
        const fechaAcept= moment(fecha_aceptado)
        const fechaHoy=moment()
        const diff=fechaHoy.diff(fechaAcept,'month')
        const {sum,valor_mensualidad}= await montoTotalPagadoPorUser([id_usuario])
        const deberiaLlevarPagado=valor_mensualidad*diff
        console.log(deberiaLlevarPagado, 'lleva',sum)
    // si lleva pagado mas de lo que deberia
        if(parseInt(sum)>=deberiaLlevarPagado){
            console.log('lleva mas')
            await updateEstadoFinanciero([id_usuario,true])
        }else{
            console.log('lleva menos')
            await updateEstadoFinanciero([id_usuario,false])
        }
    }else{
        console.log('es admin no se hace nada')
    }

    next()
	
}

module.exports={
    validarEstadoFinanciero
}