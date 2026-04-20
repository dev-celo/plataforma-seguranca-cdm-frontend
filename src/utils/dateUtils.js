import { parseISO, addDays, differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FERIADOS_NACIONAIS = [
  '01-01', '04-21', '05-01', '09-07', '10-12', '11-02', '11-15', '12-25'
];

const FERIADOS_MOVEIS = {
  2024: ['02-13', '02-14', '03-29', '05-30'],
  2025: ['03-04', '03-05', '04-18', '06-19'],
};

export const isHoliday = (date) => {
  const monthDay = format(date, 'MM-dd');
  const year = date.getFullYear();
  
  if (FERIADOS_NACIONAIS.includes(monthDay)) return true;
  if (FERIADOS_MOVEIS[year]?.includes(monthDay)) return true;
  return false;
};

export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isWorkingDay = (date) => {
  return !isWeekend(date) && !isHoliday(date);
};

export const getWorkingDays = (startDate, endDate) => {
  let workingDays = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    if (isWorkingDay(current)) workingDays++;
    current = addDays(current, 1);
  }
  return workingDays;
};

export const getWorkingDaysInPeriod = (reports, startDate, endDate) => {
  const uniqueDates = new Set();
  reports.forEach(report => {
    const date = parseISO(report.createdAt);
    if (date >= startDate && date <= endDate && isWorkingDay(date)) {
      uniqueDates.add(format(date, 'yyyy-MM-dd'));
    }
  });
  return uniqueDates.size;
};

export const getMissingDaysInfo = (reports, startDate, endDate) => {
  const totalWorkingDays = getWorkingDays(startDate, endDate);
  const reportedDays = getWorkingDaysInPeriod(reports, startDate, endDate);
  
  return {
    totalWorkingDays,
    reportedDays,
    missingDays: totalWorkingDays - reportedDays,
    hasMissing: totalWorkingDays > reportedDays,
    percentage: totalWorkingDays > 0 ? (reportedDays / totalWorkingDays) * 100 : 0,
  };
};

export const formatDate = (date) => {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};