import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import TokenUsage from '@/components/TokenUsage';
import SubscriptionModal from '@/components/SubscriptionModal';
import styles from '../styles/Navbar.module.scss';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isHistoryPage = location.pathname === '/history';
    const isTermsPage = location.pathname === '/terms-of-use';
    const isPrivacyPage = location.pathname === '/privacy-policy';
    const isResponsibleAIPage = location.pathname === '/responsible-ai';
    const isSpiderPage = location.pathname === '/spider';
    const isInsightPage = location.pathname.startsWith('/insight/');
    const supabase = getSupabaseClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
        setIsOpen(false);
    };

    const handleBack = () => {
        if (isHistoryPage) {
            navigate('/spider');
        } else if (isTermsPage || isPrivacyPage || isResponsibleAIPage) {
            navigate('/');
        } else if (isInsightPage) {
            navigate('/history');
        }
    };

    const openSubscriptionModal = () => {
        setIsOpen(false);
        setIsSubscriptionModalOpen(true);
    };

    const closeSubscriptionModal = () => {
        setIsSubscriptionModalOpen(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {(isHistoryPage || isTermsPage || isPrivacyPage || isResponsibleAIPage || isInsightPage) ? (
                    <button
                        className={styles.backButton}
                        onClick={handleBack}
                        aria-label="Back"
                    >
                        <div className={styles.menuSquare}>
                            <div className={styles.menuCircle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className={styles.placeholder} />
                )}
                <div className={styles.logoLink} onClick={() => navigate('/spider')}>
                    <img
                        src="/images/slogo.svg"
                        alt="spider"
                        className={styles.logo}
                    />
                </div>
                <button
                    className={styles.menuButton}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <div className={styles.menuSquare}>
                        <div className={styles.menuCircle}>
                            <div className={`${styles.menuLine} ${isOpen ? styles.open : ''}`} />
                            <div className={`${styles.menuLine} ${isOpen ? styles.open : ''}`} />
                        </div>
                    </div>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                        />
                        <motion.div
                            className={styles.dialog}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={styles.menuItems}>
                                <div className={styles.profileSection}>
                                    {user?.user_metadata?.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt="Profile"
                                            className={styles.profileImage}
                                        />
                                    ) : (
                                        <div className={styles.profilePlaceholder}>
                                            {user?.email?.[0]?.toUpperCase() || 'N/A'}
                                        </div>
                                    )}
                                    <div className={styles.profileInfo}>
                                        <div className={styles.profileName}>
                                            {user?.user_metadata?.full_name || user?.email || 'Please Sign In'}
                                        </div>
                                        <div className={styles.profileEmail}>
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                {user && (
                                    <div className={styles.menuSection}>
                                        <TokenUsage className={styles.tokenUsage} />
                                    </div>
                                )}

                                {user ? (
                                    <>
                                        <button onClick={() => navigate('/history')} className={styles.menuItem}>
                                            History
                                        </button>
                                        <button onClick={openSubscriptionModal} className={styles.menuItem}>
                                            <span>Upgrade Plan</span>
                                        </button>
                                        <button onClick={handleLogout} className={styles.menuItem}>
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => navigate('/auth/login')} className={styles.menuItem}>
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={closeSubscriptionModal}
            />
        </nav>
    );
};

export default Navbar; 