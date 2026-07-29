import {
  Html, Head, Preview, Body, Container, Section, Text, Img, Button, Hr,
} from "@react-email/components";

interface BookingConfirmedProps {
  name: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  booking_location: string;
}

export default function BookingConfirmed({
  name, service_type, booking_date, booking_time, booking_location,
}: BookingConfirmedProps) {
  return (
    <Html>
      <Head />
      <Preview>Your appointment with Nails by Ronnie is confirmed!</Preview>
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: "20px 10px" }}>
          <Section style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}>
            <Section style={{
              background: "linear-gradient(135deg, #943F54, #D77A8B)",
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
                Appointment Confirmed!
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, marginTop: 8 }}>
                Hi {name}, your appointment is all set.
              </Text>
            </Section>

            <Section style={{ padding: "30px" }}>
              <Section style={{
                backgroundColor: "#FDF2F5",
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
              }}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: "#943F54", textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>
                  Appointment Details
                </Text>
                <DetailRow label="Service" value={service_type} />
                <DetailRow label="Date" value={booking_date} />
                <DetailRow label="Time" value={booking_time} />
                <DetailRow label="Location" value={booking_location || "Studio"} />
              </Section>

              <Text style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>
                We've saved a spot just for you. If you need to make any changes, you can manage your booking through your account.
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(148,63,84,0.1)" }}>
      <Text style={{ fontSize: 13, color: "#888", margin: 0 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: "bold", color: "#333", margin: 0 }}>{value}</Text>
    </Section>
  );
}
