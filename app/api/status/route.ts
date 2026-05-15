import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let megaRes: Response;
  try {
    megaRes = await fetch("https://megapay.co.ke/backend/v1/transactionstatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key:                process.env.MEGAPAY_API_KEY,
        email:                  process.env.MEGAPAY_EMAIL,
        transaction_request_id: id,
      }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach payment gateway" }, { status: 502 });
  }

  const data = await megaRes.json();
  return NextResponse.json(data);
}
