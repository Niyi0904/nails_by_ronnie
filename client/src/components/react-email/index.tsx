

// emails/BookingConfirmation.tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Button,
} from "@react-email/components";

export default function BookingConfirmation({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your booking with Nails by Ronnie</Preview>
      <Body style={{ backgroundColor: "#fafafa", fontFamily: "Arial" }}>
        <Container>
          <Section style={{ padding: "20px", backgroundColor: "#fff" }}>
            <Img src="/assets/logo-white.png" alt="Nails by Ronnie" width="120" />
            <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#d63384" }}>
              Hi {name}, thanks for booking with us 💅
            </Text>
            <Text style={{ fontSize: "16px", color: "#444" }}>
              Your appointment has been confirmed. We can’t wait to see you!
            </Text>
            <Button
              style={{
                backgroundColor: "#d63384",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
              href="https://nails-by-ronnie.vercel.app/my-bookings"
            >
              View Your Booking
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
