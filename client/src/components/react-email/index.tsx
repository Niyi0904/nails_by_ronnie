

import {
  Html, Head, Preview, Body, Container, Section, Text, Img, Button, Hr,
} from "@react-email/components";

export default function BookingConfirmation({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your booking request with Nails by Ronnie</Preview>
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "20px 10px" }}>
          <Section style={{ backgroundColor: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <Section style={{ background: "linear-gradient(135deg, #943F54, #D77A8B)", padding: "40px 30px", textAlign: "center" as const }}>
              <Img src="https://nails-by-ronnie.vercel.app/assets/logo-white.png" alt="Nails by Ronnie" width={140} style={{ margin: "0 auto 20px" }} />
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold", margin: 0 }}>Booking Received!</Text>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 8 }}>
                Hi {name}, thanks for booking with us.
              </Text>
            </Section>
            <Section style={{ padding: "30px", textAlign: "center" as const }}>
              <Text style={{ fontSize: 16, color: "#444", lineHeight: 1.6, marginBottom: 24 }}>
                Your appointment request has been received. Ronnie will review it and send you a confirmation soon.
              </Text>
              <Button
                href="https://nails-by-ronnie.vercel.app/my-bookings"
                style={{
                  display: "block",
                  width: "100%",
                  backgroundColor: "#943F54",
                  color: "#fff",
                  padding: "16px 0",
                  borderRadius: 12,
                  fontWeight: "bold",
                  fontSize: 16,
                  textDecoration: "none",
                  textAlign: "center" as const,
                }}
              >
                View My Bookings
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
