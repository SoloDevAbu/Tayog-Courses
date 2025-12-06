"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/validation";
import { useState, useEffect } from "react";
import { Edit2, X, Check } from "lucide-react";

// Helper function to get initials from name
function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function StudentProfile() {
  const { data: session, update: updateSession } = useSession();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  });

  // Update form when session changes
  useEffect(() => {
    if (session?.user?.name) {
      form.reset({
        name: session.user.name,
      });
    }
  }, [session?.user?.name, form]);

  const onSubmit = (data: UpdateProfileFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    // Check if name has actually changed
    const originalName = session?.user?.name || "";
    const newName = data.name.trim();
    
    if (newName === originalName) {
      setErrorMessage("No changes detected. Please modify the name before updating.");
      return;
    }

    updateProfile(data, {
      onSuccess: async (response) => {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        // Trigger session update to refresh token from database
        await updateSession();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosError = err as { response?: { data?: { error?: string } } };
          setErrorMessage(axiosError.response?.data?.error || 'An error occurred');
        } else {
          setErrorMessage('An error occurred while updating profile');
        }
      },
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (session?.user?.name) {
      form.reset({
        name: session.user.name,
      });
    }
  };

  // Check if form has changes
  const currentName = form.watch("name");
  const originalName = session?.user?.name || "";
  const hasChanges = currentName.trim() !== originalName;

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role === "TEACHER" ? "Teacher" : session?.user?.role === "STUDENT" ? "Student" : "";
  const userInitials = getInitials(session?.user?.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your account details and role information
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
        <CardContent className="space-y-6">
          {successMessage && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        {...form.register("name")}
                        disabled={isPending}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isPending || !hasChanges}
                        className="h-9 w-9"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleCancel}
                        disabled={isPending}
                        className="h-9 w-9"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">{userName}</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                  <p className="text-sm text-muted-foreground mt-1">{userRole}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

