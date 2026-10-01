'use client';

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase-browser";

const MIN_PASSWORD_LENGTH = 8;

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    const checkSession = async () => {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError && active) {
          setError("This invitation link is invalid or has expired. Ask an administrator to send a new invitation.");
          setCheckingSession(false);
          return;
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;

      if (sessionError || !data.session) {
        setError("This invitation link is invalid or has expired. Ask an administrator to send a new invitation.");
      } else {
        setSessionReady(true);
      }
      setCheckingSession(false);
    };

    void checkSession();

    return () => {
      active = false;
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setConfirmError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="grid min-h-[100dvh] bg-canvas lg:grid-cols-[0.9fr_1.1fr]">
      <section className="editorial-grid hidden border-r border-line p-10 lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="font-display text-2xl tracking-[-0.03em] text-ink">
          Aarti <span className="italic">Trading</span>
        </Link>
        <div className="max-w-xl pb-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-muted">Account setup</p>
          <p className="mt-5 font-display text-6xl leading-[0.98] tracking-[-0.045em] text-ink">
            Your catalogue access starts here.
          </p>
        </div>
        <p className="text-xs text-muted">Aarti Trading / Catalogue administration</p>
      </section>

      <section className="flex min-h-[100dvh] items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-xl tracking-[-0.03em] text-ink lg:hidden">
            Aarti <span className="italic">Trading</span>
          </Link>

          <div className="mt-16 lg:mt-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">Accept invitation</p>
            <h1 className="mt-3 font-display text-5xl tracking-[-0.04em] text-ink">Create password</h1>
            <p className="mt-4 text-sm leading-6 text-muted">Choose a password for your catalogue administrator account.</p>
          </div>

          <form onSubmit={submit} className="mt-10 space-y-6" aria-busy={submitting}>
            <Input
              required
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              disabled={!sessionReady || submitting}
            />
            <Input
              required
              id="confirm-password"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (confirmError) setConfirmError("");
              }}
              placeholder="Enter the password again"
              error={confirmError}
              disabled={!sessionReady || submitting}
            />

            {error && (
              <p role="alert" className="rounded-md border border-[#e6c8c6] bg-[#fdebec] px-4 py-3 text-sm leading-5 text-[#8a3c39]">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={!sessionReady || checkingSession || submitting}>
              {checkingSession ? "Checking invitation…" : submitting ? "Creating password…" : "Create password"}
            </Button>
          </form>

          <Link href="/admin/login" className="mt-8 inline-flex min-h-11 items-center text-sm text-muted transition hover:text-ink">
            Already have a password? Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
