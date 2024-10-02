"use client";

import { Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <html>
      <body>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Something went wrong!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => reset()}
            sx={{ mt: 2 }}
          >
            Try again
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.back()}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Container>
      </body>
    </html>
  );
}
