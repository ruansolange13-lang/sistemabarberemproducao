import { AppointmentItem, ServiceItem } from '../types';

/**
 * Parses duration strings like "35 min", "45 min", "1h", "1h 15m", "1h 30min" into minutes.
 */
export function parseDurationToMinutes(durationStr?: string): number {
  if (!durationStr) return 45;

  const str = durationStr.toLowerCase().trim();

  // Pattern like "1h 15min" or "1h30" or "1h"
  const hourMatch = str.match(/(\d+)\s*h(?:oras?)?/);
  const minMatch = str.match(/(\d+)\s*m(?:in(?:utos?)?)?/);

  let total = 0;
  if (hourMatch) {
    total += parseInt(hourMatch[1], 10) * 60;
  }
  if (minMatch) {
    total += parseInt(minMatch[1], 10);
  }

  // If matched either hours or minutes
  if (total > 0) return total;

  // Standalone digits
  const plainNumber = parseInt(str.replace(/\D/g, ''), 10);
  if (!isNaN(plainNumber) && plainNumber > 0) {
    return plainNumber;
  }

  return 45; // Default fallback
}

/**
 * Calculates the total sum duration in minutes for a list of service IDs.
 */
export function calculateServicesDuration(
  serviceIds: string[],
  availableServices: ServiceItem[]
): number {
  if (!serviceIds.length) return 45;

  let totalMinutes = 0;
  for (const id of serviceIds) {
    const s = availableServices.find((item) => item.id === id);
    if (s) {
      totalMinutes += parseDurationToMinutes(s.duration);
    }
  }

  return totalMinutes > 0 ? totalMinutes : 45;
}

/**
 * Formats duration in minutes into a friendly string (e.g. "45 min" or "1h 15min").
 */
export function formatDurationFriendly(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) return `${hours}h`;
  return `${hours}h ${remMinutes}min`;
}

/**
 * Converts "HH:MM" string to total minutes from midnight (e.g. "15:30" -> 930).
 */
export function timeStringToMinutes(timeStr: string): number {
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Converts total minutes from midnight back to "HH:MM".
 */
export function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
}

/**
 * Computes end time string based on start time and duration (e.g. "15:00" + 45 -> "15:45").
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMins = timeStringToMinutes(startTime);
  const endMins = startMins + durationMinutes;
  return minutesToTimeString(endMins);
}

/**
 * Standard interval overlap test:
 * Two time intervals [A_start, A_end) and [B_start, B_end) overlap iff:
 * Math.max(A_start, B_start) < Math.min(A_end, B_end)
 */
