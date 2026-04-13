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
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>{t.ignore}</Text>
            <Text style={footerText}>{t.secure}</Text>
            <Text style={footerText}>{t.copyright}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#f7f9ff",
  fontFamily:
    'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "56px 40px",
  maxWidth: "560px",
  borderRadius: "24px",
  boxShadow: "0 8px 32px -2px rgba(24, 28, 32, 0.05)",
};

const heading: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "800",
  textAlign: "center" as const,
  color: "#005147",
  margin: "0 0 40px",
  letterSpacing: "-0.02em",
};

const section: React.CSSProperties = {
  padding: "0",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#181c20",
  marginBottom: "16px",
};

const label: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#5a6b7a",
  margin: "32px 0 12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  textAlign: "center" as const,
};

const otpContainer: React.CSSProperties = {
  backgroundColor: "#f1f4fa",
  borderRadius: "16px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "0 0 32px",
};

const otpCode: React.CSSProperties = {
  fontSize: "40px",
  fontWeight: "800",
  letterSpacing: "0.4em",
  color: "#005147",
  margin: "0",
  fontFamily: "monospace",
};

const hr: React.CSSProperties = {
  borderTop: "1px solid #e5e8ee",
  margin: "0 0 32px",
};

const footer: React.CSSProperties = {
  marginTop: "40px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#94a3b8",
  textAlign: "center" as const,
  margin: "4px 0",
};
