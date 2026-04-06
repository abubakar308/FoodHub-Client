import { getCart, addToCart } from "@/services/order";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getCart();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { mealId } = await req.json();
  const data = await addToCart(mealId);
  return NextResponse.json(data);
}
