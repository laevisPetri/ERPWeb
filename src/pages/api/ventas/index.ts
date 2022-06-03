import { NextApiRequest, NextApiResponse } from "next";
import { getJwtFromString } from "../../../hooks/jwt";
import { Cliente } from "../../../tipos/Cliente";
import { CustomerPaymentInformation } from "../../../tipos/CustomerPayment";
import { Empleado } from "../../../tipos/Empleado";
import { Producto } from "../../../tipos/Producto";
import { ADD_SALE, QUERY_SALES } from "../../../utils/querys";
import GQLQuery, { GQLMutate } from "../../../utils/serverFetcher";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                return await GetSales(req, res);

            case 'POST':
                return await AddSale(req, res);

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

const GetSales = async (req: NextApiRequest, res: NextApiResponse) => {
    const apiResponse = await (await GQLQuery(
        {
            query: QUERY_SALES,
            variables: {
                "limit": 3000,
            }
        }
    )).json();

    let data = JSON.parse(apiResponse.data).ventas;
    return res.status(apiResponse.successful ? 200 : 300).json({ message: apiResponse.message, data: data, successful: apiResponse.successful });
}

const AddSale = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const productosEnCarrito: Producto[] = req.body.productosEnCarrito;
        const pagoCliente: CustomerPaymentInformation = req.body.pagoCliente;
        const cliente: Cliente = req.body.cliente;
        const empleado: Empleado = req.body.empleado;
        const tpv = req.body.tpv;

        const apiResponse = await (await GQLMutate(
            {
                mutation: ADD_SALE,
                variables: {
                    "fields": {
                        "productos": productosEnCarrito,
                        "dineroEntregadoEfectivo": Number(pagoCliente.pagoEnEfectivo.toFixed(2)),
                        "dineroEntregadoTarjeta": Number(pagoCliente.pagoEnTarjeta.toFixed(2)),
                        "precioVentaTotalSinDto": Number(pagoCliente.precioTotalSinDto.toFixed(2)),
                        "precioVentaTotal": Number(pagoCliente.precioTotal.toFixed(2)),
                        "tipo": pagoCliente.tipo,
                        "cambio": Number(pagoCliente.cambio.toFixed(2)),
                        "cliente": cliente,
                        "vendidoPor": empleado,
                        "modificadoPor": empleado,
                        "descuentoEfectivo": Number(pagoCliente.dtoEfectivo.toFixed(2)) || 0,
                        "descuentoPorcentaje": Number(pagoCliente.dtoPorcentaje.toFixed(2)) || 0,
                        "tpv": tpv
                    }
                }
            }
        )).json();

        const data = JSON.parse(apiResponse.data);
        return res.status(apiResponse.successful ? 200 : 300).json({ data: apiResponse.data, message: apiResponse.message, successful: apiResponse.successful });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error: ${err}`, successful: false });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb',
        },
    },
}

export default handler;