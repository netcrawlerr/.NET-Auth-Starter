import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { FormEvent, useState, useRef } from "react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [codeEntered, setCodeEntered] = useState<string[]>(
    new Array(6).fill("")
  );

  const [error, setError] = useState("");

  const [codeVerified, setCodeVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newCodeEntered = [...codeEntered];
    newCodeEntered[index] = value;

    if (value && index < codeEntered.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    setCodeEntered(newCodeEntered);
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const pastedValue = e.clipboardData.getData("Text").slice(0, 6);
    const newCodeEntered = pastedValue.split("");

    setCodeEntered(
      new Array(6).fill("").map((_, i) => newCodeEntered[i] || "")
    );

    const nextEmptyIndex = newCodeEntered.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setEmailSent(false);

    try {
      const response = await axios.post("/api/auth/forgot-password", {
        recipient: formData.email,
      });
      const data = await response.data;
      console.log("Email sent to:", formData.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending email:", error.response.status);
      if (error.response.status) {
        setError("User Not Found");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    console.log("Entered code:", codeEntered.join(""));
    console.log("Email", formData.email);
    setError("");

    try {
      const response = await axios.post("/api/auth/check-code", {
        email: formData.email,
        code: codeEntered.join(""),
      });

      const data = await response.data;
      console.log(data);

      setCodeVerified(true);
      setEmailSent(false);
    } catch (e) {
      if (e.response.status == 400) {
        setError("Invalid or Exipred Code");
      }
      console.error(e.response.status);
    }
  };

  const handleSubmitNewPassword = async () => {
    setError("");
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/reset-password/confirm", {
        email: formData.email,
        password: formData.newPassword,
        code: "123456", // i just didnt remove from backend so i ahve to put smtng
      });
      const data = await response.data;
      console.log(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <CardHeader></CardHeader>
        <CardTitle className="text-center mb-5">Reset Password</CardTitle>
        <CardContent>
          <span className="text-red-500 text-sm mb-3">{error}</span>
          {emailSent ? (
            <div className="text-center">
              <h2 className="text-lg font-bold">
                Email Sent! to {formData.email}
              </h2>
              <p className="text-sm">
                Check your email for further instructions.
              </p>
              <Button
                className="mt-4 w-full"
                onClick={() => setEmailSent(false)}
              >
                Send Again
              </Button>
              <div className="mt-4">
                <h3 className="text-center mb-4">Enter Your 6-Digit Code</h3>
                <div className="grid grid-cols-6 gap-2">
                  {codeEntered.map((_, index) => (
                    <Input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={codeEntered[index]}
                      onChange={(e) => handleInputChange(e, index)}
                      onPaste={(e) => handlePaste(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="text-center"
                    />
                  ))}
                </div>
                <Button
                  variant={"destructive"}
                  className="mt-4 w-full"
                  onClick={handleSubmitCode}
                  disabled={loading || codeEntered.includes("")}
                >
                  Verify Code
                </Button>
              </div>
            </div>
          ) : codeVerified ? (
            // Render Reset Password Form if code is correct
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitNewPassword();
              }}
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending Email ..." : "Send Email"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
