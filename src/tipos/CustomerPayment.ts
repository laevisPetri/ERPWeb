import { Cliente } from "./Cliente";

export type CustomerPaymentInformation = {
    cliente: Cliente,
    tipo: string,
    precioTotal: number,
    pagoEnEfectivo: number,
    pagoEnTarjeta: number,
    dtoEfectivo: number,
    dtoPorcentaje: number,
    cambio: number
}