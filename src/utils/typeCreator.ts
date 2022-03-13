import { Cliente } from "../tipos/Cliente";
import { Empleado } from "../tipos/Empleado";
import { Producto } from "../tipos/Producto";
import { ProductoVendido } from "../tipos/ProductoVendido";
import { TPVType } from "../tipos/TPV";
import { Venta } from "../tipos/Venta";

function CreateProduct(p: any): Producto | undefined {
    try {
        if (p.nombre === undefined) return undefined;

        let producto = {
            _id: p._id,
            alta: p.alta,
            cantidad: p.cantidad | 0,
            descripcion: p.descripcion ? p.descripcion : "",
            ean: p.ean,
            familia: p.familia,
            img: p.img,
            iva: p.iva,
            nombre: p.nombre,
            precioCompra: p.precioCompra,
            precioVenta: p.precioVenta,
            tags: p.tags,
            promociones: p.promociones
        } as unknown as Producto

        return producto;
    }
    catch (e) {
        return undefined;
    }
}

function CreateClient(c: any): Cliente | undefined {
    try {
        if (c.nif === undefined) return undefined;

        let client = {
            _id: c._id,
            nombre: c.nombre,
            nif: c.nif,
            calle: c.calle ? c.calle : "",
            cp: c.cp ? c.cp : "",
        } as Cliente

        return client;
    }
    catch (e) {
        return undefined;
    }
}

function CreateSale(s: any): Venta | undefined {
    try {
        let venta: Venta = {
            _id: s._id,
            productos: CreateProductoVendidoList(s.productos),
            dineroEntregadoEfectivo: s.dineroEntregadoEfectivo,
            dineroEntregadoTarjeta: s.dineroEntregadoTarjeta,
            precioVentaTotal: s.precioVentaTotal,
            cambio: s.cambio,
            cliente: CreateClient(s.cliente) || s.client,
            vendidoPor: CreateEmployee(s.vendidoPor),
            modificadoPor: CreateEmployee(s.modificadoPor),
            tipo: s.tipo,
            descuentoEfectivo: s.descuentoEfectivo || 0,
            descuentoPorcentaje: s.descuentoPorcentaje || 0,
            tpv: s.tpv,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
        }

        return venta;
    }
    catch (e) {
        return undefined;
    }
}

function CreateProductoVendido(s: any): ProductoVendido | undefined {
    try {
        let prod: ProductoVendido = {
            _id: s._id,
            nombre: s.nombre,
            familia: s.familia,
            proveedor: s.proveedor,
            ean: s.ean,
            iva: s.iva,
            margen: s.margen,
            precioCompra: s.precioCompra,
            precioVenta: s.precioVenta,
            cantidadVendida: Number(s.cantidadVendida),
            dto: s.dto || 0
        }
        return prod;
    }
    catch (e) {
        return undefined;
    }
}

export function CreateProductList(pList: any[]): Producto[] {
    let res: Producto[] = [];
    pList.forEach((p: any) => {
        const prod = CreateProduct(p);

        if (prod) res.push(prod);
    });

    return res;
}

export function CreateClientList(cList: any[]): Cliente[] {
    if (cList === undefined) { return []; }

    let res: Cliente[] = [];
    cList.forEach((c: any) => {
        const client = CreateClient(c);

        if (client) res.push(client);
    });

    return res;
}

export function CreateSalesList(sList: any[]): Venta[] {
    if (sList === undefined) { return [] as Venta[]; }

    let res: Venta[] = [];
    sList.forEach((c: any) => {
        const venta = CreateSale(c);

        if (venta) res.push(venta);
    });

    return res;
}

export function CreateProductoVendidoList(pList: any[]): ProductoVendido[] {
    let res: ProductoVendido[] = [];
    pList.forEach((p: any) => {
        const prod = CreateProductoVendido(p);

        if (prod) res.push(prod);
    });

    return res;
}

export function CreateEmployee(employee: any): Empleado {
    let res: Empleado = {
        _id: employee._id,
        nombre: employee.nombre,
        apellidos: employee.apellidos,
        email: employee.email,
        rol: employee.rol,
        dni: employee.dni || "",
        fechaAlta: employee.fechaAlta || "",
        genero: employee.genero || "",
        horasPorSemana: employee.horasPorSemana || -1
    }

    return res;
}

export function CreateTPV(tpv: any): TPVType {
    let res: TPVType = {
        _id: tpv._id,
        nombre: tpv.nombre,
        enUsoPor: tpv.enUsoPor,
        cajaInicial: tpv.cajaInicial,
        libre: tpv.libre,
        createdAt: tpv.createdAt,
        updatedAt: tpv.updatedAt
    }

    return res;
}