import { getMealById, getRelatedMeals } from "@/services/meal";
import MealDetailsClient, { MealNotFound } from "./MealDetailsClient";

interface MealDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MealDetailsPage({
  params,
}: MealDetailsPageProps) {
  const { id } = await params;

  const res = await getMealById(id);
  const meal = res?.data?.data ?? res?.data ?? null;

  if (!meal) {
    return <MealNotFound />;
  }

  let relatedMeals: any[] = [];

  if (meal?.category?.id) {
    const relatedRes = await getRelatedMeals(meal.category.id, meal.id);
    relatedMeals = relatedRes?.data?.data || [];
  }

  return <MealDetailsClient meal={meal} relatedMeals={relatedMeals} />;
}