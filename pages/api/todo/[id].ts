import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    // update logic
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    // delete logic
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
