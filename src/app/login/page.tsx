/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import {
  Button,
  Fade,
  FormControl,
  Input,
  InputAdornment,
} from "@mui/material";
import Link from "next/link";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import Header from "@/components/Header";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/libs/hook";
import { setCredential } from "@/libs/features/auth/authSlice";
import Alert from "@mui/material/Alert";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const loginWithGoogle = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_DOMAIN + "/auth/google-redirect";
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      event.preventDefault();

      const { data, status } = await api.post("/auth/local/login", {
        email,
        password,
      });

      if (status === 200) {
        console.log(data);

        dispatch(
          setCredential({ access_token: data.access_token, ...data.user })
        );
        router.replace("/", { scroll: false });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setFormError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Header />
      <main className="bg-[f5f5f5] flex w-full h-full relative flex-col z-0">
        <div className="relative h-[720px] w-[100%] flex justify-center bg-blue-500 mt-auto ">
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
                      severity="warning"
                      className="my-2"
                      onClose={() => {
                        setFormError(false);
                      }}
                    >
                      อีเมล์ หรือ รหัสผ่าน มีข้อผิดพลาด!
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
                <FormControl fullWidth className="my-2">
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
                  <button
                    type="submit"
                    disabled={!email || !password}
                    className="bg-primary-500 text-white hover:bg-primary-600 transition-all w-[100%] h-[38px] disabled:bg-gray-200 text-sm font-sm mt-6 rounded-md"
                  >
                    {isLoading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
                  </button>
                </FormControl>
              </form>
              <div className="w-[100%] flex justify-end mt-5">
                <Button className="text-[11.5px] text-primary-500 hover:text-primary-500 transition-all font-semibold">
                  ลืมรหัสผ่าน
                </Button>
              </div>

              <div className="flex relative justify-center items-center mb-7 w-[100%] mt-7">
                <div className="absolute z-[2] px-2 text-gray-400 text-[12.5px]">
                  ยังไม่ได้ละเบียนใช่หรือไม่ ?
                  <Link
                    href="/register"
                    className=" cursor-pointer text-primary-400 hover:text-primary-500 transition-all"
                  >
                    ลงทะเบียน
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
                  เข้าสู่ระบบด้วย Google
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
