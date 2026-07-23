import { LinearGradient } from 'expo-linear-gradient';
import {
  CalendarDays,
  HeartPulse,
  Microscope,
  Pill,
  ShieldCheck,
} from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { CardBadge } from '@/components/home/CardBadge';
import { CardCta } from '@/components/home/CardCta';
import { CardEyebrow } from '@/components/home/CardEyebrow';
import { Fonts, Radius, Spacing, brandColors, profileColors } from '@/constants/theme';
import type { FeaturedItem } from '@/types/home';

type HomeFeaturedCardProps = {
  item: FeaturedItem;
};

const CARD_PADDING = 28;

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${formatTime(date)}`;
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${formatTime(date)}`;
  }

  return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}, ${formatTime(date)}`;
}

function getMinutesUntil(date: Date): number {
  return Math.max(0, Math.round((date.getTime() - Date.now()) / 60_000));
}

function formatDueIn(date: Date): string {
  const minutes = getMinutesUntil(date);

  if (minutes < 1) return 'Due now';
  if (minutes < 60) return `Due in ${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  return `Due in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
}

function AppointmentContent({ item }: { item: Extract<FeaturedItem, { kind: 'appointment' }> }) {
  return (
    <>
      <CardEyebrow icon={CalendarDays} label="Upcoming visit" />
      <View style={styles.body}>
        <Text style={styles.cardTitle}>{item.doctorName}</Text>
        <Text style={styles.cardDetail}>
          {[item.specialty, item.clinicName].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.cardTime}>{formatDate(item.dateTime)}</Text>
        <CardBadge label={item.status === 'confirmed' ? 'Confirmed' : 'Pending'} />
      </View>
      <CardCta label="View details" />
    </>
  );
}

function MedicationContent({ item }: { item: Extract<FeaturedItem, { kind: 'medication' }> }) {
  return (
    <>
      <CardEyebrow icon={Pill} label="Medication reminder" />
      <View style={styles.body}>
        <Text style={styles.cardTitle}>{item.medicineName}</Text>
        <Text style={styles.cardDetail}>
          {item.dosage} · {item.instruction}
        </Text>
      </View>
      <Text style={styles.cardUrgency}>{formatDueIn(item.dueAt)}</Text>
      <CardCta label="Mark as taken" />
    </>
  );
}

function LabReportContent({ item }: { item: Extract<FeaturedItem, { kind: 'lab-report' }> }) {
  return (
    <>
      <CardEyebrow icon={Microscope} label="Lab results" />
      <View style={styles.body}>
        <Text style={styles.cardTitle}>{item.testName}</Text>
        <Text style={styles.cardDetail}>{item.labName}</Text>
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.cardTime}>
          {item.availableOn ? formatReportDate(item.availableOn) : 'Ready to review'}
        </Text>
        {item.isNew && <CardBadge label="New" showDot />}
      </View>
      <CardCta label="View report" />
    </>
  );
}

function HealthReminderContent({ item }: { item: Extract<FeaturedItem, { kind: 'health-reminder' }> }) {
  return (
    <>
      <CardEyebrow icon={HeartPulse} label="Health reminder" />
      <View style={styles.body}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.body}</Text>
      </View>
      <CardCta label="View reminder" />
    </>
  );
}

function EmptyContent() {
  return (
    <>
      <CardEyebrow icon={ShieldCheck} label="All clear" />
      <View style={styles.body}>
        <Text style={styles.cardTitle}>Nothing needs your{'\n'}attention right now</Text>
        <Text style={styles.cardBody}>
          Your health records are safe and up to date.
        </Text>
      </View>
      <CardCta label="Book appointment" />
    </>
  );
}

function renderContent(item: FeaturedItem) {
  switch (item.kind) {
    case 'appointment':
      return <AppointmentContent item={item} />;
    case 'medication':
      return <MedicationContent item={item} />;
    case 'lab-report':
      return <LabReportContent item={item} />;
    case 'health-reminder':
      return <HealthReminderContent item={item} />;
    case 'empty':
      return <EmptyContent />;
  }
}

export function HomeFeaturedCard({ item }: HomeFeaturedCardProps) {
  return (
    <LinearGradient
      colors={[profileColors.tint, profileColors.sky, brandColors.white]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {renderContent(item)}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.large,
    gap: Spacing.three,
    overflow: 'hidden',
    padding: CARD_PADDING,
    shadowColor: profileColors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 28,
    elevation: 3,
  },
  body: {
    gap: Spacing.one,
  },
  cardTitle: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 28,
  },
  cardDetail: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
  },
  cardBody: {
    color: brandColors.slate,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: Spacing.one,
  },
  cardTime: {
    color: brandColors.primaryDark,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 20,
  },
  cardUrgency: {
    color: brandColors.primaryMuted,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 20,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
});

function formatReportDate(date: Date): string {
  return `Available ${date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })}`;
}
