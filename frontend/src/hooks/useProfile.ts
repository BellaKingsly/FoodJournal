/*
 * Date: 29/08/2026
 * Name: Penglei Fan - Bella / Cole Zinda
 *
 * File Path: src/hooks/useProfile.ts
 * Function: Loads, edits, and persists the current customer profile
 */

import { useEffect, useState } from "react";
import { api, updateCurrentUser } from "../services/api";
import type { Profile } from "../types/models";

const emptyProfile: Profile = {
  id: 1,
  name: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  address: "",
  avatar: "",
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get<Profile>("/profile")
      .then(setProfile)
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Profile unavailable.",
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const updateField = (field: keyof Profile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const save = async () => {
    setIsSaving(true);
    setError("");
    try {
      const updatedProfile = await api.put<Profile>("/profile", profile);
      setProfile(updatedProfile);
      updateCurrentUser(updatedProfile);
      setSaved(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Profile update failed.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return { profile, isLoading, isSaving, error, saved, updateField, save };
}
