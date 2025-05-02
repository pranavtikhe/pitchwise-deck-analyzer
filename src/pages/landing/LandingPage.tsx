import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getSupabaseClient } from "@/lib/supabase";
import LandingNavbar from "./components/LandingNavbar";
import Button from "./components/Button";
import SubscriptionModal from "@/components/SubscriptionModal";
import StarField from "./components/StarField";
import TestimonialCarousel from "./components/TestimonialCarousel";
import styles from "./styles/LandingPage.module.scss";

const features = [
  {
    icon: "/analysis.svg",
    title: "AI-Powered Investment Analysis",
    description:
      "Leverage Mistral to extract key insights and generate comprehensive investment reports.",
  },
  {
    icon: "/process.svg",
    title: "Smart Document Processing",
    description:
      "Process PDFs, images, and text to extract valuable data from pitch decks.",
  },
  {
    icon: "/market.svg",
    title: " Market Intelligence",
    description: "Get real-time market analysis and competitor benchmarking.",
  },
  {
    icon: "/team.svg",
    title: " Team Evaluation",
    description:
      "Comprehensive analysis of founding teams and their track record.",
  },
];

const benefits = [
  {
    title: "Faster Analysis",
    description:
      "Reduce pitch deck review time by up to 70% with AI-powered insights.",
  },
  {
    title: "Data-Driven Decisions",
    description:
      "Make informed investment decisions backed by comprehensive market analysis.",
  },
  {
    title: "Scalable Solution",
    description:
      "Scale your investment analysis process without increasing team size.",
  },
  {
    title: "Competitive Edge",
    description:
      "Stay ahead with real-time market intelligence and competitor analysis.",
  },
];

const testimonials = [
  {
    text: "I've spent half my time on legal paperwork. LawBit has cut that down by 75%. It's a game-changer for my business.",
    author: "Jessica Williams",
    position: "Operations Manager - TechStart Inc",
  },
  {
    text: "As a startup, it was never like this managing legal documents. LawBit makes it easy to stay compliant and grow with confidence.",
    author: "Michael Chen",
    position: "Founder - Swift Labs",
  },
  {
    text: "The risk analysis feature gives us peace of mind. We catch potential issues before they become problems.",
    author: "Sarah Williams",
    position: "Legal Manager - InnovateCo",
  },
];

const pricing = [
  {
    title: "Starter",
    price: "$399",
    period: "per member / year",
    billing: "billed yearly",
    description: "Perfect for individual investors:",
    features: [
      "Up to 10 pitch deck analyses per month",
      "Basic AI insights and recommendations",
      "Standard report format",
      "Email support",
      "Basic competitor analysis",
    ],
    buttonText: "Start Free Trial",
    isPopular: false,
  },
  {
    title: "Professional",
    price: "$399",
    period: "per member / year",
    billing: "billed yearly",
    description: "Ideal for investment firms:",
    features: [
      "Unlimited pitch deck analyses",
      "Advanced AI insights with Gemini 2.0",
      "Customizable report formats",
      "Priority support",
      "Comprehensive competitor analysis",
      "Deal structuring recommendations",
      "API access for integrations",
    ],
    buttonText: "Get Started",
    isPopular: true,
  },
  {
    title: "Enterprise",
    price: "$399",
    period: "per member / year",
    billing: "billed yearly",
    description: "For large investment organizations:",
    features: [
      "Everything in Professional",
      "Custom AI model training",
      "White-label reports",
      "Dedicated account manager",
      "Advanced security features",
      "Custom integrations",
      "Team collaboration tools",
      "SLA guarantees",
    ],
    buttonText: "Contact Sales",
    isPopular: false,
  },
];

