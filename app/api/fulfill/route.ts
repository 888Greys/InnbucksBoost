import { NextRequest, NextResponse } from "next/server";

const MTP_API_KEY = process.env.MTP_API_KEY!;
const MTP_URL     = "https://morethanpanel.com/api/v2";

export async function POST(req: NextRequest) {
  const { service_id, quantity, link } = await req.json();

  if (!service_id || !quantity || !link) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const body = new URLSearchParams({
    key:      MTP_API_KEY,
    action:   "add",
    service:  String(service_id),
    link:     link,
    quantity: String(quantity),
  });

  let mtpRes: Response;
  try {
    mtpRes = await fetch(MTP_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    body.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach fulfillment panel" }, { status: 502 });
  }

  const data = await mtpRes.json();

  // MTP returns { order: <id> } on success, { error: "..." } on failure
  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 502 });
  }

  return NextResponse.json({ order_id: data.order });
}
