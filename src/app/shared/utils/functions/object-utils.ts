// Chứa các hàm tiện ích liên quan đến xử lý một object có kiểu dữ liệu không xác định

/**
 * Đọc giá trị của một thuộc tính từ một đối tượng.
 * @param obj Đối tượng đầu vào.
 * @param field Tên thuộc tính.
 * @returns Giá trị của thuộc tính hoặc undefined nếu không tồn tại.
 */
export function getFieldValue<T, K extends keyof T>(
  obj: T,
  field: K
): T[K] | undefined {
  return obj[field];
}

/**
 * Lấy giá trị của một thuộc tính từ một mảng các đối tượng và trả về chuỗi phân tách bởi dấu phẩy.
 * @param arrayObj Mảng các đối tượng đầu vào.
 * @param key Tên thuộc tính.
 * @returns Chuỗi các giá trị của thuộc tính phân tách bởi dấu phẩy.
 */
export function getCommaSeparatedValues<T, K extends keyof T>(
  arrayObj: T[],
  field: K
): string | null {
  if (!arrayObj || arrayObj.length === 0) {
    return null;
  }
  return arrayObj.map((item) => item[field]).join(',');
}

export function getValueByLabel(
  label: string,
  array: { label: string; value: string }[]
): string | null {
  if (!array || array.length === 0) {
    return null;
  }
  return array.find((item) => item.label === label)?.value || null;
}
