/*
 * Date: 20/08/2026
 * Name: Penglei Fan - Bella
 *
 * File Path: src/components/content/AuthPage.tsx
 * Function: Registers customers and signs them in with an email address or phone number
 */

import { FormEvent, useMemo, useState } from "react";
import { api, clearSession, saveSession } from "../../services/api";
import type { AuthResponse, RegistrationResponse } from "../../types/models";

function isRegisterRoute() {
  return window.location.hash.includes("memberregistration");
}

// Renders the real account form used by all registration and sign-in routes
export function AuthPage() {
  const registering = useMemo(isRegisterRoute, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      if (registering) {
        clearSession();
        const result = await api.post<RegistrationResponse>("/auth/register", {
          name,
          email,
          phone,
          password,
        });
        setMessage(
          `${result.user.name}, your account is ready. Please sign in to order`,
        );
      } else {
        const result = await api.post<AuthResponse>("/auth/login", {
          identifier,
          password,
        });
        saveSession(result);
        location.hash = "#/";
      }
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not complete your request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Food Journal</p>
        <h1 id="auth-title">
          {registering ? "Create your account" : "Sign in"}
        </h1>
        <p className="muted">
          {registering
            ? "Use both an email address and phone number to keep your account reachable"
            : "Sign in with the email address or phone number linked to your account"}
        </p>
        <div className="auth-switch" aria-label="Authentication navigation">
          <button
            className={!registering ? "auth-switch-active" : ""}
            onClick={() => (location.hash = "#/screen/142-signin")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={registering ? "auth-switch-active" : ""}
            onClick={() =>
              (location.hash = "#/screen/136-memberregistrationstepone")
            }
            type="button"
          >
            Register
          </button>
        </div>
        <form className="auth-form" onSubmit={(event) => void submit(event)}>
          {registering && (
            <label>
              Full name
              <input
                autoComplete="name"
                minLength={2}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          )}
          {registering ? (
            <>
              <label>
                Email address
                <input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label>
                Phone number
                <input
                  autoComplete="tel"
                  minLength={7}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  type="tel"
                  value={phone}
                />
              </label>
            </>
          ) : (
            <label>
              Email address or phone number
              <input
                autoComplete="username"
                onChange={(event) => setIdentifier(event.target.value)}
                required
                value={identifier}
              />
            </label>
          )}
          <label>
            Password
            <input
              autoComplete={registering ? "new-password" : "current-password"}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {registering && <p className="field-hint">Use 8 to 128 characters</p>}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="success" role="status">
              {message}
            </p>
          )}
          <button className="button" disabled={submitting} type="submit">
            {submitting
              ? "Please wait..."
              : registering
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
        {message && (
          <button
            className="back-link auth-continue"
            onClick={() =>
              (location.hash = registering ? "#/screen/142-signin" : "#/")
            }
            type="button"
          >
            {registering ? "Go to sign in →" : "Continue to menu →"}
          </button>
        )}
      </section>
    </main>
  );
}
