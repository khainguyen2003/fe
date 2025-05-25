// Chứa các hàm tiện ích liên quan để xử lý chuỗi

import { Option } from '../../models/common.model';

/**
 * Chuyển đổi một chuỗi thành một mảng các chuỗi, ngăn cách bởi dấu phẩy.
 * @param text Chuỗi đầu vào.
 * @returns Mảng các chuỗi.
 */
export function convertStringToArrayString(text: string | null): string[] {
  if (!text || text === '') {
    return [];
  }
  return text.split(',');
}

export function convertStringToOption(
  value: string | undefined | null
): Option | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return {
    label: '',
    value: value,
  };
}

export function convertStringToOptionLabel(
  value: string | undefined | null
): Option | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return {
    label: value.trim(),
    value: '',
  };
}

export function findAndConvertStringToOption(
  value: string | undefined | null,
  list: Option[]
): Option | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const item =
    list.find((item) => item.value.toLowerCase() === value!.toLowerCase()) ??
    null;
  if (item === undefined || item === null) {
    return {
      label: '',
      value: value,
    };
  }
  return item;
}

export function findAndConvertStringToOptionLableValue(
  value: string | undefined | null,
  label: string,
  list: Option[]
): Option | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const item =
    list.find((item) => item.value.toLowerCase() === value!.toLowerCase()) ??
    null;
  if (item === undefined || item === null) {
    return {
      label: label,
      value: value,
    };
  }
  return item;
}

export function findAndConvertStringWithLableToOption(
  value: string | undefined | null,
  label: string | undefined | null,
  list: Option[]
): Option | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const item =
    list.find((item) => item.value.toLowerCase() === value!.toLowerCase()) ??
    null;
  if (item === undefined || item === null) {
    return {
      label: label ?? '',
      value: value,
    };
  }
  return item;
}

export function convertStringToOptionList(
  value: string | undefined | null
): Option[] {
  if (value === undefined || value === null || value === '') {
    return [];
  }
  const list: string[] = value!.split(',');
  return list.map((item) => ({
    label: '',
    value: item.trim(),
  }));
}

export function convertStringToOptionLabelList(
  value: string | undefined | null
): Option[] {
  if (value === undefined || value === null || value === '') {
    return [];
  }
  const list: string[] = value!.split(',');
  return list.map((item) => ({
    label: item.trim(),
    value: '',
  }));
}
