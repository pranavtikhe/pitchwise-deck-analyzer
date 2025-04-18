import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import LandingNavbar from './components/LandingNavbar';
import Button from './components/Button';
import SubscriptionModal from '@/components/SubscriptionModal';
import StarField from './components/StarField';
import TestimonialCarousel from './components/TestimonialCarousel';
import styles from './styles/LandingPage.module.scss';

const features = [
    {
        icon: '/icons/feature-1.svg',
        title: 'AI-Powered Investment Analysis',
        description: 'Leverage Mistral to extract key insights and generate comprehensive investment reports.'
    },
    {
        icon: '/icons/feature-2.svg',
        title: 'Smart Document Processing',
        description: 'Process PDFs, images, and text to extract valuable data from pitch decks.'
    },
    {
        icon: '/icons/feature-3.svg',
        title: ' Market Intelligence',
        description: 'Get real-time market analysis and competitor benchmarking.'
    },
    {
        icon: '/icons/feature-3.svg',
        title: ' Team Evaluation',
        description: 'Comprehensive analysis of founding teams and their track record.'
    }
];

const benefits = [
    {
        title: 'Faster Analysis',
        description: 'Reduce pitch deck review time by up to 70% with AI-powered insights.'
    },
    {
        title: 'Data-Driven Decisions',
        description: 'Make informed investment decisions backed by comprehensive market analysis.'
    },
    {
        title: 'Scalable Solution',
        description: 'Scale your investment analysis process without increasing team size.'
    },
    {
        title: 'Competitive Edge',
        description: 'Stay ahead with real-time market intelligence and competitor analysis.'
    }
];

const testimonials = [
    {
        text: "I've spent half my time on legal paperwork. LawBit has cut that down by 75%. It's a game-changer for my business.",
        author: "Jessica Williams",
        position: "Operations Manager - TechStart Inc"
    },
    {
        text: "As a startup, it was never like this managing legal documents. LawBit makes it easy to stay compliant and grow with confidence.",
        author: "Michael Chen",
        position: "Founder - Swift Labs"
    },
    {
        text: "The risk analysis feature gives us peace of mind. We catch potential issues before they become problems.",
        author: "Sarah Williams",
        position: "Legal Manager - InnovateCo"
    }
];

const pricing = [
    {
        title: 'Basic',
        price: '$29',
        period: '/mo',
        description: 'For individuals and small teams',
        features: [
            '10 Pitch Deck Analysis',
            'Basic Market Insights',
            'Email Support',
            'Export Reports'
        ],
        buttonText: 'Get Started'
    },
    {
        title: 'Pro',
        price: '$79',
        period: '/mo',
        description: 'For growing companies',
        features: [
            '50 Pitch Deck Analysis',
            'Advanced Market Insights',
            'Priority Support',
            'Team Collaboration'
        ],
        buttonText: 'Get Pro'
    },
    {
        title: 'Enterprise',
        price: '$199',
        period: '/mo',
        description: 'For large organizations',
        features: [
            'Unlimited Analysis',
            'Custom Integrations',
            'Dedicated Support',
            'API Access'
        ],
        buttonText: 'Contact Sales'
    }
];

const steps = [
    {
        icon: '/icons/upload.svg',
        title: 'Upload Pitch Deck',
        description: 'Upload your pitch deck in PDF format for instant analysis.'
    },
    {
        icon: '/icons/process.svg',
        title: 'AI Processing',
        description: 'Upload your pitch deck in PDF format for instant analysis.'
    },
    {
        icon: '/icons/report.svg',
        title: 'Generate Report',
        description: 'Receive detailed investment analysis with expert ratings and recommendations.'
    }
];

const LandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const supabase = getSupabaseClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        };
        checkAuth();
    }, []);

    const handlePricingButtonClick = async (planTitle: string) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/auth/signin');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleLegalDraftClick = () => {
        navigate('/contracts');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const starfieldVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        }
    };

    const ellipseVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.5,
                ease: "easeOut"
            }
        }
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
                        className={styles.radialImage}
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
                            background: 'linear-gradient(90deg, #FFFFFF 0%, #959595 50%, rgba(255, 255, 255, 0.15) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Fustat, sans-serif',
                            whiteSpace: 'nowrap',
                            overflow: 'visible'
                        }}
                    >
                        AI-Powered Investment Analysis
                    </motion.h1>

                    {/* <motion.div
                        className={styles.heroImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.1,
                            ease: [0.04, 0.62, 0.23, 0.98]
                        }}
                    >
                        <img
                            src="/images/contract.png"
                            alt="LawBit Hero"
                            className={styles.heroImg}
                        />
                    </motion.div> */}

                    <motion.p
                        className={styles.description}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Transform pitch deck evaluation with AI-driven insights and comprehensive investment reports
                    </motion.p>
                </div>
                <Link to="/auth/signup" className={styles.button}>
                    Start Analysis
                </Link>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: 'linear-gradient(90deg, #FFFFFF 0%, #959595 50%, rgba(255, 255, 255, 0.15) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontFamily: 'Fustat, sans-serif',
                        whiteSpace: 'nowrap',
                        overflow: 'visible'
                    }}
                >
                    Transform your investment decisions with cutting-edge AI technology
                </motion.h1>
                <div className={styles.container}>
                    <div className={styles.featureGrid}>
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className={styles.featureCardWrapper}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className={styles.featureCard}>
                                    <div className={styles.iconWrapper}>
                                        <div className={styles.iconSquare}>
                                            <div className={styles.iconCircle}>
                                                <img
                                                    src={feature.icon}
                                                    alt={feature.title}
                                                    className={styles.icon}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Steps Section */}
            <section className={styles.steps}>
                <div className={styles.container}>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            background: 'linear-gradient(90deg, #FFFFFF 0%, #959595 50%, rgba(255, 255, 255, 0.15) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Fustat, sans-serif',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            textAlign: 'center',
                            marginBottom: '2rem'
                        }}
                    >
                        Three Simple Steps to
                        <br />
                        Smarter Investment Decisions
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        style={{
                            textAlign: 'center',
                            color: '#959595',
                            fontSize: '1.2rem',
                            marginBottom: '4rem'
                        }}
                    >
                        Transform your pitch deck analysis process with AI-powered insights
                    </motion.p>
                    <div className={styles.stepsGrid}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                className={styles.stepCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className={styles.stepIcon}>
                                    <img src={step.icon} alt={step.title} />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
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
                            background: 'linear-gradient(90deg, #FFFFFF 0%, #959595 50%, rgba(255, 255, 255, 0.15) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Fustat, sans-serif',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}
                    >
                        Why Choose Spider?
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        style={{
                            textAlign: 'center',
                            color: '#959595',
                            fontSize: '1.2rem',
                            marginBottom: '4rem'
                        }}
                    >
                        Experience the future of investment analysis with AI-powered insights
                    </motion.p>
                    <div className={styles.benefitsGrid}>
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                className={styles.benefitCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <h3>{benefit.title}</h3>
                                <p>{benefit.description}</p>
                            </motion.div>
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
                        style={{
                            background: 'linear-gradient(90deg, #FFFFFF 0%, #959595 50%, rgba(255, 255, 255, 0.15) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: 'Fustat, sans-serif',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            textAlign: 'center',
                            marginBottom: '1rem'
                        }}
                    >
                        Choose your investment analysis plan
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        style={{
                            textAlign: 'center',
                            color: '#959595',
                            fontSize: '1.2rem',
                            marginBottom: '4rem'
                        }}
                    >
                        Select the perfect plan for your investment analysis needs. All plans include our core
                        AI-powered pitch deck analysis features.                    </motion.p>
                    <div className={styles.pricingGrid}>
                        {pricing.map((plan, index) => (
                            <motion.div
                                key={plan.title}
                                className={styles.pricingCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <h3>{plan.title}</h3>
                                <div className={styles.price}>
                                    <span className={styles.amount}>{plan.price}</span>
                                    <span className={styles.period}>{plan.period}</span>
                                </div>
                                <p>{plan.description}</p>
                                <ul className={styles.features}>
                                    {plan.features.map((feature) => (
                                        <li key={feature}>{feature}</li>
                                    ))}
                                </ul>
                                <Button
                                    title={plan.buttonText}
                                    className={styles.pricingButton}
                                    onClick={() => handlePricingButtonClick(plan.title)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Product Hunt Section */}
            <section className={styles.productHunt}>
                <div className={styles.container}>
                    <div className={styles.productHuntContent}>
                        <h2 className={styles.sectionTitle}>
                            <span>Join the AI Legal Revolution</span>
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            From Hours to Seconds: Analyze Legal Docs with LawBit's Cutting-Edge AI
                        </p>
                        <div className={styles.productHuntBadge}>
                            <a
                                href="https://www.producthunt.com/products/lawbit/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-lawbit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.badgeLink}
                            >
                                <img
                                    src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1053856&theme=dark"
                                    alt="Lawbit - Revolutionize Your Legal Drafting with AI Precision | Product Hunt"
                                    className={styles.badgeImage}
                                />
                            </a>
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
                                    src="/images/slogo.svg"
                                    alt="Spider"
                                    className={styles.footerLogoImg}
                                />
                                <span>The future of legal ops; AI-powered, business-ready</span>
                            </div>

                            <div className={styles.footerLinks}>
                                <a href="/terms">Terms of use</a>
                                <span>•</span>
                                <a href="/privacy">Privacy Policy</a>
                                <span>•</span>
                                <a href="/disclaimer">AI Enabled Content Notice</a>
                                <span>•</span>
                                <a href="/responsible-ai">Responsible AI</a>
                            </div>

                            <div className={styles.footerBottom}>
                                <p>
                                    Copyright 2025. All rights reserved. &nbsp;&nbsp; Lawbit AI, A thing by&nbsp;
                                    <img
                                        src="/neuralpath.svg"
                                        alt="Neural Paths"
                                        className={styles.neuralPathLogo}
                                    />
                                </p>
                            </div>
                        </div>

                        <div className={styles.footerRight}>
                            <img
                                src="/images/footer-illustration.png"
                                alt="Footer Illustration"
                                className={styles.footerIllustration}
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