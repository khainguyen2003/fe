import { formatDate } from "@angular/common";

/**
 * Chuyển đổi một chuỗi date thành đối tượng Date.
 * @param dateString Chuỗi date.
 * @param dateFomat Định dạng date.
 * @returns Đối tượng Date.
 */

import { FormGroup } from '@angular/forms';
import { TuiDay, TuiTime } from "@taiga-ui/cdk/date-time";
import { AddEditType } from "../constants";
import { ADD_EDIT_TYPE_ENUM, DATE_FORMAT_ENUM } from "../enums/common.enums";

export function parseDate(
  dateString: string,
  dateFomat: DATE_FORMAT_ENUM
): TuiDay | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  if (dateFomat === DATE_FORMAT_ENUM.DD_MM_YYYY) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new TuiDay(year, month - 1, day);
  }
  if (dateFomat === DATE_FORMAT_ENUM.YYYY_MM_DD) {
    const [year, month, day] = dateString.split('/').map(Number);
    return new TuiDay(year, month - 1, day);
  }
  if (dateFomat === DATE_FORMAT_ENUM.DD_MM_YYYY_DASH) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new TuiDay(year, month - 1, day);
  }
  if (dateFomat === DATE_FORMAT_ENUM.YYYY_MM_DD_DASH) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new TuiDay(year, month - 1, day);
  }
  if (dateFomat === DATE_FORMAT_ENUM.DD_MM_YYYY_HH_MM_SS) {
    const [day, month, year] = dateString.split(' ')[0].split('-').map(Number);
    return new TuiDay(year, month - 1, day);
  }
  return null;
}

export function parseEffectiveDate(date: any): any {
  if (!date) return null;
  if (typeof date === 'string') {
    return parseDate(date, DATE_FORMAT_ENUM.DD_MM_YYYY);
  } else if (date instanceof Date) {
    return new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
  }
  return null;
}

export function handleEffectiveDateChange(
  value: [TuiDay, TuiTime] | null
): [TuiDay, TuiTime] | null {
  if (value?.[0] && value[1] === null) {
    value[1] = new TuiTime(0, 0, 0, 0);
  }
  return value;
}

export function handleEndEffectiveDateChange(
  value: [TuiDay, TuiTime] | null
): [TuiDay, TuiTime] | null {
  if (value?.[0] && value[1] === null) {
    value[1] = new TuiTime(0, 0, 0, 0);
  }
  return value;
}

/**
 * Chuyển đổi một đối tượng Date thành chuỗi.
 * @param date đối tượng date.
 * @param dateFormat Định dạng date.
 * @returns chuỗi date có định dạng dateFormat.
 */

export function formatDateUtils(
  date: TuiDay,
  dateFormat: DATE_FORMAT_ENUM
): string {
  if (
    !date ||
    typeof date !== 'object' ||
    !('year' in date && 'month' in date && 'day' in date)
  ) {
    return '';
  }

  const dd = String(date.day).padStart(2, '0');
  const mm = String(date.month + 1).padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
  const yyyy = date.year;

  if (dateFormat === DATE_FORMAT_ENUM.DD_MM_YYYY) {
    return `${dd}/${mm}/${yyyy}`;
  }
  if (dateFormat === DATE_FORMAT_ENUM.YYYY_MM_DD) {
    return `${yyyy}/${mm}/${dd}`;
  }
  if (dateFormat === DATE_FORMAT_ENUM.DD_MM_YYYY_DASH) {
    return `${dd}-${mm}-${yyyy}`;
  }
  if (dateFormat === DATE_FORMAT_ENUM.YYYY_MM_DD_DASH) {
    return `${yyyy}-${mm}-${dd}`;
  }
  if (dateFormat === DATE_FORMAT_ENUM.DD_MM_YYYY_HH_MM_SS) {
    return `${dd}-${mm}-${yyyy} 00:00:00`;
  }

  return '';
}

/**
 * Chuyển đổi một đối tượng Date thành chuỗi.
 * @param date đối tượng date.
 * @param dateFormat Định dạng date.
 * @returns chuỗi date có định dạng dateFormat.
 */