export function doIntervalsOverlap(
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
): boolean {
  const endA = startA + durationA;
  const endB = startB + durationB;
  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * Matches flexible day labels between booking requests and appointment records.
 * Handles "Hoje", "Amanhã", "Segunda-feira", day keys like "qui-1", "sex-2", etc.
 */
export function isDayMatching(aptDayLabel: string, targetDay: string): boolean {
  if (!aptDayLabel || !targetDay) return false;
  const a = aptDayLabel.trim().toLowerCase();
  const b = targetDay.trim().toLowerCase();

  if (a === b) return true;

  // Handle aliases
  if (
    (a === 'hoje' && (b === 'qui-1' || b.includes('quinta') || b.includes('hoje'))) ||
    (b === 'hoje' && (a === 'qui-1' || a.includes('quinta') || a.includes('hoje')))
  ) {
    return true;
  }

  if (
    (a === 'amanhã' && (b === 'sex-2' || b.includes('sexta') || b.includes('amanhã'))) ||
    (b === 'amanhã' && (a === 'sex-2' || a.includes('sexta') || a.includes('amanhã')))
  ) {
    return true;
  }

  // Substring match for days like "seg", "ter", "qua", "qui", "sex", "sáb"
  const shortDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  for (const sd of shortDays) {
    if (a.includes(sd) && b.includes(sd)) {
      return true;
    }
  }

  return false;
}

export interface SlotAvailabilityResult {
  isAvailable: boolean;
  isOccupied: boolean;
  conflictReason?: string;
  conflictingAppointment?: AppointmentItem;
}

/**
 * Checks if a specific time slot is available for a given professional and day,
 * taking into account existing appointments, service duration, and payment status.
 *
 * CRITICAL RULE:
 * - When an appointment payment is confirmed (paymentStatus === 'PAGO' or status === 'confirmado'/'concluido'),
 *   the entire interval [start, start + duration) is locked.
 * - Another client CANNOT book during any overlapping time for that professional.
 * - If payment is NOT confirmed (paymentStatus === 'PENDENTE' and status !== 'confirmado'),
 *   the slot is NOT permanently blocked (as specified by commercial rule).
 */
export function checkSlotAvailability(params: {
  tenantId: string;
  professionalName?: string;
  professionalId?: string;
  dayLabel: string;
  timeSlot: string;
  durationMinutes: number;
  appointments: AppointmentItem[];
  manualBlockedSlots?: Record<string, string>; // e.g. "qui-1_12:00" -> "Almoço"
  dayKey?: string;
}): SlotAvailabilityResult {
  const {
    tenantId,
    professionalName,
    professionalId,
    dayLabel,
    timeSlot,
    durationMinutes,
    appointments,
    manualBlockedSlots,
    dayKey,
  } = params;

  // 1. Check manual blocked slot if provided
  if (manualBlockedSlots) {
    const keyWithDayKey = dayKey ? `${dayKey}_${timeSlot}` : null;
    const keyWithDayLabel = `${dayLabel}_${timeSlot}`;

    if (keyWithDayKey && manualBlockedSlots[keyWithDayKey]) {
      return {
        isAvailable: false,
        isOccupied: true,
        conflictReason: `Horário bloqueado (${manualBlockedSlots[keyWithDayKey]})`,
      };
    }
    if (manualBlockedSlots[keyWithDayLabel]) {
      return {
        isAvailable: false,
        isOccupied: true,
        conflictReason: `Horário bloqueado (${manualBlockedSlots[keyWithDayLabel]})`,
      };
    }
  }

  const slotStartMins = timeStringToMinutes(timeSlot);

  // 2. Filter relevant existing appointments for this tenant & day
  const relevantAppointments = appointments.filter((apt) => {
    if (apt.tenantId !== tenantId) return false;
    if (apt.status === 'cancelado' || apt.paymentStatus === 'CANCELADO') return false;

    // Day must match
    if (!isDayMatching(apt.dayLabel, dayLabel)) return false;

    // Professional must match
    if (professionalName && apt.professionalName) {
      if (
        apt.professionalName.trim().toLowerCase() !== professionalName.trim().toLowerCase() &&
        apt.professionalId !== professionalId
      ) {
        return false;
      }
    }

    // RULE: Only definitively blocks if payment was made (PAGO) or status is confirmed/concluded
    // If it's just PENDENTE without confirmation, it does not lock the slot permanently
    const isDefinitivelyBooked =
      apt.paymentStatus === 'PAGO' ||
      apt.status === 'confirmado' ||
      apt.status === 'concluido';

    return isDefinitivelyBooked;
  });

  // 3. Check for interval overlap
  for (const apt of relevantAppointments) {
    const aptStartMins = timeStringToMinutes(apt.timeSlot);
    const aptDuration = apt.durationMinutes || 45;

    const overlap = doIntervalsOverlap(
      slotStartMins,
      durationMinutes,
      aptStartMins,
      aptDuration
    );

    if (overlap) {
      const aptEnd = apt.endTimeSlot || calculateEndTime(apt.timeSlot, aptDuration);
      return {
        isAvailable: false,
        isOccupied: true,
        conflictReason: `Horário reservado (${apt.timeSlot} às ${aptEnd}) por ${apt.clientName} (PAGO)`,
        conflictingAppointment: apt,
      };
    }
  }

  return {
    isAvailable: true,
    isOccupied: false,
  };
}
