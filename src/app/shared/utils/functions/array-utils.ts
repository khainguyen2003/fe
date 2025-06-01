// Chứa các hàm tiện ích liên quan đến xử lý mảng với đầu vào là một mảng

import { Option } from '../../../pages/admin/models/common.model';
import { convertStringToArrayString } from './string-utils';

/**
 * Chuyển đổi một mảng các chuỗi thành một chuỗi, ngăn cách bởi dấu phẩy.
 * @param array Mảng các chuỗi.
 * @returns Chuỗi kết quả.
 */
export function convertArrayToString(array: string[] | number[]): string {
  if (!array || array.length === 0) {
    return '';
  }
  return array.join(',');
}

export function convertArrayToStringBySemicolon(
  array: string[] | number[]
): string {
  if (!array || array.length === 0) {
    return '';
  }
  return array.join(';');
}

/**
 * Chuyển đổi một mảng các đối tượng thành một chuỗi các value, ngăn cách bởi dấu phẩy.
 * @param array Mảng các đối tượng có thuộc tính value và label.
 * @returns Chuỗi các value, ngăn cách bởi dấu phẩy.
 */
export function convertObjectArrayToValueString(
  array: { value: string; label: string }[]
): string {
  if (!array || array.length === 0) {
    return '';
  }

  return array.map((item) => item.value).join(',');
}

export function convertObjectArrayToLabelString(
  array: { value: string; label: string }[]
): string {
  if (!array || array.length === 0) {
    return '';
  }

  return array.map((item) => item.label).join(',');
}

/**
 * Chuyển đổi một mảng các đối tượng thành một chuỗi các value, ngăn cách bởi dấu phẩy.
 * @param array Mảng các đối tượng có thuộc tính value và label.
 * @returns Chuỗi các value, ngăn cách bởi dấu phẩy.
 */
export function convertValueToArray(array: string[]): string {
  if (!array || array.length === 0) {
    return '';
  }

  return array.join(',');
}

/**
 * Chuyển đổi một mảng các đối tượng thành một chuỗi các value, ngăn cách bởi dấu phẩy.
 * @param array Mảng các đối tượng có thuộc tính value và label.
 * @returns Chuỗi các value, ngăn cách bởi dấu phẩy.
 */
export function convertObjectArrayToLableString(
  array: { value: string; label: string }[]
): string {
  if (!array || array.length === 0) {
    return '';
  }

  return array.map((item) => item.label).join(',');
}

/**
 * @param source Một mảng source dùng để có chứa tất cả các phần tử của mảng target không
 * @param target Một mảng target dùng để kiểm tra xem có chứa tất cả các phần tử của mảng source không
 * @returns
 */
export function isArrayInclude(source: number[], target: number[]): boolean {
  return source.every((item) => target.includes(item));
}

/**
 * Hàm lọc các option có value nằm trong danh sách value truyền vào
 * @param source Danh sách option
 * @param value các value được ngăn cách với nhau bằng dấu , <value1,value2,...>
 * @returns Danh sách option thỏa mãn
 * @author khainv_llq
 */
export function filterOptions(
  source: Option[],
  value: string | undefined
): Option[] {
  if (!source || value === null || value === undefined) {
    return [];
  }

  const values = convertStringToArrayString(value);

  return source.filter((item) => values.includes(item.value));
}
/**
 * Hàm tìm option có value giống value truyền vào
 * @param source Danh sách option
 * @param value
 * @returns Option thỏa mãn
 * @author khainv_llq
 */
export function findOption(
  source: Option[],
  value: string | undefined | null
): Option | null {
  if (!source || value === null || value === undefined) {
    return null;
  }

  return source.find((item) => value === item.value) || null; // nếu không tìm thấy thì find sẽ trả về undefined chứ không phải null
}

export function convertArrayToOptionEmptyLabel(
  value: string[] | null | undefined
): Option[] {
  if (value === null || value === undefined) {
    return [];
  }
  return value.map((item) => {
    return { value: item, label: '' };
  });
}

export function convertArrayToOptionEmptyValue(
  value: string[] | null | undefined
): Option[] {
  if (value === null || value === undefined) {
    return [];
  }
  return value.map((item) => {
    return { value: '', label: item };
  });
}

export function convertStringToOptionEmptyLabel(
  value: string | null | undefined
) {
  if (!value) return null;
  return { value: value, label: '' };
}

/**
 * Hàm tìm option có value giống value truyền vào và sort theo thứ tự của danh sách
 * @param source Danh sách option
 * @param value
 * @returns Option thỏa mãn
 * @author vietnd_llq
 */
export function convertObjectArrayToValueStringSort(
  array: { value: string; label: string }[],
  list: { value: string; label: string }[]
): string {
  if (!array || array.length === 0) return '';

  const sorted = list.filter((f) => array.find((a) => a.value === f.value));

  return sorted.map((item) => item.value).join(',');
}

export function convertArrayToOptionFromValueAndLabel(
  values: string[] | null | undefined,
  labels: string[] | null | undefined
): Option[] {
  if (!values || !labels || values.length !== labels.length) {
    return [];
  }

  return values.map((value, index) => ({
    value,
    label: labels[index],
  }));
}

/**
 * Hàm distinct dữ liệu trên giao diện
 * @param array là danh sách Option
 * @param field là value hoặc label tùy thuộc vào thuộc tính muốn distinct
 * @returns Option thỏa mãn
 * @author hai_llq
 */
export function distinctOption(
  array: Option[],
  field: 'value' | 'label'
): Option[] {
  const map = new Map();

  array.forEach((item: Option) => {
    // Kiểm tra xem item có tồn tại không trước khi truy cập thuộc tính
    if (item && !map.has(item[field])) {
      map.set(item[field], item);
    }
  });

  return Array.from(map.values());
}

/**
 * Chuyển input thành mảng number (long[])
 * - Hỗ trợ input là string: "1,2,3"
 * - Hỗ trợ input là array: [1, 2, "3"]
 * - Trả về null nếu không có phần tử hợp lệ
 */
export function toLongArray(input: any): number[] | null {
  if (!input) return null;

  let arr: any[] = [];

  if (Array.isArray(input)) {
    arr = input;
  } else if (typeof input === 'string') {
    arr = input.split(',');
  } else {
    arr = [input];
  }

  const result = arr
    .map((x) => Number(String(x).trim()))
    .filter((n) => !isNaN(n));

  return result.length > 0 ? result : null;
}