import { NextApiRequest, NextApiResponse } from "next";
import getJwtFromString from "../../../hooks/jwt";
import { FetchTPV } from "../../../utils/fetches";
import { ADD_CIERRE, QUERY_CIERRES } from "../../../utils/querys";
import GQLFetcher from "../../../utils/serverFetcher";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                return await GetCierres(req, res);

            case 'POST':
                return await AddCierre(req, res);

            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error: ${err}` });
    }
}

const GetCierres = async (req: NextApiRequest, res: NextApiResponse) => {
    let fetchResult;

    fetchResult = await GQLFetcher.query({
        query: QUERY_CIERRES, variables: {
            "limit": 3000
        }
    });

    if (!fetchResult.error) {
        return res.status(200).json(fetchResult.data);
    }

    return res.status(300).json({ message: `Fallo al pedir la lista de cierres` });
}

const AddCierre = async (req: NextApiRequest, res: NextApiResponse) => {
    const Tpv = await FetchTPV(getJwtFromString(req.cookies.authorization).TPV);
    const Empleado = req.body.Empleado;
    const TotalEfectivo = req.body.TotalEfectivo;
    const TotalTarjeta = req.body.TotalTarjeta;
    const DineroRetirado = req.body.DineroRetirado;
    const TotalPrevistoEnCaja = req.body.TotalPrevistoEnCaja;
    const TotalRealEnCaja = req.body.TotalRealEnCaja;
    const Ventas = req.body.Ventas;

    const addCierreResult = await GQLFetcher.mutate({
        mutation: ADD_CIERRE,
        variables: {
            "cierre": {
                "tpv": Empleado?.TPV,
                "cajaInicial": Tpv?.cajaInicial,
                "abiertoPor": {
                    "_id": Tpv?.enUsoPor._id,
                    "nombre": Tpv?.enUsoPor.nombre,
                    "apellidos": Tpv?.enUsoPor.apellidos,
                    "rol": Tpv?.enUsoPor.rol,
                    "email": Tpv?.enUsoPor.email
                },
                "cerradoPor": {
                    "_id": Empleado?._id,
                    "nombre": Empleado?.nombre,
                    "apellidos": Empleado?.apellidos,
                    "rol": Empleado?.rol,
                    "email": Empleado?.email
                },
                "apertura": Tpv?.updatedAt,
                "ventasEfectivo": Number(TotalEfectivo),
                "ventasTarjeta": Number(TotalTarjeta),
                "ventasTotales": Number(TotalEfectivo) + Number(TotalTarjeta),
                "dineroRetirado": Number(DineroRetirado),
                "fondoDeCaja": Number(TotalRealEnCaja) - Number(DineroRetirado),
                "numVentas": Ventas?.length || 0,
                "dineroEsperadoEnCaja": Number(TotalPrevistoEnCaja),
                "dineroRealEnCaja": Number(TotalRealEnCaja)
            }
        }
    });

    if (addCierreResult.data.addCierreTPV.successful) {
        res.setHeader('Set-Cookie', `authorization=${addCierreResult.data.addCierreTPV.token}; HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`);
        res.status(200).json({ message: addCierreResult.data.addCierreTPV.message, successful: addCierreResult.data.addCierreTPV.successful });
        return;
    }

    res.status(300).json({ message: "No se ha podido añadir el cierre a la base de datos", successful: false });
}

export default handler;