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
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={user.name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/10"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-4 ring-primary/10">
                  {initials}
                </div>
              )}

              {editing && (
                <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition hover:bg-primary">
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

            <h1 className="mt-5 text-2xl font-black text-foreground">
              {user.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {user.email}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {user.role}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground border border-border">
                {user.status}
              </span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-500">
                {user.authProvider}
              </span>
            </div>

            <div className="mt-6 w-full space-y-3 rounded-2xl bg-muted/30 p-4 text-left border border-border/50">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Email
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {user.phone || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Address
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {user.address || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Email Verification
                  </p>
                  <p className="text-sm font-medium text-foreground/80">
                    {user.isEmailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-foreground">
                Profile Details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your personal information and keep your profile updated.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-bold text-background transition hover:bg-primary hover:text-primary-foreground"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">
                Full Name
              </label>
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  disabled={!editing}
                  className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary disabled:bg-muted/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/80">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!editing}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary disabled:bg-muted/50 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-foreground/80">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={!editing}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary disabled:bg-muted/50 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-foreground/80">Bio</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!editing}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:bg-muted/50 transition-all"
                placeholder="Write something about yourself..."
              />
            </div>

            {editing && (
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
            <div className="mt-8 rounded-3xl border border-border bg-muted/20 p-6">
              <h3 className="text-xl font-black text-foreground">
                Provider Profile
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Restaurant-related information linked with your account.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Restaurant Name
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {user.providerProfile.restaurantName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Approval Status
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {user.providerProfile.isApproved ? "Approved" : "Pending"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Provider Phone
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {user.providerProfile.phone || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Delivery Area
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {user.providerProfile.deliveryArea || "N/A"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Provider Address
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {user.providerProfile.address || "N/A"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground/60">
                    Description
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
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