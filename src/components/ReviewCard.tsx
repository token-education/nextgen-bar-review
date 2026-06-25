"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { Topic } from "@/types";
import styles from "./ReviewCard.module.css";
import clsx from "clsx";

interface ReviewCardProps {
  topic: Topic;
  onToggleMastered?: (id: number) => void;
}

export default function ReviewCard({ topic, onToggleMastered }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className={clsx(styles.card, {
        [styles.expanded]: isExpanded,
        [styles.cardMastered]: topic.mastered,
      })}
    >
      <div 
        className={styles.header} 
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
      >
        <div>
          <span className={styles.subjectBadge}>{topic.subject}</span>
          <h3 className={styles.title}>{topic.rule}</h3>
        </div>
        <div className={styles.expandIcon}>
          <ChevronDown size={24} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={styles.content}>
              <div className={styles.section}>
                <div className={styles.label}>Trigger Facts / When It Applies</div>
                <div className={styles.text}>{topic.trigger}</div>
              </div>
              <div className={styles.section}>
                <div className={styles.label}>What You Need to Know</div>
                <div className={styles.text}>{topic.notes}</div>
              </div>
              
              <div className={styles.actionRow}>
                <button 
                  className={clsx(styles.btnMastered, {
                    [styles.active]: topic.mastered
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleMastered) onToggleMastered(topic.id);
                  }}
                >
                  <CheckCircle2 size={16} />
                  {topic.mastered ? "Mastered" : "Mark as Mastered"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
