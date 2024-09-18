import styles from './Carousel.module.scss';
import { motion } from 'framer-motion';
import React from 'react';

export const useCarousel = () => {
  const ref = React.useRef<UseCarouselLogic>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [currentSlide, setCurrentSlide] = React.useState<number>(1);

  const scrollTo = (index: number): void => {
    if (ref.current) {
      ref.current.scrollTo(index);
      setCurrentIndex(index);
      setCurrentSlide(index + 1);
    }
  };

  const scrollNext = (): void => {
    if (ref.current) {
      ref.current.scrollNext();
      setCurrentIndex(currentIndex + 1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const scrollPrev = (): void => {
    if (ref.current) {
      ref.current.scrollPrev();
      setCurrentIndex(currentIndex - 1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  return {
    scrollNext,
    scrollTo,
    scrollPrev,
    currentIndex,
    carouselRef: ref,
    currentSlide,
  };
};

const useCarouselLogic = (props: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const scrollTo = (index: number) => {
    if (index >= 0 && index < props.slides.length) {
      setCurrentIndex(index);
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollNext = () => {
    if (currentIndex < props.slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return {
    scrollTo,
    scrollNext,
    scrollPrev,
    currentIndex,
  };
};

export type UseCarouselLogic = ReturnType<typeof useCarouselLogic>;

export interface CarouselProps {
  slides: React.ReactNode[];
}

export const Carousel = React.forwardRef<UseCarouselLogic, CarouselProps>((props, ref) => {
  const logic: UseCarouselLogic = useCarouselLogic(props);

  const animate: Record<string, string> = {
    transform: logic.currentIndex === 0 ? `translate(-${logic.currentIndex * 100}%, 0)` : `translate(calc(-${logic.currentIndex * 100}% - 21px), 0)`,
  };

  const transition: Record<string, any> = {
    ease: [0.32, 0.75, 0, 1],
    duration: 0.45,
  };

  React.useImperativeHandle(ref, () => logic, [logic, props]);

  return (
    <div className={styles.carousel}>
      <motion.div animate={animate} className={styles.carousel__container} transition={transition}>
        {props.slides.map((slide, i) => (
          <div className={styles.carousel__slide} key={i}>
            {slide}
          </div>
        ))}
      </motion.div>
    </div>
  );
});
