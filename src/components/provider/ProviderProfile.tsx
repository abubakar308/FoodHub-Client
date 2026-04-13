"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Phone,
  FileText,
  UtensilsCrossed,
  Clock3,
  Truck,
  ImageIcon,
  Save,
  Loader2,
  Pencil,
  CheckCircle2,
  Store,
} from "lucide-react";
import {
  createProvider,
  getProfile,
  updateProvider,
} from "@/services/provider";

type ProviderProfile = {
  id?: string;
  restaurantName?: string;
  restaurantLogo?: string | null;
  bannerImage?: string | null;
  address?: string;
  phone?: string;
  description?: string | null;
  cuisineType?: string | null;
  openingTime?: string | null;
  closingTime?: string | null;
  deliveryArea?: string | null;
  isApproved?: boolean;
  averageRating?: number;
  totalReviews?: number;
};

const initialForm = {
  restaurantName: "",
  address: "",
  phone: "",
  description: "",
  cuisineType: "",
  openingTime: "",
  closingTime: "",
  deliveryArea: "",
};

export default function ProviderProfileManager() {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [formData, setFormData] = useState(initialForm);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!provider?.id;

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setPageLoading(true);

        const res = await getProfile();
        const data = res?.data ?? res?.data?.data ?? null;

        if (data?.id) {
          setProvider(data);
          setFormData({
            restaurantName: data.restaurantName || "",
            address: data.address || "",
            phone: data.phone || "",
            description: data.description || "",
            cuisineType: data.cuisineType || "",
            openingTime: data.openingTime || "",
            closingTime: data.closingTime || "",
            deliveryArea: data.deliveryArea || "",
          });
          setLogoPreview(data.restaurantLogo || "");
          setBannerPreview(data.bannerImage || "");
        } else {
          setProvider(null);
          setFormData(initialForm);
          setLogoPreview("");
          setBannerPreview("");
        }
      } catch {
        setProvider(null);
      } finally {
        setPageLoading(false);
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    if (!logoFile) return;
    const url = URL.createObjectURL(logoFile);
    setLogoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  useEffect(() => {
    if (!bannerFile) return;
    const url = URL.createObjectURL(bannerFile);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const approvalBadge = useMemo(() => {
    if (!provider) return null;

    if (provider.isApproved) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approved
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
        Pending Approval
      </span>
    );
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("restaurantName", formData.restaurantName.trim());
      payload.append("address", formData.address.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("description", formData.description.trim());
      payload.append("cuisineType", formData.cuisineType.trim());
      payload.append("openingTime", formData.openingTime.trim());
      payload.append("closingTime", formData.closingTime.trim());
      payload.append("deliveryArea", formData.deliveryArea.trim());

      if (logoFile) payload.append("restaurantLogo", logoFile);
      if (bannerFile) payload.append("bannerImage", bannerFile);

      const res = isEditMode
        ? await updateProvider(payload)
        : await createProvider(payload);

      const updated = res?.data ?? res?.data?.data ?? null;

      if (!updated?.id) {
        toast.error(
          isEditMode
            ? "Failed to update provider profile"
            : "Failed to create provider profile"
        );
        return;
      }

      setProvider(updated);
      setLogoFile(null);
      setBannerFile(null);

      setFormData({
        restaurantName: updated.restaurantName || "",
        address: updated.address || "",
        phone: updated.phone || "",
        description: updated.description || "",
        cuisineType: updated.cuisineType || "",
        openingTime: updated.openingTime || "",
        closingTime: updated.closingTime || "",
        deliveryArea: updated.deliveryArea || "",
      });

      setLogoPreview(updated.restaurantLogo || "");
      setBannerPreview(updated.bannerImage || "");

      toast.success(
        isEditMode
          ? "Provider profile updated successfully"
          : "Provider profile created successfully"
      );
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Loading provider profile...
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-muted">
            {bannerPreview ? (
              <Image
                src={bannerPreview}
                alt="Restaurant banner"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="-mt-10 flex justify-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Restaurant logo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Store className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-extrabold text-foreground">
              {provider?.restaurantName || formData.restaurantName || "Create Provider Profile"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {provider?.cuisineType || formData.cuisineType || "Restaurant information and branding"}
            </p>

            <div className="mt-3">{approvalBadge}</div>
          </div>

          <div className="mt-6 space-y-4 rounded-2xl bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Address
                </p>
                <p className="text-sm font-medium text-foreground">
                  {provider?.address || formData.address || "Not added yet"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-foreground">
                  {provider?.phone || formData.phone || "Not added yet"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Hours
                </p>
                <p className="text-sm font-medium text-foreground">
                  {(provider?.openingTime || formData.openingTime || "N/A")} - {(provider?.closingTime || formData.closingTime || "N/A")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-slate-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Delivery Area
                </p>
                <p className="text-sm font-medium text-foreground">
                  {provider?.deliveryArea || formData.deliveryArea || "Not added yet"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <p className="text-xs text-slate-400">Avg Rating</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {provider?.averageRating ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3 text-center">
                <p className="text-xs text-slate-400">Reviews</p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {provider?.totalReviews ?? 0}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
                {isEditMode ? "Update Provider Profile" : "Create Provider Profile"}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add your restaurant details, branding, timing, and delivery information.
              </p>
            </div>

            {isEditMode && (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Pencil className="h-4 w-4" />
                Edit Mode
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Restaurant Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-foreground/80">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter restaurant address"
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Cuisine Type
              </label>
              <div className="relative">
                <UtensilsCrossed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                  placeholder="Bangladeshi, Fast Food, Thai..."
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Delivery Area
              </label>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleChange}
                  placeholder="Dhanmondi, Mirpur, Uttara..."
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Opening Time
              </label>
              <input
                type="text"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                placeholder="10:00 AM"
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Closing Time
              </label>
              <input
                type="text"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                placeholder="11:00 PM"
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-foreground/80">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write a short description about your restaurant..."
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Restaurant Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditMode ? "Update Profile" : "Create Profile"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}