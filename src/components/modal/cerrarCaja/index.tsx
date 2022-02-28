import { useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import useJwt from "../../../hooks/jwt";
import { TPV } from "../../../tipos/TPV";
import { Venta } from "../../../tipos/Venta";
import { FetchSalesByTPVDate, FetchTPV } from "../../../utils/fetches";
import { GetEfectivoTotal, GetTarjetaTotal, GetTotalEnCaja } from "../../../utils/preciosUtils";
import { ADD_CIERRE } from "../../../utils/querys";
import { ValidatePositiveFloatingNumber } from "../../../utils/validator";
import StatsCard from "../../dataDisplay/estadisticas";
import { Backdrop } from "../backdrop";

const In = {
    hidden: {
        scale: 0,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 15,
            stifness: 500
        }
    },
    exit: {
        y: "-100vh",
        opacity: 0,
        transition: {
            duration: 0.25,
        }
    }
}


export const CerrarCaja = (props: { setModalOpen: Function, setEmpleadoUsandoTPV: Function }) => {
    const jwt = useJwt();
    const [Ventas, setVentas] = useState<Venta[]>();
    const [Tpv, setTPV] = useState<TPV>();
    const [TotalEfectivo, setTotalEfectivo] = useState<string>();
    const [TotalTarjeta, setTotalTarjeta] = useState<string>();
    const [TotalPrevistoEnCaja, setTotalPrevistoEnCaja] = useState<string>();
    const [TotalRealEnCaja, setTotalRealEnCaja] = useState<string>("0");
    const [DineroRetirado, setDineroRetirado] = useState<string>("0");
    const [cerrarCaja, { loading, data, error }] = useMutation(ADD_CIERRE, {
        variables: {
            "cierre": {
                "tpv": jwt.TPV,
                "cajaInicial": Tpv?.cajaInicial,
                "abiertoPor": {
                    "_id": Tpv?.enUsoPor._id,
                    "nombre": Tpv?.enUsoPor.nombre,
                    "apellidos": Tpv?.enUsoPor.apellidos,
                    "rol": Tpv?.enUsoPor.rol,
                    "email": Tpv?.enUsoPor.email
                },
                "cerradoPor": {
                    "_id": jwt._id,
                    "nombre": jwt.nombre,
                    "apellidos": jwt.apellidos,
                    "rol": jwt.rol,
                    "email": jwt.email
                },
                "apertura": Tpv?.updatedAt,
                "ventasEfectivo": Number(TotalEfectivo),
                "ventasTarjeta": Number(TotalTarjeta),
                "ventasTotales": Number(TotalEfectivo) + Number(TotalTarjeta),
                "dineroRetirado": Number(DineroRetirado),
                "fondoDeCaja": Number(TotalRealEnCaja) - Number(DineroRetirado)
            }
        }
    });

    useEffect(() => {
        const GetVentas = async () => {
            const tpv = await FetchTPV(jwt.TPV);
            const ventas = await FetchSalesByTPVDate(jwt.TPV, tpv.updatedAt.toString());

            setVentas(ventas);
            setTPV(tpv);
            setTotalEfectivo(GetEfectivoTotal(ventas).toString());
            setTotalTarjeta(GetTarjetaTotal(ventas).toString());
            setTotalPrevistoEnCaja(GetTotalEnCaja(ventas, tpv).toString());
        }

        GetVentas();
    }, [])

    useEffect(() => {
        if (data && data.addCierreTPV.successful && !error && !loading) {
            Cookies.set("authorization", data.addCierreTPV.token)
            props.setModalOpen(false);
            props.setEmpleadoUsandoTPV(false);
        }
    }, [data]);

    if (!Ventas) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full w-full">
                <Backdrop onClick={(e) => { e.stopPropagation(); props.setModalOpen(false) }} >
                    <motion.div className="h-3/6 w-2/6 m-auto py-2 flex flex-col items-center justify-center bg-white rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                        variants={In}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Meter skeletons */}
                    </motion.div>
                </Backdrop>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full w-full ">
            <Backdrop onClick={(e) => { e.stopPropagation(); props.setModalOpen(false) }} >
                <motion.div className="h-3/6 w-3/6 flex flex-col items-center bg-white rounded-2xl p-4"
                    onClick={(e) => e.stopPropagation()}
                    variants={In}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex flex-col gap-4 h-full w-full rounded justify-center content-center">
                        <div className="text-lg text-center font-bold">
                            Ventana de cierre de TPV
                        </div>
                        <hr />
                        <div className="flex w-full h-full">
                            <div className="flex flex-col gap-2 xl:gap-4 w-full h-full">
                                <div className="flex gap-2">
                                    <p>Número de ventas: </p>
                                    <p>{Ventas.length}</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Ventas en efectivo: </p>
                                    <p>{Number(TotalEfectivo).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Ventas en tarjeta: </p>
                                    <p>{Number(TotalTarjeta).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Dinero total esperado en caja: </p>
                                    <p>{Number(TotalPrevistoEnCaja).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Dinero total real en caja: </p>
                                    <input className="rounded-lg border"
                                        onChange={(e) => { setTotalRealEnCaja(ValidatePositiveFloatingNumber(e.target.value)) }} value={TotalRealEnCaja} />
                                    €
                                </div>

                                <div className="flex gap-2">
                                    <p>Dinero retirado: </p>
                                    <input className="rounded-lg border"
                                        onChange={(e) => { setDineroRetirado(ValidatePositiveFloatingNumber(e.target.value)) }} value={DineroRetirado} />
                                    €
                                </div>

                            </div>

                        </div>

                        <div className="flex gap-4 h-auto w-full mb-auto text-white">
                            <div className="flex h-10 w-2/3 m-auto bg-red-500 hover:bg-red-600 rounded-2xl cursor-pointer items-center justify-center shadow-lg"
                                onClick={() => { props.setModalOpen(false) }}>
                                <div>
                                    Cancelar
                                </div>
                            </div>
                            <div className="flex h-10 w-2/3 m-auto bg-blue-500 hover:bg-blue-600 rounded-2xl cursor-pointer items-center justify-center shadow-lg"
                                onClick={() => { Number(TotalRealEnCaja) > 0 ? cerrarCaja() : undefined }}>
                                <div>
                                    Cerrar TPV
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Backdrop>
        </motion.div>
    );
}

export default CerrarCaja;