import { NextRequest, NextResponse } from "next/server";

const MEGAPAY_KEY   = process.env.MEGAPAY_API_KEY!;
const MEGAPAY_EMAIL = process.env.MEGAPAY_EMAIL!;

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0")   && digits.length === 10) return "254" + digits.slice(1);
  if (digits.length === 9)                               return "254" + digits;
  return "";
}

export async function POST(req: NextRequest) {
  const { phone, amount, reference } = await req.json();

  const msisdn = normalizePhone(phone ?? "");
  if (!msisdn) {
    return NextResponse.json({ error: "Invalid Safaricom number" }, { status: 400 });
  }
  if (!amount || amount < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  let megaRes: Response;
  try {
    megaRes = await fetch("https://megapay.co.ke/backend/v1/initiatestk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key:   MEGAPAY_KEY,
        email:     MEGAPAY_EMAIL,
        amount:    String(amount),
        msisdn,
        reference: reference ?? "InnBucks Order",
      }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach payment gateway" }, { status: 502 });
  }

  const data = await megaRes.json();

  // MegaPay success signals: ResponseCode "0" or success "200"
  const ok = data.ResponseCode === "0" || data.success === "200" || data.success === 200;
  if (!ok) {
    return NextResponse.json(
      { error: data.message ?? "STK push failed — try again" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    stk_request_id: data.transaction_request_id,
    message: data.message,
  });
}
