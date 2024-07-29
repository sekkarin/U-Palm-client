/* eslint-disable react/no-unescaped-entities */
"use client";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import Carousel from "react-material-ui-carousel";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/libs/getProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  name: string;
  description: string;
  product_image: string;
  category_id: string;
  supplier_id: string;
}

export default function Home() {
  const { data, isLoading, isError, isSuccess } = useQuery<Product[]>({
    queryKey: ["Product-landing-page"],
    queryFn: () => getProduct(),
    refetchInterval: 1000 * 60 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="h-full">
        <p>loading....</p>
      </div>
    );
  }
  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      image:
        "/images/The-Borneo-Post-Sustainable-Palm-Oil-Communities-of-Sabah-and-Sarawak-01.jpg",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      image:
        "https://hoselink-neto-images.s3.amazonaws.com/assets/images/palmsmain.jpg",
    },
  ];
  // const data = await getProduct();
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
                  ยินดีต้อนรับ' เข้าสู่ u-palm
                </div>
                <div className="text-[14.x] mt-4 text-[#d6d6d6]">
                  มีรถให้เช่ามากกว่า 50 คนทั่วประเทศไทย รับประกันความปลอดภัย
                  เปิดให้บริการมาเเล้วกว่า 5 ปี
                  ถ้าคุณต้องการรถไม่ว่าจะอยู่ที่ไหน นึกถึง Carental
                </div>
                {/* search product input*/}
                <div className="mt-4 flex rounded-md p-[1.5px] gap-1">
                  <input
                    type="text"
                    placeholder="ค้นหาสิ่งที่คุณต้อง..."
                    className="w-[480px] focus:outline-none pl-3 text-[12.5px] h-[40px] rounded-sm border-[1px] border-[#fff] shadow-inner text-[#000]"
                  ></input>
                  <button className="bg-secondary-500  w-[50px] text-[20px] text-[#3e3e3e] hover:bg-secondary-400 transition-all flex items-center justify-center rounded-sm h-[40px]">
                    <SearchIcon />
                  </button>
                </div>
              </div>
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

        {/* Hit hot Products */}
        <div className="flex justify-center w-[100%] mb-5 items-center mt-10">
          <div className="w-[80%] pb-[1.7rem] flex flex-col gap-4 bg-white pt-3 px-4 shadow-sm sm:w-[90%] xsm:w-[90%]">
            {/* Title */}
            <div className="text-primary-400 pb-3 border-b-[1px] border-gray-200 text-sm">
              สินค้าขายดี
            </div>
            <Carousel duration={10} navButtonsAlwaysVisible>
              {data!.map((item, i) => (
                // <Item key={i} item={item} />
                <Image
                  key={i}
                  src={item.product_image}
                  className="mx-auto"
                  width={1000}
                  height={600}
                  alt={""}
                />
              ))}
            </Carousel>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
