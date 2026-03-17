import Link from "next/link";
import { BadgeCheck, QrCode, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CertificateRecord } from "@/lib/learning-store";

interface CertificatePreviewProps {
  certificate: CertificateRecord;
  verificationUrl: string;
}

export const buildQrCodeUrl = (value: string): string =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(value)}`;

export const CertificatePreview = ({
  certificate,
  verificationUrl
}: CertificatePreviewProps) => {
  return (
    <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-white/85 via-cyan-50/65 to-blue-50/55 dark:from-card/90 dark:via-card/80 dark:to-card/70">
      <CardContent className="space-y-6 p-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            TAC Learn
          </p>
          <h1 className="mt-2 font-heading text-4xl font-bold">Certificate of Completion</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This certifies that the learner has successfully completed the course.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-border/70 bg-card/70 p-5 text-center">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Awarded To</p>
          <p className="font-heading text-3xl font-bold">{certificate.userName}</p>
          <p className="text-lg font-semibold text-primary">{certificate.courseName}</p>
          <p className="text-sm text-muted-foreground">
            Completion Date: {certificate.completionDate}
          </p>
        </div>

        <div className="grid items-center gap-5 rounded-2xl border border-border/70 bg-card/60 p-4 sm:grid-cols-[1fr_160px]">
          <div className="space-y-2 text-sm">
            <p className="inline-flex items-center gap-2 font-semibold">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Certificate ID: {certificate.id}
            </p>
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Verification Enabled
            </p>
            <Link href={verificationUrl} className="text-primary hover:underline">
              {verificationUrl}
            </Link>
          </div>
          <div className="mx-auto text-center">
            <p className="mb-2 inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              <QrCode className="h-3.5 w-3.5" />
              Verify
            </p>
            <img
              src={buildQrCodeUrl(verificationUrl)}
              alt={`QR code for certificate ${certificate.id}`}
              className="h-32 w-32 rounded-lg border border-border/70"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

