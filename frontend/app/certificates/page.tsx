"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, FileDown } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { PageShell } from "@/components/page-shell";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserCertificates, type CertificateRecord } from "@/lib/learning-store";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    setCertificates(getUserCertificates(user.id));
  }, [user?.id]);

  return (
    <ProtectedRoute>
      <PageShell className="space-y-6">
        <section className="rounded-3xl border border-border/70 bg-card/70 p-7">
          <p className="text-sm text-muted-foreground">Achievement Vault</p>
          <h1 className="font-heading text-4xl font-bold">My Certificates</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Every completed course generates a verifiable certificate with a unique
            ID and QR code.
          </p>
        </section>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No certificates yet. Complete a course to generate your first certificate.
              </p>
              <Button asChild className="mt-4">
                <Link href="/courses">Go to Courses</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2">
            {certificates.map((certificate) => (
              <Card key={certificate.id}>
                <CardHeader>
                  <CardTitle className="inline-flex items-center gap-2 text-xl">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    {certificate.courseName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Certificate ID:</span>{" "}
                    {certificate.id}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Completion Date:</span>{" "}
                    {certificate.completionDate}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button asChild>
                      <Link href={`/certificates/${certificate.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Certificate
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download as PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </PageShell>
    </ProtectedRoute>
  );
}

