"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle2,
  Pencil,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getUser, ProfileData, updateUserProfile } from "@/services/user";

type FormState = {
  name: string;
  phone: string;
  address: string;
  bio: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    address: "",
    bio: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await getUser();

      if (!res.data) {
        router.push("/login");
        return;
      }

      setUser(res.data);
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        bio: res.data.bio || "",
      });
      setPreviewUrl(res.data.avatar || "");
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!selectedImage) return;

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user?.name]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (!user) return;

    setEditing(false);
    setSelectedImage(null);
    setPreviewUrl(user.avatar || "");
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phone", form.phone.trim());
      formData.append("address", form.address.trim());
      formData.append("bio", form.bio.trim());

      if (selectedImage) {
        formData.append("avatar", selectedImage);
      }

      const res = await updateUserProfile(formData);

      if (!res.success || !res.data) {
        toast.error(res.message || "Failed to update profile");
        return;
      }

      setUser(res.data);
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        bio: res.data.bio || "",
      });
      setPreviewUrl(res.data.avatar || "");
      setSelectedImage(null);
      setEditing(false);

      toast.success("Profile updated successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-green-600" />
          <p className="text-sm font-medium text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={user.name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-green-100"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700 ring-4 ring-green-100">
                  {initials}
                </div>
              )}

              {editing && (
                <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-green-600">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setSelectedImage(e.target.files?.[0] || null)
                    }
                  />
                </label>
              )}
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              {user.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {user.email}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                {user.role}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {user.status}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {user.authProvider}
              </span>
            </div>

            <div className="mt-6 w-full space-y-3 rounded-2xl bg-slate-50 p-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {user.phone || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Address
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {user.address || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Email Verification
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {user.isEmailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Profile Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your personal information and keep your profile updated.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-600"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!editing}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-green-500 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!editing}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-green-500 disabled:bg-slate-50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!editing}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-green-500 disabled:bg-slate-50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">Bio</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!editing}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-500 disabled:bg-slate-50"
                placeholder="Write something about yourself..."
              />
            </div>

            {editing && (
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {user.providerProfile && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-black text-slate-900">
                Provider Profile
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Restaurant-related information linked with your account.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Restaurant Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {user.providerProfile.restaurantName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Approval Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {user.providerProfile.isApproved ? "Approved" : "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Provider Phone
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {user.providerProfile.phone || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Delivery Area
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {user.providerProfile.deliveryArea || "N/A"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Provider Address
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {user.providerProfile.address || "N/A"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Description
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {user.providerProfile.description || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}