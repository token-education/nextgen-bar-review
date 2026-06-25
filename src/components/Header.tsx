import Link from "next/link";
import { BookOpen } from "lucide-react";
import styles from "./Header.module.css";
import clsx from "clsx";

export default function Header() {
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
        <button className={styles.btnSubscribe}>
          Subscribe
        </button>
      </nav>
    </header>
  );
}
