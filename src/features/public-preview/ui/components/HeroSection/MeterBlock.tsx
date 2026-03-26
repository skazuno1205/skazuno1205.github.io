import type { Meter } from "../../../model/portfolioData";
import { cn } from "../../utils/cn";
import styles from "./HeroSection.module.css";

type MeterBlockProps = {
  meter: Meter;
  meterAnimated: boolean;
};

function MeterTrack({
  fillClassName,
  meterAnimated,
  width,
}: Pick<Meter, "fillClassName" | "width"> & { meterAnimated: boolean }) {
  const meterFillClassNames = {
    expFill: styles.expFill,
    hpFill: styles.hpFill,
    magicFill: styles.magicFill,
  } as const;

  return (
    <div className={styles.meterTrack}>
      <span
        className={cn(
          styles.meterFill,
          fillClassName ? meterFillClassNames[fillClassName] : undefined,
        )}
        style={{
          width: meterAnimated ? `${width}%` : "0%",
        }}
      />
    </div>
  );
}

export function BuildTimeMeter({ meter, meterAnimated }: MeterBlockProps) {
  return (
    <div className={styles.meterBlock}>
      <p className={styles.meterTitle}>{meter.label}</p>
      {meter.valueLabel ? (
        <p className={styles.meterValue}>{meter.valueLabel}</p>
      ) : null}
      <MeterTrack
        fillClassName={meter.fillClassName}
        meterAnimated={meterAnimated}
        width={meter.width}
      />
    </div>
  );
}

export function CareerMeter({ meter, meterAnimated }: MeterBlockProps) {
  return (
    <div className={styles.meterBlock}>
      <p className={styles.meterTitle}>{meter.label}</p>
      <div className={styles.meterMetaRow}>
        {meter.levelLabel ? (
          <span className={styles.meterMetaPrimary}>{meter.levelLabel}</span>
        ) : null}
        {meter.progressLabel ? (
          <span className={styles.meterMetaSecondary}>
            {meter.progressLabel}
          </span>
        ) : null}
      </div>
      <MeterTrack
        fillClassName={meter.fillClassName}
        meterAnimated={meterAnimated}
        width={meter.width}
      />
      {meter.nextLevelLabel ? (
        <p className={styles.meterSupportingText}>{meter.nextLevelLabel}</p>
      ) : null}
    </div>
  );
}
