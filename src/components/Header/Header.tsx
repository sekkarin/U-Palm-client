import React, { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/libs/hook";
import { logout } from "@/libs/features/auth/authSlice";

const Header: React.FC = () => {
  const userAuth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const logOut = () => {
    dispatch(logout());
  };
  return (
    <div className="flex flex-col w-[100%] fixed top-[0px] z-[10] shadow-md">
      {/* first section */}
      <div className="w-[100%] flex justify-center bg-white">
        <div className="flex w-[80%] justify-between items-center">
          {/* Logo */}
          <Link href={"/"}>
            <Image
              src={"/u-palm.jpg"}
              width={70}
              height={70}
              alt={"u-palm"}
              className="cursor-pointer"
            />
          </Link>

          {/* sign in / up && cart user information */}
          {userAuth.accessToken ? (
            <div className="flex gap-2 text-primary-500 text-[12.5px] items-center">
              <button onClick={logOut}>Logout</button>
              <button>User 1</button>
            </div>
          ) : (
            <div className="flex gap-2 text-primary-500 text-[12.5px] items-center">
              <Link
                href={"/login"}
                className="border-[1px] border-[#fff] px-3 hover:text-secondary-500 rounded-md transition-all h-[30px]"
              >
                เข้าสู่ระบบ
              </Link>
              {/* line between sign & sign up */}
              <div className="h-[20px] w-[1px] bg-primary-200"></div>
              <Link
                href={"/register"}
                className="border-[1px] border-[#fff] px-3 hover:text-secondary-500 rounded-md transition-all h-[30px]"
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* second section */}
      <div className="w-[100%] flex justify-center bg-primary-700 py-2">
        <div className="w-[80%] flex justify-between">
          {/* nav section */}
          <div className="flex gap-3 text-white text-[13px]">
            <Link
              href={"/"}
              className="pr-5 hover:text-secondary-500 transition-all"
            >
              หน้าหลัก
            </Link>
            <Link
              href={"/"}
              className="hover:text-secondary-500 transition-all"
            >
              สินค้าทั้งหมด
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
