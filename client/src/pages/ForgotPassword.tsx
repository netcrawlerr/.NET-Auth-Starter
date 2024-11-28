import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormEvent, useState, useRef } from "react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [codeEntered, setCodeEntered] = useState<string[]>(
    new Array(6).fill("")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);  

  const [formData, setFormData] = useState({
    email: "",
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Email sent to:", formData.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = () => {
    console.log("Entered code:", codeEntered.join(""));
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
                  className="mt-4 w-full"
                  onClick={handleSubmitCode}
                  disabled={loading || codeEntered.includes("")}
                >
                  Reset
                </Button>
              </div>
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
