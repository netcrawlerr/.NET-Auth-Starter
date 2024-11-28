import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setEmailSent(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Email sent to:", formData.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending email:", error);
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
            </div>
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
                    onChange={handleInputChange}
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
