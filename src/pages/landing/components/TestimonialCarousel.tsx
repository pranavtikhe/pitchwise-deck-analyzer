"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import styles from "./TestimonialCarousel.module.scss";
import StarField from "./StarField";

const testimonials = [
  {
    id: 1,
    text: "The AI analysis gave me a detailed overview of a startup pitch in minutes. It’s like having a dedicated analyst on my team.",
    author: "Jason Lee",
    position: "Early-Stage Investor",
  },
  {
    id: 2,
    text: "I was amazed at how accurately the tool identified the startup’s strengths, weaknesses, and competitive landscape. A huge time-saver!",
    author: "Priya Mehta",
    position: "VC Analyst, Horizon Ventures",
  },
  {
    id: 3,
    text: "The competitor insights were incredibly sharp. This app helps me filter out high-potential startups fast.",
    author: "Marcus Nguyen",
    position: "Startup Mentor & Angel Investor",
  },
  {
    id: 4,
    text: "I use this tool for every pitch deck I receive now. The scoring system gives me confidence in my first-round evaluations.",
    author: "Emily Carter",
    position: "Investment Associate",
  },
  {
    id: 5,
    text: "The analysis report is structured, easy to understand, and very actionable. Great tool for making data-backed decisions.",
    author: "David Stein",
    position: "Tech Entrepreneur & Investor",
  },
  {
    id: 6,
    text: "It identified red flags I hadn’t spotted myself. Super helpful for risk assessment before follow-up meetings.",
    author: "Aisha Khan",
    position: "Private Equity Consultant",
  },
  {
    id: 7,
    text: "Pitch decks are overwhelming to go through one by one—this tool simplifies that and adds real insights.",
    author: "Robert Kim",
    position: "Portfolio Manager",
  },
  {
    id: 8,
    text: "The platform provides concise yet comprehensive analysis. I now rely on it for my initial screening.",
    author: "Laura Chen",
    position: "Angel Investor & Startup Advisor",
  },
  {
    id: 9,
    text: "Within minutes, I got a complete breakdown of a pitch—team, funding history, market fit, and more. Extremely efficient.",
    author: "Sanjay Patel",
    position: "Strategic Investment Advisor",
  },
  {
    id: 10,
    text: "This is by far one of the smartest tools I’ve used in the investment space. Clean UI, deep analysis.",
    author: "Olivia Brooks",
    position: "VC Partner",
  },
  {
    id: 11,
    text: "It helps me present a more informed opinion to partners and clients. The competitive analysis is especially strong.",
    author: "Carlos Ramirez",
    position: "Innovation Consultant",
  },
  {
    id: 12,
    text: "Perfect for quick decision-making. I’ve already recommended it to colleagues at two funds.",
    author: "Sophie Zhang",
    position: "Startup Scout",
  },
];


type PositionType = "left" | "center" | "right" | "incoming" | "outgoing";

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const getVisibleIndices = () => {
    const indices = [];
    const prev = (testimonials.length + currentIndex - 1) % testimonials.length;
    const next = (currentIndex + 1) % testimonials.length;
    indices.push(prev, currentIndex, next);
    return indices;
  };

  const getCardVariants = (index: number) => {
    const positions = {
      left: { x: "-60%", scale: 0.9, zIndex: 0 },
      center: { x: "0%", scale: 1.1, zIndex: 2 },
      right: { x: "60%", scale: 0.9, zIndex: 0 },
      incoming: {
        x: direction === 1 ? "120%" : "-120%",
        scale: 0.9,
        zIndex: 0,
      },
      outgoing: {
        x: direction === 1 ? "-120%" : "120%",
        scale: 0.9,
        zIndex: 0,
      },
    };

    const visibleIndices = getVisibleIndices();
    const indexPosition = visibleIndices.indexOf(index);
    let position: PositionType;

    if (indexPosition === 1) position = "center";
    else if (indexPosition === 2) position = "right";
    else if (indexPosition === 0) position = "left";
    else position = direction === 1 ? "incoming" : "outgoing";

    return {
      initial:
        position === "incoming" ? positions.incoming : positions[position],
      animate: positions[position],
      exit: position === "outgoing" ? positions.outgoing : positions[position],
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5,
      },
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.starfieldWrapper}>
        <StarField />
      </div>
      <h3 className={styles.title}>Trusted by Leading Investors</h3>
      <p className={styles.subtitle}>
        Join thousands of investors making data-driven decisions with Spider.
      </p>

      <div className={styles.carouselContainer}>
        <AnimatePresence initial={false}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={clsx(styles.card, {
                [styles.active]: index === currentIndex,
              })}
              {...getCardVariants(index)}
              style={{
                display: getVisibleIndices().includes(index) ? "block" : "none",
              }}
            >
              <p className={styles.testimonialText}>{testimonial.text}</p>
              <h3 className={styles.author}>{testimonial.author}</h3>
              <p className={styles.position}>{testimonial.position}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.navigationDots}>
        {testimonials.map((_, index) => (
          <div
            key={index}
            className={clsx(styles.dot, {
              [styles.active]: index === currentIndex,
            })}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