export function formatDateTimeUtils(
  dateTime: [TuiDay, TuiTime],
  dateFormat: DATE_FORMAT_ENUM
): any {
  if (dateTime === null || dateTime[0] === null) {
    return null;
  }

  const dd = String(dateTime[0].day).padStart(2, '0');
  const mm = String(dateTime[0].month + 1).padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
  const yyyy = dateTime[0].year;
  if (dateTime[1] === null) {
    dateTime[1] = new TuiTime(0, 0, 0, 0);
  }

  const hours = dateTime[1] ? String(dateTime[1].hours).padStart(2, '0') : '00';
  const minutes = dateTime[1]
    ? String(dateTime[1].minutes).padStart(2, '0')
    : '00';
  const seconds = dateTime[1]
    ? String(dateTime[1].seconds).padStart(2, '0')
    : '00';

  if (dateFormat === DATE_FORMAT_ENUM.DD_MM_YYYY_HH_MM_SS_DASH) {
    return `${dd}/${mm}/${yyyy} ${hours}:${minutes}:${seconds}`;
  }

  return null;
}

export function parseDateTime(
  dateString: string,
  dateFomat: DATE_FORMAT_ENUM
): [TuiDay, TuiTime] | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  if (dateFomat === DATE_FORMAT_ENUM.DD_MM_YYYY_HH_MM_SS_DASH) {
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart || !timePart) return null;

    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      isNaN(hours) ||
      isNaN(minutes) ||
      isNaN(seconds)
    ) {
      return null;
    }

    return [
      new TuiDay(year, month - 1, day), // month - 1 vì JS Date month là 0-11
      new TuiTime(hours, minutes, seconds),
    ];
  }

  return null;
}

/**
 * Author: Khai_llq, An_llq, Dai_llq
 * @param startDateTime
 * @param endDateTime
 * @returns
 */
export function compareDateTime(
  startDateTime: [TuiDay, TuiTime] | null,
  endDateTime: [TuiDay, TuiTime] | null,
  isIgnoreTime = false
): number {
  if (startDateTime === null || endDateTime === null) {
    return -1;
  }
  const startDate = startDateTime[0];
  let startTime = startDateTime[1];
  const endDate = endDateTime[0];
  let endTime = endDateTime[1];
  if (startDate === null || endDate === null) {
    return -1;
  }
  startTime ??= new TuiTime(0, 0, 0, 0);

  endTime ??= new TuiTime(0, 0, 0, 0);
  if (startDate.dayBefore(endDate)) {
    return -1;
  } else if (startDate.dayAfter(endDate)) {
    return 1;
  } else {
    if (isIgnoreTime) {
      return 0;
    }
    const startTimeNumber = Number(parseToSeconds(startTime));
    const endTimeNumber = Number(parseToSeconds(endTime));

    return startTimeNumber - endTimeNumber;
  }
}
/**
 * Chuyển đổi một đối tượng Time thành chuỗi.
 * @param time đối tượng time.
 * @returns Chuỗi time có định dạng hh:mm:ss.
 */
