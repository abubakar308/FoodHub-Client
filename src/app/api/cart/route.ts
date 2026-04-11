import { getCart, addToCart } from "@/services/order";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getCart();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

export async function POST(req: Request) {
  const { mealId } = await req.json();
  const data = await addToCart(mealId);
  
  // Revalidate the home and cart pages to ensure fresh data
  revalidatePath("/");
  revalidatePath("/dashboard/cart");
  
  return NextResponse.json(data);
}
