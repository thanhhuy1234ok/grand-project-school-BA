import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Kích hoạt plugin
dayjs.extend(customParseFormat);
export function formatToHHMMSS(timeString) {
  const time = dayjs(timeString, ['H:mm', 'HH:mm', 'H:mm:ss', 'HH:mm:ss']); // Kiểm tra nhiều định dạng
  return time.isValid() ? time : 'Invalid time';
}
