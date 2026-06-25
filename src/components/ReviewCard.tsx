"use client";

import { useState } from "react";
import { CheckCircle2, RotateCw } from "lucide-react";
import { Topic } from "@/types";
import styles from "./ReviewCard.module.css";
import clsx from "clsx";

interface ReviewCardProps {
  topic: Topic;
  onToggleMastered?: (id: number) => void;
}

const renderText = (text: string) => {
  if (!text) return null;
  // Replace literal '\n' and actual newlines, and split by them
  const lines = text.split(/\\n|\n/);
  
  const formattedLines = lines.map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      return <li key={idx} className={styles.bullet}>{trimmed.substring(1).trim()}</li>;
    }
    if (trimmed.length > 0) {
      return <p key={idx} className={styles.paragraph}>{trimmed}</p>;
    }
    return null;
  }).filter(Boolean);

  // Check if we have bullets
  const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
  
  if (hasBullets) {
    return (
      <div className={styles.formattedContent}>
        {formattedLines.map((el, i) => {
          if (el?.type === 'li') {
             // group lis? For simplicity, we just render them
             return <ul key={i} className={styles.list}>{el}</ul>;
          }
          return el;
        })}
      </div>
    );
  }

  return <div className={styles.formattedContent}>{formattedLines}</div>;
};

export default function ReviewCard({ topic, onToggleMastered }: ReviewCardProps) {
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
            <h3 className={styles.title}>{topic.rule}</h3>
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
              {renderText(topic.trigger)}
            </div>
            <div className={styles.section}>
              <div className={styles.label}>What You Need to Know</div>
              {renderText(topic.notes)}
            </div>
          </div>

          <div className={styles.actionRow}>
            <div className={styles.flipHint} onClick={() => setIsFlipped(false)}>
              <RotateCw size={16} />
              <span>Tap to flip back</span>
            </div>
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
      </div>
    </div>
  );
}
