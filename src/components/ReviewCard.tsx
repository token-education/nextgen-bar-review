"use client";

import { useState } from "react";
import { CheckCircle2, RotateCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Topic } from "@/types";
import styles from "./ReviewCard.module.css";
import clsx from "clsx";

interface ReviewCardProps {
  topic: Topic;
  onReview?: (id: number, quality: number) => void;
}

export default function ReviewCard({ topic, onReview }: ReviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={styles.scene}>
      <div 
        className={clsx(styles.card, {
          [styles.isFlipped]: isFlipped,
          [styles.cardMastered]: topic.mastered,
        })}
      >
        {/* Front of the card */}
        <div 
          className={clsx(styles.cardFace, styles.cardFaceFront)}
          onClick={() => setIsFlipped(true)}
        >
          <div className={styles.cardHeader}>
            <span className={styles.subjectBadge}>{topic.subject}</span>
          </div>
          <div className={styles.cardBodyCenter}>
            <h3 className={styles.title}>{topic.question || topic.rule}</h3>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.flipHint}>
              <RotateCw size={16} />
              <span>Tap to flip</span>
            </div>
          </div>
        </div>

        {/* Back of the card */}
        <div className={clsx(styles.cardFace, styles.cardFaceBack)}>
          <div 
            className={styles.backContent}
            onClick={() => setIsFlipped(false)}
          >
            <div className={styles.section}>
              <div className={styles.label}>Trigger Facts / When It Applies</div>
              <div className={styles.formattedContent}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {topic.trigger}
                </ReactMarkdown>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.label}>What You Need to Know</div>
              <div className={styles.formattedContent}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {topic.notes}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          <div className={styles.actionRow}>
            <div className={styles.flipHint} onClick={() => setIsFlipped(false)}>
              <RotateCw size={16} />
              <span>Tap to flip back</span>
            </div>
            <div className={styles.buttonGroup} style={{display: 'flex', gap: '0.5rem'}}>
              <button 
                className={clsx(styles.btnReview, styles.btnNeedsReview)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onReview) onReview(topic.id, 2);
                }}
              >
                Needs Review
              </button>
              <button 
                className={clsx(styles.btnReview, styles.btnMastered)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onReview) onReview(topic.id, 5);
                }}
              >
                <CheckCircle2 size={16} />
                Mastered
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
