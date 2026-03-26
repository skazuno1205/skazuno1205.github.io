import type { Meter, StatusCard } from "../../../model/portfolioData";
import { cn } from "../../utils/cn";
import baseStyles from "../PortfolioBase.module.css";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  meterAnimated: boolean;
  meters: Meter[];
  onOpenSkyModal: () => void;
  statusCards: StatusCard[];
  typewriterMessage: string;
};

export function HeroSection({
  meterAnimated,
  meters,
  onOpenSkyModal,
  statusCards,
  typewriterMessage,
}: HeroSectionProps) {
  const meterFillClassNames = {
    expFill: styles.expFill,
    hpFill: styles.hpFill,
    magicFill: styles.magicFill,
  } as const;

  return (
    <section className={cn(styles.hero, baseStyles.section)} id="top">
      <div className={cn(styles.heroHud, baseStyles.panel, baseStyles.reveal)}>
        <p className={baseStyles.systemLabel}>PORTFOLIO OVERVIEW</p>
        <div className={styles.heroTitleWrap}>
          <p className={baseStyles.heroKicker}>SHOTA KAZUNO PORTFOLIO</p>
          <h1 className={styles.heroTitle}>Shota Kazuno</h1>
          <p className={styles.heroSubtitle}>
            数野 翔太 / Frontend Engineer / Hardware Engineer / kutsulab CTO
          </p>
        </div>

        <div className={styles.heroStatusGrid}>
          {statusCards.map((card) => (
            <div key={card.label} className={styles.statusCard}>
              <span className={baseStyles.statusCardLabel}>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>

        <div className={styles.meterGroup}>
          {meters.map((meter) => (
            <div key={meter.label}>
              <div className={styles.meterTopline}>
                <span>{meter.label}</span>
                <span>{meter.valueLabel}</span>
              </div>
              <div className={styles.meterTrack}>
                <span
                  className={cn(
                    styles.meterFill,
                    meter.fillClassName
                      ? meterFillClassNames[meter.fillClassName]
                      : undefined,
                  )}
                  style={{
                    width: meterAnimated ? `${meter.width}%` : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={cn(baseStyles.panel, baseStyles.panelInner)}>
          <div className={styles.questFeedRow}>
            <span>LOG</span>
            <span>PROFILE ACTIVE</span>
          </div>
          <p className={styles.systemMessage}>{typewriterMessage}</p>
        </div>

        <div className={styles.heroActions}>
          <button
            className={cn(baseStyles.pixelBtn, baseStyles.pixelBtnGhost)}
            onClick={onOpenSkyModal}
            type="button"
          >
            CHANGE SKY
          </button>
        </div>
      </div>
    </section>
  );
}
