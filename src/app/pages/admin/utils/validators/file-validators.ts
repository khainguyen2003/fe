import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator kiểm tra kích thước tệp tin.
 * @param maxSize Kích thước tối đa.
 * @param errorMessage Thông báo lỗi.
 * @returns ValidatorFn
 */
export function fileSizeValidator(
  maxSize: number,
  errorMessage: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if (control.value.size > maxSize) {
      return { fileSize: errorMessage };
    }
    return null;
  };
}

/**
 * Validator kiểm tra loại tệp tin.
 * @param allowFile Danh sách các loại tệp tin cho phép.
 * @param message Thông báo lỗi.
 * @returns ValidatorFn
 */
export function fileTypeValidator(allowFile: string[], message: string) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const fileName = control.value.name;
    const fileExtension =
      fileName.lastIndexOf('.') !== -1
        ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
        : '';
    if (!allowFile.includes(fileExtension)) {
      return { fileType: message };
    }
    return null;
  };
}
