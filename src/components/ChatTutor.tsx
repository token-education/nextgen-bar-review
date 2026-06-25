"use client";

import { Topic } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2 } from 'lucide-react';
import styles from './ChatTutor.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatTutorProps {
  unmasteredTopics: Topic[];
  onClose: () => void;
}

export default function ChatTutor({ unmasteredTopics, onClose }: ChatTutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const hasInitialized = useRef(false);

  const fetchChat = async (currentMessages: Message[]) => {
    setIsLoading(true);
    try {
      // If there are no messages, we send an invisible prompt to kickstart the AI
      const payloadMessages = currentMessages.length === 0 
        ? [{ role: 'user', content: 'Start the blackletter law drill now.' }] 
        : currentMessages;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages, contextTopics: unmasteredTopics }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const text = chunk.replace(/^0:"(.*)"\n$/g, '$1').replace(/\\n/g, '\n').replace(/\\"/g, '"');
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId ? { ...m, content: m.content + text } : m
          ));
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Sorry, an error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    
    await fetchChat(newMessages);
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchChat([]);
    }
    // Trigger opening animation
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // wait for animation before unmounting
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`}>
      <div className={styles.backdrop} onClick={handleClose} />
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Bot size={24} className={styles.botIcon} />
            <h2>AI Tutor</h2>
          </div>
          <button onClick={handleClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.messagesContainer}>
          {messages.map(m => (
            <div key={m.id} className={`${styles.messageWrapper} ${m.role === 'user' ? styles.userWrapper : styles.assistantWrapper}`}>
              <div className={styles.avatar}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className={`${styles.messageWrapper} ${styles.assistantWrapper}`}>
              <div className={styles.avatar}>
                <Bot size={16} />
              </div>
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <Loader2 size={16} className={styles.spinner} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              className={styles.input}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask for a practice question..."
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
