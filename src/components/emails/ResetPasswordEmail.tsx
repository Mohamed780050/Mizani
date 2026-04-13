import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  otp: string;
  t: {
    projectName: string;
    title: string;
    greeting: string;
    greetingDefault: string;
    instruction: string;
    otpLabel: string;
    ignore: string;
    secure: string;
    copyright: string;
  };
}

export function ResetPasswordEmail({ otp, t }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{t.title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{t.projectName}</Heading>
          <Section style={section}>
            <Text style={text}>{t.greeting}</Text>
            <Text style={text}>{t.instruction}</Text>
            <Text style={label}>{t.otpLabel}</Text>
            <Section style={otpContainer}>
              <Text style={otpCode}>{otp}</Text>
            </Section>
          </Section>
          <Hr style={hr} />
          <Text style={footerText}>{t.ignore}</Text>
          <Text style={footerText}>{t.secure}</Text>
          <Text style={footerText}>{t.copyright}</Text>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#1a1a1a",
  margin: "0 0 30px",
};

const section: React.CSSProperties = {
  padding: "0 20px",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#3c4043",
};

const label: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "24px 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const otpContainer: React.CSSProperties = {
  backgroundColor: "#f1f5f9",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const otpCode: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "0.3em",
  color: "#0f172a",
  margin: "0",
  fontFamily: "monospace",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e7eb",
  margin: "30px 0 20px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
  margin: "4px 0",
};
