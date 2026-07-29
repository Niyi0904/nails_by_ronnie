import {
  Html, Head, Preview, Body, Container, Section, Text, Img, Button, Hr,
} from "@react-email/components";

interface BookingCompletedProps {
  name: string;
  service_type: string;
}

export default function BookingCompleted({ name, service_type }: BookingCompletedProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for visiting Nails by Ronnie!</Preview>
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "20px 10px" }}>
          <Section style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}>
            <Section style={{
              background: "linear-gradient(135deg, #2D6A4F, #52B788)",
              padding: "40px 30px",
              textAlign: "center" as const,
            }}>
              <Img
                src="https://nails-by-ronnie.vercel.app/assets/logo-white.png"
                alt="Nails by Ronnie"
                width={140}
                style={{ margin: "0 auto 20px" }}
              />
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", margin: 0 }}>
                Thank You!
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 8 }}>
                Hi {name}, your {service_type} appointment is complete.
              </Text>
            </Section>

            <Section style={{ padding: "30px", textAlign: "center" as const }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 12 }}>
                We hope you loved your experience!
              </Text>
              <Text style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
                Thank you for choosing Nails by Ronnie. Your beautiful nails are ready to 
                shine! We'd love to hear your feedback — it helps us serve you better.
              </Text>

              <Button
                href="https://nails-by-ronnie.vercel.app/book"
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "#2D6A4F",
                  color: "#fff",
                  padding: "16px 0",
                  borderRadius: 12,
                  fontWeight: "bold",
                  fontSize: 16,
                  textDecoration: "none",
                  textAlign: "center" as const,
                  marginBottom: 12,
                }}
              >
                Book Your Next Appointment
              </Button>

              <Button
                href="https://nails-by-ronnie.vercel.app/my-bookings"
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "transparent",
                  color: "#2D6A4F",
                  padding: "14px 0",
                  borderRadius: 12,
                  fontWeight: "bold",
                  fontSize: 14,
                  textDecoration: "none",
                  textAlign: "center" as const,
                  border: "2px solid #2D6A4F",
                }}
              >
                View Appointment History
              </Button>
            </Section>

            <Hr style={{ borderColor: "#f0f0f0", margin: "0 30px" }} />

            <Section style={{ padding: "20px 30px 30px", textAlign: "center" as const }}>
              <Text style={{ fontSize: 12, color: "#999", margin: 0 }}>
                Nails by Ronnie — Beauty begins the moment you decide to be yourself.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
