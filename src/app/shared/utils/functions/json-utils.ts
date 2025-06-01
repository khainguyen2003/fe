// Chứa các hàm tiện ích liên quan đến JSON

/**
 * Chuyển một chuỗi JSON thành một đối tượng.
 * @param jsonString Chuỗi JSON đầu vào.
 * @returns Đối tượng được chuyển đổi từ chuỗi JSON.
 */
export function parseJsonToObject(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}