export function formatTimeUtils(time: any): string {
  if (!time) return '00:00:00'; // Mặc định nếu không có giá trị

  // Nếu time là object { hours, minutes, seconds }
  if (
    typeof time === 'object' &&
    'hours' in time &&
    'minutes' in time &&
    'seconds' in time
  ) {
    const hh = String(time.hours).padStart(2, '0');
    const mm = String(time.minutes).padStart(2, '0');
    const ss = String(time.seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return '00:00:00';
}

/**
 * Chuyển đổi một đối tượng Time thành chuỗi.
 * @param time đối tượng time.
 * @returns Chuỗi time có định dạng hh:mm:ss.
 */
export function formatTimeWithoutSeconds(time: any): string {
  if (!time) return "00:00"; // Mặc định nếu không có giá trị

  // Nếu time là object { hours, minutes, seconds }
  if (typeof time === "object" && "hours" in time && "minutes" in time) {
      const hh = String(time.hours).padStart(2, "0");
      const mm = String(time.minutes).padStart(2, "0");
      return `${hh}:${mm}`;
  }
  return "00:00";
}

/**
 * Chuyển đổi một đối tượng date thành ngày mặc định.
 * @param date đối tượng date.
 * @returns Date có định dạng mặc định.
 */
export function formatDateToUtils(date: any): Date | null {
  if (!date) return null;

  if (
    typeof date === 'object' &&
    'year' in date &&
    'month' in date &&
    'day' in date
  ) {
    return new Date(date.year, date.month, date.day); // Tháng trong JS bắt đầu từ 0
  }
  return null;
}

/**
 * Chuyển đổi kiểu date thành chuỗi.
 * @param date.
 * @returns Chuỗi ngày theo định dạng pattern.
 */
export function convertDateToStr(date: Date, pattern: string) {
  if (!date) return null;

  return formatDate(date, pattern, 'en-US');
}

/**
 * Chuyển đổi một chuỗi time có dạng hh:mm:ss về đối tượng.
 * @param timeString Chuỗi thời gian.
 * @returns Thời gian có định dạng là đối tượng.
 */
export function parseTime(timeString: string): TuiTime | null {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    isNaN(seconds) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null;
  }

  return new TuiTime(hours, minutes, seconds);
}

/**
 * Chuyển đổi một đối tượng thời gian thành tổng số giây.
 * @param time Đối tượng thời gian.
 * @returns Tổng số giây.
 */
export function parseToSeconds(
  time: { hours: number; minutes: number; seconds: number } | null | undefined
): number | null {
  // Kiểm tra nếu time là null hoặc undefined
  if (!time) {
    return null;
  }

  // Kiểm tra nếu giá trị không hợp lệ
  if (
    isNaN(time.hours) ||
    isNaN(time.minutes) ||
    isNaN(time.seconds) ||
    time.hours < 0 ||
    time.hours > 23 ||
    time.minutes < 0 ||
    time.minutes > 59 ||
    time.seconds < 0 ||
    time.seconds > 59
  ) {
    return null; // Trả về null nếu object không hợp lệ
  }

  // Chuyển đổi thành tổng số giây
  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

export function hasDateChanged(
  initData: any,
  form: FormGroup<any>,
  type: AddEditType = ADD_EDIT_TYPE_ENUM.CREATE
): boolean {
  if (!initData || !form) {
    return false;
  }
  // chỉ check khi isDisplay = 2 và cập nhật
  if (!(type === ADD_EDIT_TYPE_ENUM.UPDATE && initData?.isDisplay === 2)) {
    return false;
  }
  // Lấy giá trị [TuiDay, TuiTime] từ form (có thể null)
  const formDayTime: [TuiDay, TuiTime] | null = form.get('effectiveDate')?.value as
    | [TuiDay, TuiTime]
    | null;
  const formEndDayTime: [TuiDay, TuiTime] | null = form.get('endEffectiveDate')?.value as
    | [TuiDay, TuiTime]
    | null;

  // Lấy giá trị gốc từ initData (giả định đã là [TuiDay, TuiTime])
  const originalDayTime: [TuiDay, TuiTime] | null = initData.effectiveDate
    ? parseDateTime(
        initData?.effectiveDate,
        DATE_FORMAT_ENUM.DD_MM_YYYY_HH_MM_SS_DASH
      )
    : null;
  const originalEndDayTime: [TuiDay, TuiTime] | null =
    initData.endEffectiveDate
      ? parseDateTime(
          initData?.endEffectiveDate,
          DATE_FORMAT_ENUM.DD_MM_YYYY_HH_MM_SS_DASH
        )
      : null;
  if (!originalDayTime) {
    return false;
  }
  // So sánh giờ
  const isTimeEqual = (a: TuiTime, b: TuiTime) =>
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    (a.seconds ?? 0) === (b.seconds ?? 0);

  // 5. Kiểm thay đổi
  const effectiveChanged =
    (originalDayTime === null && formDayTime !== null) ||
    (originalDayTime !== null && formDayTime === null) ||
    (originalDayTime !== null &&
      formDayTime !== null &&
      (!formDayTime[0].daySame(originalDayTime[0]) ||
        !isTimeEqual(formDayTime[1], originalDayTime[1])));

  const endEffectiveChanged =
    (originalEndDayTime === null && formEndDayTime !== null) ||
    (originalEndDayTime !== null && formEndDayTime === null) ||
    (originalEndDayTime !== null && formEndDayTime !== null &&
      (!formEndDayTime[0].daySame(originalEndDayTime[0]) ||
        !isTimeEqual(formEndDayTime[1], originalEndDayTime[1])));

  return effectiveChanged || endEffectiveChanged;
}
