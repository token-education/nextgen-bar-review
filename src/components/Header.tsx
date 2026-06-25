"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import SubscribeModal from "./SubscribeModal";
import styles from "./Header.module.css";
import clsx from "clsx";

export default function Header() {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  return (
    <header className={clsx(styles.header, "glass")}>
      <Link href="/" className={styles.logo}>
        <BookOpen className="text-gradient" />
        <span>NextGen <span className="text-gradient">Bar Review</span></span>
      </Link>
      
      <nav className={styles.nav}>
        <Link href="/" className={clsx(styles.navLink, styles.active)}>
          Topics
        </Link>
        <Link href="/dashboard" className={styles.navLink}>
          Dashboard
        </Link>
        <button className={styles.btnSubscribe} onClick={() => setIsSubscribeOpen(true)}>
          Subscribe
        </button>
      </nav>
      {isSubscribeOpen && <SubscribeModal onClose={() => setIsSubscribeOpen(false)} />}
    </header>
  );
}
