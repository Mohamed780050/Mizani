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
            <Text style={fallbackText}>{t.fallback}</Text>
            <Link href={url} style={link}>
              {url}
            </Link>
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

const button: React.CSSProperties = {
  backgroundColor: "#0f172a",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "24px 0",
};

const fallbackText: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "16px 0 4px",
};

const link: React.CSSProperties = {
  fontSize: "14px",
  color: "#2563eb",
  wordBreak: "break-all" as const,
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
