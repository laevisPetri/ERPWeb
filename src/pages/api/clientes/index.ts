import { gql } from "@apollo/client";
import { NextApiRequest, NextApiResponse } from "next";
import GQLFetcher from "../../../utils/serverFetcher";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // const session = await getSession({ req })
    // if (!session) {
    //     return res.status(401).json({ message: "Not signed in" });
    // }

    try {
        const reqCredentials = req.body;
        const fetchResult = await GQLFetcher.query(
            {
                query: gql`
                query Clientes($find: ClientesFind, $limit: Int) {
                    clientes(find: $find, limit: $limit) {
                        ${reqCredentials.neededValues.map((c: string) => { return c + ", " })}
                    }
                }
                `,
                variables: {
                    "find": {
                        "_ids": reqCredentials.find._ids,
                        "nombre": reqCredentials.find.nombre
                    },
                    "limit": reqCredentials.limit
                }
            }
        );

        if (fetchResult.data.success) {
            return res.status(200).json({ message: `Lista de clientes encontrada` });
        }

        return res.status(300).json({ message: `Fallo al pedir la lista de clientes` });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error: ${err}` });
    }
}

export default handler;