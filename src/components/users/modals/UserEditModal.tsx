import React, { useState } from "react";
import { X, Save, AlertTriangle, User, Mail, Phone, Calendar } from "lucide-react";
import type { NobleUser, UserGender } from "../../../types/userManagement.types";
import { calculateAge } from "../../../data/userManagementDataService";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: NobleUser | null;
  onSave: (userId: string, updatedFields: Partial<NobleUser>, reason?: string) => void;
  existingUsers: NobleUser[];
}

interface UserEditFormProps {
  user: NobleUser;
  onClose: () => void;
  onSave: (userId: string, updatedFields: Partial<NobleUser>, reason?: string) => void;
  existingUsers: NobleUser[];
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  onClose,
  onSave,
  existingUsers,
}) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username.replace("@", ""));
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dateOfBirth);
  const [gender, setGender] = useState<UserGender>(user.gender);
  const [country, setCountry] = useState(user.country);
  const [city, setCity] = useState(user.city);
  const [language, setLanguage] = useState(user.preferredLanguage);
  const [reason, setReason] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(false);

  const handleFieldChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, val: T) => {
    setter(val);
    setIsDirty(true);
  };

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";

    if (!username.trim()) {
      errs.username = "Username is required";
    } else {
      const formatted = `@${username.trim().toLowerCase()}`;
      const duplicate = existingUsers.find(
        (u) => u.id !== user.id && u.username.toLowerCase() === formatted
      );
      if (duplicate) {
        errs.username = `Username "${formatted}" is already taken by ${duplicate.name}`;
      }
    }

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Invalid email format";
    }

    if (!phone.trim()) {
      errs.phone = "Phone number is required";
    }

    if (!dob) {
      errs.dob = "Date of birth is required";
    } else {
      const birth = new Date(dob);
      if (birth > new Date()) {
        errs.dob = "Birth date cannot be in the future";
      } else {
        const calculatedAge = calculateAge(dob);
        if (calculatedAge < 18) {
          errs.dob = "User must be at least 18 years of age";
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check if email or phone changed
    const emailChanged = email.trim() !== user.email;
    const phoneChanged = phone.trim() !== user.phone;

    if ((emailChanged || phoneChanged) && !showSensitiveWarning) {
      setShowSensitiveWarning(true);
      return;
    }

    const formattedUsername = `@${username.trim().toLowerCase()}`;
    const partial: Partial<NobleUser> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: formattedUsername,
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: dob,
      gender,
      country,
      city,
      preferredLanguage: language,
    };

    onSave(user.id, partial, reason.trim() || "Administrative user edit");
    onClose();
  };

  const calculatedAge = dob ? calculateAge(dob) : calculateAge(user.dateOfBirth);

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {showSensitiveWarning && (
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "rgba(181, 139, 66, 0.12)",
              border: "1px solid var(--accent-champagne)",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle size={18} color="var(--accent-champagne)" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-main)" }}>
                Sensitive Field Modification Warning
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                Modifying a user&apos;s email address or phone number affects account recovery. In production, this
                triggers a verification confirmation message to the original owner.
              </p>
            </div>
          </div>
        )}

        {/* Names */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleFieldChange(setFirstName, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${errors.firstName ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
            {errors.firstName && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{errors.firstName}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => handleFieldChange(setLastName, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${errors.lastName ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
            {errors.lastName && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{errors.lastName}</span>}
          </div>
        </div>

        {/* Username & Gender */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "9px", fontSize: "13px", color: "var(--text-muted)" }}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => handleFieldChange(setUsername, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 24px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.username ? "var(--status-danger)" : "var(--border)"}`,
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
            {errors.username && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{errors.username}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => handleFieldChange(setGender, e.target.value as UserGender)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Email & Phone */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "var(--text-muted)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => handleFieldChange(setEmail, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 30px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.email ? "var(--status-danger)" : "var(--border)"}`,
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
            {errors.email && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{errors.email}</span>}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Phone Number
            </label>
            <div style={{ position: "relative" }}>
              <Phone size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "var(--text-muted)" }} />
              <input
                type="text"
                value={phone}
                onChange={(e) => handleFieldChange(setPhone, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 30px",
                  borderRadius: "8px",
                  border: `1px solid ${errors.phone ? "var(--status-danger)" : "var(--border)"}`,
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                }}
              />
            </div>
            {errors.phone && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{errors.phone}</span>}
          </div>
        </div>

        {/* Date of birth */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Date of Birth
            </label>
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--primary)" }}>
              Calculated Age: {calculatedAge} years old
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <Calendar size={14} style={{ position: "absolute", left: "10px", top: "10px", color: "var(--text-muted)" }} />
            <input
              type="date"
              value={dob}
              onChange={(e) => handleFieldChange(setDob, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 30px",
                borderRadius: "8px",
                border: `1px solid ${errors.dob ? "var(--status-danger)" : "var(--border)"}`,
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>
          {errors.dob && <span style={{ fontSize: "11px", color: "var(--status-danger)" }}>{errors.dob}</span>}
        </div>

        {/* Location (Country & City) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => handleFieldChange(setCountry, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              City / Neighborhood
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => handleFieldChange(setCity, e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-main)",
                fontSize: "13px",
              }}
            />
          </div>
        </div>

        {/* Preferred Language */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
            Preferred App Language
          </label>
          <select
            value={language}
            onChange={(e) => handleFieldChange(setLanguage, e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "13px",
            }}
          >
            <option value="English (United Kingdom)">English (United Kingdom)</option>
            <option value="English (United States)">English (United States)</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
            <option value="Igbo">Igbo</option>
            <option value="Yoruba">Yoruba</option>
            <option value="Hausa">Hausa</option>
            <option value="Chinese">Chinese</option>
            <option value="Arabic">Arabic</option>
          </select>
        </div>

        {/* Admin Reason for Edit */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
            Reason for Modification (Audit Log)
          </label>
          <input
            type="text"
            placeholder="e.g. Corrected typo in legal name upon user support request #894"
            value={reason}
            onChange={(e) => handleFieldChange(setReason, e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              fontSize: "13px",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
          backgroundColor: "var(--bg-surface)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {isDirty && (
            <span style={{ fontSize: "11px", color: "var(--accent-champagne)", fontWeight: 600 }}>
              Unsaved changes detected
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "transparent",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--primary)",
              color: "#FFFFFF",
              border: "none",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Save size={14} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  existingUsers,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-elevated)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "rgba(193, 47, 102, 0.08)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                Edit Account Information
              </h3>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                ID: {user.id} ({user.name})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form component keyed by user id so initial state is fresh without useEffect */}
        <UserEditForm
          key={user.id}
          user={user}
          onClose={onClose}
          onSave={onSave}
          existingUsers={existingUsers}
        />
      </div>
    </div>
  );
};
