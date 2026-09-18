/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/components/content/ProfileForm.tsx
 * Function: Edits and saves the signed-in customer profile
 */

import { ActionButton } from "../ui/ActionButton";
import { useProfile } from "../../hooks/useProfile";

export function ProfileForm() {
  const { profile, isLoading, isSaving, error, saved, updateField, save } =
    useProfile();

  if (isLoading)
    return <div className="card data-state">Loading your profile...</div>;
  if (error && !profile.name)
    return <div className="card data-state error-state">{error}</div>;

  const chooseAvatar = (file?: File) => {
    if (!file || !file.type.startsWith("image/") || file.size > 1024 * 1024)
      return;
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      updateField("avatar", String(reader.result ?? "")),
    );
    reader.readAsDataURL(file);
  };

  return (
    <div className="card form-card profile-form">
      <div className="profile-avatar-editor">
        {profile.avatar ? (
          <img src={profile.avatar} alt="Your profile avatar" />
        ) : (
          <span>{profile.name.slice(0, 1).toUpperCase() || "?"}</span>
        )}
        <label className="avatar-upload">
          Change avatar
          <input
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => chooseAvatar(event.target.files?.[0])}
            type="file"
          />
        </label>
        <small>PNG, JPEG, or WebP up to 1 MB</small>
      </div>
      <label>
        Full name
        <input
          value={profile.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={profile.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>
      <label>
        Phone number
        <input
          type="tel"
          value={profile.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
      </label>
      <label>
        City
        <input
          value={profile.city}
          onChange={(event) => updateField("city", event.target.value)}
        />
      </label>
      <label>
        Country
        <input
          value={profile.country}
          onChange={(event) => updateField("country", event.target.value)}
        />
      </label>
      <label>
        Delivery address
        <input
          value={profile.address}
          onChange={(event) => updateField("address", event.target.value)}
        />
      </label>
      {error && <p className="error-state form-message">{error}</p>}
      {saved && (
        <p className="success form-message">Profile updated successfully.</p>
      )}
      <ActionButton
        label={isSaving ? "Saving..." : "Save changes"}
        disabled={isSaving}
        onClick={() => void save()}
      />
    </div>
  );
}
