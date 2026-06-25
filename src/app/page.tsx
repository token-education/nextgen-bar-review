"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import { initialData } from "@/data/mockTopics";
import ChatTutor from "@/components/ChatTutor";
import { Search, Filter, Bot, ChevronDown, ChevronRight } from "lucide-react";
import { Topic, UserProgress } from "@/types";
import styles from "./page.module.css";

const parseSubject = (fullSubject: string) => {
  const parts = fullSubject.split(/ [-–] /);
  if (parts.length > 1) {
    return { main: parts[0].trim(), sub: parts[1].trim() };
  }
  return { main: fullSubject.trim(), sub: null };
};

export default function Home() {
  const [topics, setTopics] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [currentFilter, setCurrentFilter] = useState("Daily Deck");
  const [progress, setProgress] = useState<Record<number, UserProgress>>({});

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem("barExamProgress");
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const uniqueSubjects = ["Daily Deck", "All Subjects", ...Array.from(new Set(topics.map(t => parseSubject(t.subject).main)))].sort();

  const unmasteredTopics = topics.filter(t => !t.mastered);

  const filteredTopics = topics.filter(t => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      t.rule.toLowerCase().includes(query) || 
      t.subject.toLowerCase().includes(query) ||
      (t.trigger && t.trigger.toLowerCase().includes(query)) ||
      (t.notes && t.notes.toLowerCase().includes(query));
      
    let matchesFilter = true;
    if (currentFilter === "Daily Deck") {
      const p = progress[t.id];
      if (!p) {
        matchesFilter = true; // New cards are due
      } else {
        matchesFilter = new Date(p.nextReviewDate) <= new Date();
      }
    } else if (currentFilter !== "All Subjects") {
      matchesFilter = parseSubject(t.subject).main === currentFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const handleReview = (id: number, quality: number) => {
    setProgress(prev => {
      const current = prev[id] || { interval: 0, repetition: 0, efactor: 2.5, nextReviewDate: new Date().toISOString() };
      let { interval, repetition, efactor } = current;

      if (quality >= 3) {
        if (repetition === 0) {
          interval = 1;
        } else if (repetition === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * efactor);
        }
        repetition += 1;
      } else {
        repetition = 0;
        interval = 1;
      }

      efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (efactor < 1.3) efactor = 1.3;

      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + interval);

      const newState = {
        ...prev,
        [id]: {
          interval,
          repetition,
          efactor,
          nextReviewDate: nextReview.toISOString()
        }
      };
      
      localStorage.setItem("barExamProgress", JSON.stringify(newState));
      return newState;
    });
  };

  const toggleSubject = (subject: string) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  // Group by Main Subject -> Sub Subject
  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    const { main, sub } = parseSubject(topic.subject);
    if (!acc[main]) acc[main] = {};
    
    const subKey = sub || 'General';
    if (!acc[main][subKey]) acc[main][subKey] = [];
    
    acc[main][subKey].push(topic);
    return acc;
  }, {} as Record<string, Record<string, Topic[]>>);

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className="text-gradient">Master the NextGen Bar</h1>
          <p className={styles.subtitle}>
            Premium review cards tailored for comprehensive understanding and rapid recall.
          </p>
        </section>

        <section className={styles.controls}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search topics by rule or keyword..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className={styles.filterSelect}
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            {uniqueSubjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </section>

        <section className={styles.topicsSection}>
          {Object.entries(groupedTopics).map(([mainSubject, subGroups]) => {
            const isExpanded = expandedSubjects[mainSubject];
            return (
              <div key={mainSubject} className={styles.mainSubjectGroup}>
                <button 
                  className={styles.mainSubjectHeading}
                  onClick={() => toggleSubject(mainSubject)}
                  aria-expanded={isExpanded}
                >
                  {mainSubject}
                  {isExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                </button>
                
                {isExpanded && (
                  <div className={styles.subGroupsContainer}>
                    {Object.entries(subGroups).map(([subSubject, subjectTopics]) => (
                      <div key={subSubject} className={styles.subSubjectGroup}>
                        {subSubject !== 'General' && (
                          <h3 className={styles.subSubjectHeading}>{subSubject}</h3>
                        )}
                        <div className={styles.grid}>
                          {subjectTopics.map(topic => (
                            <ReviewCard 
                              key={topic.id} 
                              topic={{...topic, mastered: progress[topic.id]?.repetition > 2 }} 
                              onReview={handleReview}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredTopics.length === 0 && (
            <div className={styles.emptyState}>
              <p>No topics found for "{searchQuery}"</p>
            </div>
          )}
        </section>

        {!isChatOpen && (
          <button 
            className={styles.fab} 
            onClick={() => setIsChatOpen(true)}
            aria-label="Open AI Rule Drill"
          >
            <Bot size={24} />
            <span className={styles.fabText}>AI Rule Drill</span>
          </button>
        )}

        {isChatOpen && (
          <ChatTutor 
            unmasteredTopics={unmasteredTopics} 
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </main>
    </div>
  );
}
