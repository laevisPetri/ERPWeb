import { NextApiRequest, NextApiResponse } from "next"
import { QUERY_SALES } from "../../../../utils/querys";
import GQLQuery from "../../../../utils/serverFetcher";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return await GetSaleByDate(req, res);

        case 'DELETE':

            break;

        default:
            res.setHeader('Allow', ['GET', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const GetSaleByDate = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const apiResponse = await (await GQLQuery({
            query: QUERY_SALES,
            variables: {
                find: {
                    createdAt: req.query.id
                }
            }
        })).json();

        const data = JSON.parse(apiResponse.data);
        return res.status(apiResponse.successful ? 200 : 300).json({ message: apiResponse.message, data: data.ventas, successful: apiResponse.successful });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Error: ${err}`, successful: false });
    }
}

export default handler;