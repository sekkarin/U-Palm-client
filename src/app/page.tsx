"use client";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getSuppliers } from "@/libs/getProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import ProductCarousel from "@/components/ProductCarousel";
import { ProductResponse } from "@/interfaces/product.interface";
import { Box } from "@mui/material";
import { Loading } from "@/components/Loading";
import SupplierCarousel from "@/components/SupplierCarousel";
import { ISupplier } from "@/interfaces/supplier.interface";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Dynamically import the carousel skeleton loader to avoid SSR issues
const ProductCarouselSkeleton = dynamic(
  () => import("@/components/Loading/ProductSkeleton"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [query, setQuery] = useState("");
  const route = useRouter();
  const productsQuery = useQuery<ProductResponse>({
    queryKey: ["Product-landing-page"],
    queryFn: () => getProducts(),
    refetchInterval: 1000 * 60 * 60 * 5,
  });
  const suppliersQuery = useQuery<ISupplier[]>({
    queryKey: ["Suppliers-landing-page"],
    queryFn: () => getSuppliers(),
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  if (productsQuery.isLoading || suppliersQuery.isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <main className="bg-[f5f5f5] flex w-full h-full relative flex-col z-0">
        <div className="relative h-[550px] w-[100%] flex justify-center bg-blue-500 mt-[105px]">
          <div className="bg-[#0000007a] w-[100%] absolute h-[100%]"></div>
          <div className="absolute text-white w-[60%] justify-left top-[11rem] xl:w-[70%] lg:w-[80%] md:w-[90%] sm:w-[91%] xsm:w-[85%] z-10 ">
            <div>
              <div className="w-[100%]">
                <div className="text-[31px] font-[400]">
                  ยินดีต้อนรับ &apos; เข้าสู่ U Palm
                </div>
                <div className="text-[14.x] mt-4 text-[#d6d6d6]">
                  แพลตฟอร์มการขายสินค้าเกี่ยวกับปาล์มอันดับ 1
                </div>
                {/* search product input*/}

                <div className="mt-4 flex rounded-md p-[1.5px] gap-1">
                  <input
                    // onChange={(e) => {
                    //   setQuerySearch(e.target.value);
                    // }}
                    name={"query"}
                    type="text"
                    placeholder="ค้นหาสินค้าที่คุณต้อง..."
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                    className="w-[480px] focus:outline-none pl-3 text-[12.5px] h-[40px] rounded-sm border-[1px] border-[#fff] shadow-inner text-[#000]"
                  ></input>
                  <button
                    onClick={() => {
                      if (query == "") {
                        return;
                      }
                      route.push(`search/${query}`);
                    }}
                    className="bg-secondary-500  w-[50px] text-[20px] text-[#3e3e3e] hover:bg-secondary-400 transition-all flex items-center justify-center rounded-sm h-[40px]"
                  >
                    <SearchIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={"/images/image3.jpg"}
            fill={true}
            className="object-cover brightness-[.5] blur-sm"
            alt={"Palm-Oil"}
          ></Image>
        </div>

        {/* Hit hot Products */}
        <Box className="flex justify-center w-[100%] mb-5 items-center mt-10">
          <div className="w-[80%] pb-[1.7rem] flex flex-col gap-4 bg-white pt-3 px-4 shadow-sm sm:w-[90%] xsm:w-[90%]">
            {/* Title */}
            <div className="text-primary-400 pb-3 border-b-[1px] border-gray-200 text-sm">
              สินค้าขายดี
            </div>
            {productsQuery.isLoading ? (
              <ProductCarouselSkeleton />
            ) : (
              productsQuery.data?.data && (
                <ProductCarousel data={productsQuery.data.data} />
              )
            )}
          </div>
        </Box>

        {/* Banner  */}
        <Box>
          {/* <Image/> */}
          <Image
            src={"/images/U-PALM_Brochure.png"}
            alt="Converted_Banner_Palm_Seed_Product"
            width={1900}
            height={200}
            className="mx-auto w-[90%] my-2"
          />
        </Box>
        {/*End Banner  */}
        {/* Suppliers */}
        <Box className="flex justify-center w-[100%] mb-5 items-center mt-10">
          <div className="w-[80%] pb-[1.7rem] flex flex-col gap-4 bg-white pt-3 px-4 shadow-sm sm:w-[90%] xsm:w-[90%]">
            {/* Title */}
            <div className="text-primary-400 pb-3 border-b-[1px] border-gray-200 text-sm">
              ผู้ขาย
            </div>
            {suppliersQuery.data && (
              <SupplierCarousel data={suppliersQuery?.data} />
            )}
          </div>
        </Box>

        {/*End Suppliers */}
      </main>
      <Footer />
    </>
  );
}
