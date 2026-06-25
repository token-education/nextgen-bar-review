import React from 'react';
import styles from './SubscribeModal.module.css';
import { X, CheckCircle } from 'lucide-react';

interface SubscribeModalProps {
  onClose: () => void;
}

export default function SubscribeModal({ onClose }: SubscribeModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className={styles.title}>Unlock NextGen Bar Premium</h2>
        <p className={styles.subtitle}>
          Get full access to all 88+ NextGen topics, AI Rule Drills, and personalized progress tracking.
        </p>

        <div className={styles.pricing}>
          <span className={styles.currency}>$</span>
          <span className={styles.amount}>49</span>
          <span className={styles.period}>/mo</span>
        </div>

        <ul className={styles.features}>
          <li><CheckCircle size={18} className={styles.check} /> Full Core Doctrine Review Cards</li>
          <li><CheckCircle size={18} className={styles.check} /> Unlimited AI Chat Tutor Mode</li>
          <li><CheckCircle size={18} className={styles.check} /> Advanced Progress Tracking</li>
          <li><CheckCircle size={18} className={styles.check} /> Common Law vs. Modern Law distinctions</li>
        </ul>

        <button className={styles.checkoutBtn} onClick={() => {
            alert("This is a preview of the subscription flow! Stripe Checkout will be integrated here.");
            onClose();
        }}>
          Subscribe Now (Preview)
        </button>

        <p className={styles.disclaimer}>
          You will not be charged. This is a beta preview to ensure you can study for July uninterrupted.
        </p>
      </div>
    </div>
  );
}
