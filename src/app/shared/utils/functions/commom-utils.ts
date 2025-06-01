// kiểm tra một giá trị có nằm trong một enum hay không

import { Option, TreeNode } from "../../../pages/admin/models/common.model";
import { ACTIVE_STATUS, DISPLAY_STATUS, PARAM_STATUS } from "../../constants/constants";

export function isEnumValue<T extends Record<string, any>>(
  value: any,
  enumType: T
): boolean {
  return Object.values(enumType).includes(value as T[keyof T]);
}

export function findOptionByValue(
  source: { value: string; label: string }[],
  value: string | number | null | undefined
): { value: string; label: string } | null {
  if (source === null || source === undefined || source.length === 0) {
    if (value === null || value === undefined) {
      return null;
    }
    return { value: value.toString(), label: '' };
  }
  if (value === null || value === undefined) {
    return null;
  }
  const item = source.find((item) => item.value === value.toString());

  if (item === undefined) {
    return { value: value.toString(), label: '' };
  }
  return item; // nếu không tìm thấy thì find sẽ trả về undefined chứ không phải null
}

export function convertObjectArrayToValueString(value: string) {
  return { value: value.toString(), label: '' };
}

export function convertStringToArrayOption(
  source: { value: string; label: string }[],
  value: string | undefined | null
): { value: string; label: string }[] | null {
  if (value === null || value === undefined) {
    return null;
  }
  const valuesArr = value.split(',');
  if (source === null || source === undefined || source.length === 0) {
    return valuesArr.map((item) => convertObjectArrayToValueString(item));
  }

  if (value === null || value === undefined) {
    return null;
  }
  const result = [] as { value: string; label: string }[];
  valuesArr.forEach((item) => {
    const foundItem = source.find(
      (sourceItem) => sourceItem.value === item.toString()
    );
    if (foundItem) {
      result.push(foundItem);
    } else {
      result.push(convertObjectArrayToValueString(item)); // nếu không tìm thấy thì find sẽ trả về undefined chứ không phải null
    }
  });
  return result; // nếu không tìm thấy thì find sẽ trả về undefined chứ không phải null
}

/**
 * Làm phẳng cây dữ liệu (TreeNode) thành một mảng một chiều (không bao gồm node gốc).
 *
 * Hàm duyệt toàn bộ cây theo chiều sâu và thu thập tất cả các node con,
 * bỏ qua node gốc được truyền vào.
 *
 * @param item Node gốc cần làm phẳng (TreeNode)
 * @returns Mảng các node con ở mọi cấp dưới dạng phẳng
 *
 * @example
 * const node: TreeNode = {
 *   text: 'A',
 *   children: [
 *     { text: 'B' },
 *     {
 *       text: 'C',
 *       children: [{ text: 'D' }, { text: 'E' }],
 *     },
 *   ],
 * };
 *
 * flatten(node);
 * // Kết quả:
 * // [
 * //   { text: 'B' },
 * //   { text: 'D' },
 * //   { text: 'E' }
 * // ]
 */
export function flatten(item: TreeNode): readonly TreeNode[] {
  return item.children
      ? item.children.map(flatten).reduce((arr, item) => [...arr, ...item], [])
      : [item];
}


export class CommonUtils {
  public static getLabelOption(
    value: string,
    listOption: Option[]
  ): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    const item = listOption.find(
      (item) => item.value.toString() === value.toString()
    );
    return item ? item.label : '';
  }

  public static getStatusLabel(value: string): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    const item = PARAM_STATUS.find((item) => item.value === value.toString());
    return item ? item.label : '';
  }

  public static getDisplayLabel(value: string): string {
    if (value === undefined || value === null || value === '') {
      return '';
    }

    const items = DISPLAY_STATUS.find(
      (item) => item.value === value.toString()
    );
    return items ? items.label : '';
  }

  /**
   * Lấy nhãn hoạt động từ giá trị trạng thái hoạt động.
   * @param value Giá trị trạng thái hoạt động.
   * @returns Nhãn hoạt động tương ứng.
   */
  public static getActiveLabel(value: string) {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    const item = ACTIVE_STATUS.find((item) => item.value === value.toString());
    return item ? item.label : '';
  }
}
