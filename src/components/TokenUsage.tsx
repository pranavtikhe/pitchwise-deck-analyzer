import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import styles from '../styles/TokenUsage.module.scss';

interface TokenUsageProps {
    className?: string;
}

const TokenUsage: React.FC<TokenUsageProps> = ({ className }) => {
    const [tokens, setTokens] = useState<number>(0);
    const [totalTokens, setTotalTokens] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const supabase = getSupabaseClient();

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('user_tokens')
                        .select('tokens_used, total_tokens')
                        .eq('user_id', user.id)
                        .single();

                    if (error) {
                        if (error.code === '42P01') { // Table doesn't exist
                            setError('Token system is not set up yet');
                            return;
                        }
                        throw error;
                    }

                    if (data) {
                        setTokens(data.tokens_used || 0);
                        setTotalTokens(data.total_tokens || 0);
                    }
                }
            } catch (err) {
                console.error('Error fetching tokens:', err);
                setError('Failed to load token information');
            }
        };

        fetchTokens();
    }, [supabase]);

    const percentage = totalTokens > 0 ? (tokens / totalTokens) * 100 : 0;

    return (
        <div className={`${styles.tokenUsage} ${className || ''}`}>
            <div className={styles.tokenHeader}>
                <span className={styles.tokenLabel}>Tokens Used</span>
                {error ? (
                    <span className={styles.errorText}>{error}</span>
                ) : (
                    <span className={styles.tokenCount}>
                        {tokens.toLocaleString()} / {totalTokens.toLocaleString()}
                    </span>
                )}
            </div>
            {!error && (
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
};

export default TokenUsage; 