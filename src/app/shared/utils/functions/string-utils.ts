// Chứa các hàm tiện ích liên quan để xử lý chuỗi

import { Option } from "../../../pages/admin/models/common.model";

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

export function generateSlug(name: string): string {
  let slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (slug.length > 100) {
    const cutIndex = slug.lastIndexOf('-', 100);
    slug = slug.slice(0, cutIndex !== -1 ? cutIndex : 100);
  }

  return slug.replace(/-+$/, '');
}