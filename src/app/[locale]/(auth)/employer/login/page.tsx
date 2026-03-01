"use client";
// libraries
import Image from "next/image";
import Link from "next/link";
//components
import { InputFormField } from "@/shared/components/InputFormField";
import { PasswordFormField } from "@/shared/components/PasswordFormField";
import { Button } from "@/shared/components/ui/button";
// image
import googleIcon from "@/assets/icons/google-symbol.svg";
import linkedInIcon from "@/assets/icons/linkedIn.svg";

const LoginPage = () => {
  return (
    <div className="h-[calc(100vh-75px)] flex items-center justify-center gap-4 ">
      <div className="w-3/4 mx-auto p-4 ">
        <h1 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-primary">
          Welcome Back
        </h1>
        <p className="text-[clamp(.8rem,4vw,1rem)]">
          Find your next opportunity faster
        </p>

        {/* Login form */}
        <div className="flex flex-col gap-4 mt-6">
          <div>
            <InputFormField
              id="email"
              label="Email"
              type={"email"}
              placeholder="ex:mail@mail.com"
            />
          </div>
          <PasswordFormField
            id="password"
            label="Password"
            placeholder="******"
          />
          <Link href="/forget-password" className="text-xs hover:text-primary">
            Forgot password?
          </Link>
          <div className="flex justify-center">
            <Button
              variant={"secondary"}
              hoverStyle={"slide"}
              className="w-1/3"
            >
              Login
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500 font-medium tracking-wide">
            or
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="flex gap-4">
          <Button variant={"outline"} className="w-1/2">
            LinkedIn
            <Image
              src={linkedInIcon}
              alt="LinkedIn Icon"
              width={20}
              height={20}
            />
          </Button>
          <Button variant={"outline"} className="w-1/2">
            Google
            <Image src={googleIcon} alt="Google Icon" width={20} height={20} />
          </Button>
        </div>
        {/* Bottom CTA */}
        <div className="text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            New to JooCore?{" "}
            <Link
              href="#"
              className="text-secondary hover:text-secondary-foreground underline font-medium transition-colors"
            >
              Join Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
