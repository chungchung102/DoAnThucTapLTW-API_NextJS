"use client";

import Image from "next/image";

export default function PageBanner({ img }: { img: string }) {
  return (
    <div className="py-2">
      <div className="w-100">
        {img ? (
          <Image
            src={`${img??"example.jpg"}`}
            height={400}
            width={400}
            alt="Banner"
            className="object-fit-cover w-100"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
