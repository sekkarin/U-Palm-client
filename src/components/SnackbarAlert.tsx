import { Alert, Snackbar } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  handleCloseSnackbar: () => void;
  isError: boolean;
  message: string;
  autoHideDuration?: number;
};

export default function SnackbarAlert({
  open,
  handleCloseSnackbar,
  isError,
  message,
  autoHideDuration = 6000,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
      onClose={handleCloseSnackbar}
      sx={{ mt: 5 }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={isError ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
