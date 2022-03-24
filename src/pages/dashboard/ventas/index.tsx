import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';
import SalesPage from '../../../components/sidebar/Ventas/ventasTabs'
import DashboardLayout from '../../../layout';
import { Cliente } from '../../../tipos/Cliente';
import { Venta } from '../../../tipos/Venta';
import { FetchVentas } from '../../../utils/fetches';

const Ventas = () => {
    const [Ventas, setVentas] = useState<Venta[]>([]);
    const [Clientes,] = useState<Cliente[]>([]);

    useEffect(() => {
        const GetAllData = async () => {
            setVentas(await FetchVentas());
        }

        GetAllData();
    }, []);

    return (
        <Tab.Group as="div" className="flex flex-col w-full h-full pt-3">
            <Tab.List className="flex gap-2 h-10">
                <Tab
                    key={"Ventas"}
                    className={({ selected }) =>
                        classNames(
                            'w-1/4 h-full text-sm rounded-t-2xl border-t border-x',
                            'focus:outline-none ring-white ring-opacity-60',
                            selected
                                ? 'bg-white shadow-lg'
                                : 'bg-gray-200 hover:bg-blue-400 hover:text-white'
                        )
                    }
                >
                    {"Ventas"}
                </Tab>
                <Tab
                    key={"Reembolsos"}
                    className={({ selected }) =>
                        classNames(
                            'w-1/4 h-full text-sm rounded-t-2xl border-t border-x',
                            'focus:outline-none  ring-white ring-opacity-60',
                            selected
                                ? 'bg-white shadow-md'
                                : 'bg-gray-200 hover:bg-blue-400 hover:text-white'
                        )
                    }
                >
                    {"Reembolsos"}
                </Tab>
            </Tab.List>
            <Tab.Panels className="flex flex-col h-90v w-full pr-2">
                <Tab.Panel
                    key={"Ventas"}
                    className={classNames(
                        'pb-3 h-full w-full',
                        'focus:outline-none ring-white ring-opacity-60'
                    )}
                >
                    <SalesPage ventas={Ventas} clientes={Clientes} />
                </Tab.Panel>

                <Tab.Panel
                    key={"Reembolsos"}
                    className={classNames(
                        'bg-white rounded-2xl p-2 h-full w-full',
                        'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
                    )}
                >
                    Reembolsos Page
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group >
    );
}

Ventas.PageLayout = DashboardLayout;

export default Ventas;

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}