import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailLinkVerificationProps {
  url: string;
  name: string;
  t: {
    projectName: string;
    title: string;
    greeting: string;
    greetingDefault: string;
    instruction: string;
    button: string;
    fallback: string;
    ignore: string;
    secure: string;
    copyright: string;
  };
}

export function EmailLinkVerification({
  url,
  name,
  t,
}: EmailLinkVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{t.title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>{t.projectName}</Heading>
          <Section style={section}>
            <Text style={text}>
              {t.greeting} {name || t.greetingDefault}
            </Text>
            <Text style={text}>{t.instruction}</Text>
            <Button style={button} href={url}>
              {t.button}
            </Button>
            <Hr style={hr} />
            <Text style={fallbackText}>{t.fallback}</Text>
            <Link href={url} style={link}>
              {url}
            </Link>
          </Section>
          <Section style={footer}>
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

const button: React.CSSProperties = {
  backgroundColor: "#005147",
  borderRadius: "16px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 32px",
  margin: "32px 0",
};

const fallbackText: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#5a6b7a",
  margin: "24px 0 8px",
};

const link: React.CSSProperties = {
  fontSize: "14px",
  color: "#005147",
  fontWeight: "600",
  wordBreak: "break-all" as const,
};

const hr: React.CSSProperties = {
  borderTop: "1px solid #e5e8ee",
  margin: "32px 0",
};

const footer: React.CSSProperties = {
  marginTop: "40px",
  paddingTop: "32px",
  borderTop: "1px solid #f1f4fa",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#94a3b8",
  textAlign: "center" as const,
  margin: "4px 0",
};
