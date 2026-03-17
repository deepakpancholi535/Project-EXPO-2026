"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CertificatePreview } from "@/components/certificates/certificate-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { findCertificateById, type CertificateRecord } from "@/lib/learning-store";

export default function CertificateVerificationPage() {
  const params = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationUrl, setVerificationUrl] = useState("");

  useEffect(() => {
    if (!params.certificateId) return;
    const record = findCertificateById(params.certificateId);
    setCertificate(record);
    setLoading(false);
  }, [params.certificateId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVerificationUrl(window.location.href);
  }, []);

  const fallbackVerificationUrl = useMemo(
    () => `https://taclearn.local/certificates/${params.certificateId ?? ""}`,
    [params.certificateId]
  );

  if (loading) {
    return (
      <PageShell>
        <p className="text-muted-foreground">Loading certificate...</p>
      </PageShell>
    );
  }

  if (!certificate) {
    return (
      <PageShell className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <p className="inline-flex items-center gap-2 font-semibold text-red-600 dark:text-red-300">
              <ShieldCheck className="h-5 w-5" />
              Certificate not found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This certificate ID could not be verified in the current environment.
              Generate certificates from your account and open them from the same browser.
            </p>
            <Button asChild className="mt-4">
              <Link href="/certificates">Back to Certificates</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href="/certificates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Certificates
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Download className="mr-2 h-4 w-4" />
          Download Certificate
        </Button>
      </div>

      <CertificatePreview
        certificate={certificate}
        verificationUrl={verificationUrl || fallbackVerificationUrl}
      />
    </PageShell>
  );
}

