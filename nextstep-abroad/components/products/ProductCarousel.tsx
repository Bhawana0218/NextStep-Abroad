"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Box } from "@mui/material";

interface ProductCarouselProps {
  images: string[];
}

/**
 * ProductCarousel — uses Swiper.js with navigation arrows and
 * dot pagination for a polished image gallery experience.
 */
export default function ProductCarousel({ images }: ProductCarouselProps) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "white",
          backgroundColor: "rgba(0,0,0,0.4)",
          borderRadius: "50%",
          width: 36,
          height: 36,
          "&::after": { fontSize: "14px" },
        },
        "& .swiper-pagination-bullet-active": {
          backgroundColor: "#1976d2",
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={0}
        loop={images.length > 1}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={image}
              alt={`Product image ${index + 1}`}
              sx={{
                width: "100%",
                height: { xs: 280, md: 400 },
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
