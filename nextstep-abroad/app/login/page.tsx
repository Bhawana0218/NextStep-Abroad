"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useAuth } from "@/hooks/useAuth";
import { LoginPayload } from "@/types/auth.types";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    const success = await login(data);

    if (success) {
      toast.success(`Welcome back!`);
      router.push("/dashboard");
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}
        >
          {/* Header Banner */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
              py: 4,
              px: 3,
              textAlign: "center",
              color: "white",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Admin Login
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              Help Study Abroad Dashboard
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                autoComplete="username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                })}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1rem",
                  background:
                    "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Demo Credentials
              </Typography>
            </Divider>

            <Box
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Use these credentials to log in:
              </Typography>

              <Typography variant="body2"  sx={{ fontWeight: "bold" }}>
                Username:{" "}
                <Box component="span" color="primary.main">
                  emilys
                </Box>
              </Typography>

              <Typography variant="body2"  sx={{ fontWeight: "bold" }}>
                Password:{" "}
                <Box component="span" color="primary.main">
                  emilyspass
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