const steps = [
  {
    icon: "/uploadn.svg",
    title: "Upload Pitch Deck",
    description: "Upload your pitch deck in PDF format for instant analysis.",
  },
  {
    icon: "/info.svg",
    title: "AI Processing",
    description: "Upload your pitch deck in PDF format for instant analysis.",
  },
  {
    icon: "/faq.svg",
    title: "Generate Report",
    description:
      "Receive detailed investment analysis with expert ratings and recommendations.",
  },
];

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handlePricingButtonClick = async (planTitle: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth/signin");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleLegalDraftClick = () => {
    navigate("/contracts");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const starfieldVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const ellipseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className={styles.main}>
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.starfieldWrapper}
          variants={starfieldVariants}
          initial="hidden"
          animate="visible"
        >
          <StarField />
        </motion.div>
        <motion.div
          className={styles.ellipse}
          variants={ellipseVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src="/images/white-radial.svg"
            alt="Radial gradient"
            width={1000}
            height={1000}
          />
        </motion.div>
      </div>

      <LandingNavbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              whiteSpace: "nowrap",
              overflow: "visible",
            }}
          >
            AI-Powered Investment Analysis
          </motion.h1>

          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
          >
            <img
              src="/images/heroimg.png"
              alt="Spider Hero"
              className={styles.heroImg}
            />
          </motion.div>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform pitch deck evaluation with AI-driven insights and
            comprehensive investment reports
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              whiteSpace: "nowrap",
              overflow: "visible",
              marginBottom: "5rem",
            }}
          >
            Transform Your Investment Decisions <br /> with Cutting-Edge AI
            Technology
          </motion.h1>

          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.featureCardWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`${styles.featureCard} p-6 relative bg-[#1C1C1C] rounded-2xl`}
                >
                  <div className={`${styles.iconWrapper} mb-4`}>
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-14 h-14"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.steps}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              whiteSpace: "nowrap",
              textAlign: "center",
              marginBottom: "5rem",
              marginTop: "5rem",
            }}
          >
            Three Simple Steps To Success
          </motion.h1>

          {/* Grid */}
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className={styles.stepCardWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Gradient Wrapper */}
                <div className={styles.gradientWrapper}>
                  <img
                    src="/images/backgroundgradiant.png"
                    alt="Gradient Background"
                    className={styles.gradientBackground}
                  />
                  {/* Inner Box */}
                  <div className={styles.innerBox}>
                    {/* Step Card */}
                    <div className={styles.stepCard}>
                      {/* Icon Container */}
                      <div className={styles.iconContainer}>
                        <div className={styles.iconCircle}>
                          <img
                            src={step.icon}
                            alt={step.title}
                            className="w-8 h-8"
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <h3>{step.title}</h3>

                      {/* Description */}
                      <p>{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={styles.benefits}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              whiteSpace: "nowrap",
              overflow: "visible",
              marginBottom: "0rem",
            }}
          >
            Why Choose Spider?
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            style={{
              textAlign: "center",
              color: "#959595",
              fontSize: "1.2rem",
              marginBottom: "5rem",
            }}
          >
            Experience the future of investment analysis with AI-powered
            insights
          </motion.p>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className={styles.gradientWrapper}>
                <img
                  src="/images/backgroundgradiant.png"
                  alt="Gradient Background"
                  className={styles.gradientBackground}
                />
                <div className={styles.innerBox}>
                  <motion.div
                    className={styles.innerBox}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <TestimonialCarousel />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose your investment analysis plan
          </motion.h1>
          <motion.p
            className={styles.sectionSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Select the perfect plan for your investment analysis needs. All
            plans include our core AI-powered pitch deck analysis features.
          </motion.p>
          <div className={styles.pricingGrid}>
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.title}
                className={`${styles.pricingCard} ${plan.isPopular ? styles.popular : ''} relative`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#212228] rounded-full px-4 py-1 text-sm font-medium text-white border border-[#ffffff1a]">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <h3>{plan.title}</h3>
                <div className={styles.price}>
                  {plan.price && <span className={styles.period}>{plan.price}</span>}
                  {plan.period && <span className={styles.period}>{plan.period}</span>}
                  {plan.billing && <span className={styles.period}>{plan.billing}</span>}
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Button
                  title={plan.buttonText}
                  className={`${styles.pricingButton} ${plan.isPopular ? styles.primary : styles.secondary}`}
                  onClick={() => handlePricingButtonClick(plan.title)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              whiteSpace: "nowrap",
              overflow: "visible",
              marginBottom: "1rem",
              marginTop: "5rem",
            }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            style={{
              textAlign: "center",
              color: "#959595",
              fontSize: "1.2rem",
              marginBottom: "5rem",
            }}
          >
            Have more questions? Our support team is here to help you make
            informed investment decisions.
          </motion.p>
          <div className={styles.faqGrid}>
            <div className={styles.faqAccordion}>
              {[
                {
                  question: "How accurate is the AI analysis?",
                  answer:
                    "Our AI analysis powered by Gemini 2.0 achieves over 95% accuracy in extracting key information from pitch decks. The system is continuously trained on thousands of successful pitch decks and investment reports to provide reliable insights.",
                },
                {
                  question: "What types of pitch decks can be analyzed?",
                  answer:
                    "Our system can analyze pitch decks across various industries and stages, including startup pitch decks, investment presentations, and business proposals. We support multiple file formats including PDF, PowerPoint, and Google Slides.",
                },
                {
                  question: "How secure is my pitch deck data?",
                  answer:
                    "We employ enterprise-grade encryption and security measures to protect your data. All uploads are encrypted, and we maintain strict access controls and compliance with data protection regulations.",
                },
                {
                  question: "Can I customize the analysis reports?",
                  answer:
                    "Yes, you can customize analysis reports to focus on specific aspects of the pitch deck, add custom metrics, and generate reports in various formats including PDF, Excel, and interactive dashboards.",
                },
                {
                  question: "How long does the analysis take?",
                  answer:
                    "Most pitch deck analyses are completed within 2-3 minutes. Complex decks or those requiring detailed market analysis may take up to 5 minutes to process completely.",
                },
                {
                  question: "What kind of insights does Spider provide?",
                  answer:
                    "Spider provides comprehensive insights including market analysis, competitive landscape, financial projections evaluation, team assessment, and risk analysis. We also offer industry-specific metrics and benchmarking.",
                },
                {
                  question: "Can I integrate Spider with my existing tools?",
                  answer:
                    "Yes, Spider offers API integration capabilities and can be integrated with popular investment management platforms, CRM systems, and data analytics tools.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className={styles.faqItem}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() => {
                      const element = document.getElementById(`faq-${index}`);
                      if (element) {
                        element.classList.toggle(styles.active);
                      }
                    }}
                  >
                    {faq.question}
                    <span className={styles.faqIcon}>+</span>
                  </button>
                  <div id={`faq-${index}`} className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerMainContent}>
            <div className={styles.footerLeft}>
              <div className={styles.footerLogo}>
                <img
                  src="/images/footer-logo.png"
                  alt="Spider"
                  width={160}
                  height={55}
                  style={{ objectFit: "contain" }}
                />
                <span>
                  AI-powered investment intelligence for modern investors.
                </span>
              </div>

              <div className={styles.footerLinks}>
                <a href="/terms-of-use">Terms of use</a>
                <span>•</span>
                <a href="/privacy-policy">Privacy Policy</a>
                <span>•</span>
                <a href="/responsible-ai">Responsible AI</a>
              </div>

              <div className={styles.footerBottom}>
                <p>
                  Copyright 2025. All rights reserved. &nbsp;&nbsp; Spider AI, A
                  thing by&nbsp;
                  <img
                    src="/neuralpath.svg"
                    alt="Neural Paths"
                    width={115}
                    height={30}
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      marginLeft: "8px",
                    }}
                  />
                </p>
              </div>
            </div>

            <div className={styles.footerRight}>
              <img
                src="/images/footerimg.png"
                alt="Footer Illustration"
                width={400}
                height={200}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "bottom right",
                  display: "block",
                  marginBottom: "-5px",
                }}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default LandingPage;
