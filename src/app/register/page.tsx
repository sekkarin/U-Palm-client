/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import { Fade, FormControl, Input, InputAdornment } from "@mui/material";
import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import Header from "@/components/Header";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Alert from "@mui/material/Alert";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFritName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | string[]>([]);
  const [isRegister, setIsRegister] = useState(false);
  const loginWithGoogle = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_DOMAIN + "/auth/google-redirect";
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      const { status } = await api.post("/auth/local/register", {
        email,
        password,
        firstName,
        lastName,
      });

      if (status === 201) {
        setIsRegister(true);
        setTimeout(() => {
          router.replace("/login", { scroll: false });
        }, 3000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setFormError(true);
        const errorMessages = error.response?.data?.message;
        if (Array.isArray(errorMessages)) {
          setErrorMessage(errorMessages);
        }
        setErrorMessage(errorMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="bg-[f5f5f5] flex w-full h-full relative flex-col z-0">
        <div className="relative h-[800px] w-[100%] flex justify-center bg-blue-500 mt-auto ">
          <div className="flex flex-col justify-center items-center mt-4">
            {/* Login Form */}
            <div className="bg-white w-[440px] rounded-xl p-8 absolute z-[2] top-[9rem] sm:w-[90%] xsm:w-[90%] lg:w-[50%]">
              <div className="flex flex-col mb-2">
                <div className="font-[400] text-[27px] text-gray-800">
                  ลงชื่อเข้าใช้งาน
                </div>
                <div className="font-[300] text-[13.5px] text-gray-500">
                  กรอกข้อมูลของคุณเพื่อเข้าสู่ระบบ
                </div>

                {formError && (
                  <Fade
                    in={formError}
                    timeout={{ enter: 500, exit: 10000 }}
                    addEndListener={() => {
                      setTimeout(() => {
                        setFormError(false);
                      }, 10000);
                    }}
                  >
                    <Alert
                      severity="error"
                      className="my-2"
                      onClose={() => {
                        setFormError(false);
                      }}
                    >
                      {typeof errorMessage == "string"
                        ? errorMessage
                        : errorMessage.map((msg, index) => (
                            <p key={index}>{msg}</p>
                          ))}
                      {password !== confirmPassword
                        ? "Passwords don't match"
                        : undefined}
                    </Alert>
                  </Fade>
                )}
                {/* {isRegister} */}
                {isRegister && (
                  <Fade
                    in={isRegister}
                    timeout={{ enter: 500, exit: 10000 }}
                    addEndListener={() => {
                      setTimeout(() => {
                        setIsRegister(false);
                      }, 10000);
                    }}
                  >
                    <Alert
                      severity="success"
                      className="my-2"
                      onClose={() => {
                        setIsRegister(false);
                      }}
                    >
                      สร้างบัญชีสำเร็จ!
                    </Alert>
                  </Fade>
                )}
              </div>
              <form onSubmit={handleSubmit}>
                <FormControl
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                >
                  <Input
                    id="email"
                    placeholder="อีเมล์"
                    aria-describedby="email-helper-text"
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                >
                  <Input
                    id="firstName"
                    placeholder="ชื่อ"
                    aria-describedby="f-name-helper-text"
                    type="text"
                    required
                    onChange={(e) => setFritName(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Person2OutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                >
                  <Input
                    id="lastName"
                    placeholder="นามสกุล"
                    aria-describedby="f-name-helper-text"
                    type="text"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <Person2OutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                >
                  <Input
                    id="password"
                    placeholder="รหัสผ่าน"
                    aria-describedby="password-helper-text"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                >
                  <Input
                    id="confirm-password"
                    placeholder="ยืนยันรหัสผ่าน"
                    aria-describedby="comfirm-password-helper-text"
                    type="password"
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  sx={{
                    my: 1,
                  }}
                >
                  <button
                    type="submit"
                    disabled={
                      !email ||
                      !password ||
                      !confirmPassword ||
                      !firstName ||
                      !lastName
                    }
                    className="bg-primary-500 text-white hover:bg-primary-600 transition-all w-[100%] h-[38px] disabled:bg-gray-200 text-sm font-sm mt-6 rounded-md"
                  >
                    {isLoading ? "กำลังโหลด..." : "ลงทะเบียน"}
                  </button>
                </FormControl>
              </form>

              <div className="flex relative justify-center items-center mb-7 w-[100%] mt-7">
                <div className="absolute z-[2] px-2 text-gray-400 text-[12.5px]">
                  หากคุณเป็นสมาชิกอยู่เเล้ว ?
                  <Link
                    href="/login"
                    className=" cursor-pointer text-primary-400 hover:text-primary-500 transition-all"
                  >
                    ลงชื่อเข้าใช้งาน
                  </Link>
                </div>
              </div>
              <div className="flex relative justify-center items-center mb-7 mt-5 w-[100%]">
                <div className="absolute bg-white z-[2] px-2 rounded-[100%] text-gray-400 text-[14.2px]">
                  หรือ
                </div>
                <div className="bg-gray-300 absolute w-[75%] h-[1px]"></div>
              </div>
              <button
                onClick={loginWithGoogle}
                className="mb-5 w-[100%] rounded-md mt-4 border-[1px] h-[38px] border-primary-300 hover:bg-primary-500 text-primary-300 hover:text-white transition-all flex items-center justify-center"
              >
                <GoogleIcon className="text-[15.5px] " />
                <div className="text-[11.6px] ml-2 font-semibold  ">
                  สมัครด้วย Google
                </div>
              </button>
            </div>
          </div>
          <Image
            src={
              "/images/The-Borneo-Post-Sustainable-Palm-Oil-Communities-of-Sabah-and-Sarawak-01.jpg"
            }
            fill={true}
            className="object-cover brightness-75"
            alt={"Palm-Oil"}
          ></Image>
        </div>
      </main>
    </>
  );
}
