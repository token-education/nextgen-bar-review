import styles from "../page.module.css";
import clsx from "clsx";

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Your <span className="text-gradient">Dashboard</span>
          </h1>
          <p className={styles.subtitle}>
            Track your progress, view mastered topics, and manage your study schedule.
          </p>
        </div>

        <div className={clsx(styles.statsGrid, "glass")}>
          <div style={{ padding: "4rem", textAlign: "center", width: "100%" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-primary)" }}>
              Coming Soon
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>
              The analytics dashboard is currently under development. Stay tuned!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
