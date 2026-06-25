"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ReviewCard from "@/components/ReviewCard";
import { initialData } from "@/data/mockTopics";
import ChatTutor from "@/components/ChatTutor";
import { Search, Filter, Bot } from "lucide-react";
import { Topic } from "@/types";
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

  const unmasteredTopics = topics.filter(t => !t.mastered);

  const filteredTopics = topics.filter(t => 
    t.rule.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMastered = (id: number) => {
    setTopics(topics.map(t => t.id === id ? { ...t, mastered: !t.mastered } : t));
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
          <button className={styles.filterBtn}>
            <Filter size={20} />
            Filter by Subject
          </button>
        </section>

        <section className={styles.topicsSection}>
          {Object.entries(groupedTopics).map(([mainSubject, subGroups]) => (
            <div key={mainSubject} className={styles.mainSubjectGroup}>
              <h2 className={styles.mainSubjectHeading}>{mainSubject}</h2>
              
              {Object.entries(subGroups).map(([subSubject, subjectTopics]) => (
                <div key={subSubject} className={styles.subSubjectGroup}>
                  {subSubject !== 'General' && (
                    <h3 className={styles.subSubjectHeading}>{subSubject}</h3>
                  )}
                  <div className={styles.grid}>
                    {subjectTopics.map(topic => (
                      <ReviewCard 
                        key={topic.id} 
                        topic={topic} 
                        onToggleMastered={handleToggleMastered}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

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
