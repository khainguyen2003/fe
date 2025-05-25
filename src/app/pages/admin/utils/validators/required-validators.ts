import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator kiểm tra giá trị không rỗng
 * @param errorMessage Thông báo lỗi.
 * @returns ValidatorFn
 */
export function required(errorMessage: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      //  control.markAsTouched();
      return { required: errorMessage };
    }
    const temp = control.value + '';
    if (temp.trim() === '') {
      // control.markAsTouched();
      return { specialChars: errorMessage };
    }
    return null;
  };
}

/**
 * Validator kiểm tra mảng không rỗng.
 * @param errorMessage Thông báo lỗi.
 * @returns ValidatorFn
 */
export function requiredArrayNotEmptyValidator(
  errorMessage: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.length == 0) {
      return { required: errorMessage };
    }
    return null;
  };
}

/**
 * Validator kiểm tra tệp tin bắt buộc.
 * @param errorMessage Thông báo lỗi.
 * @returns ValidatorFn
 */
export function requiredFileValidator(errorMessage: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (!file || file.length === 0) {
      return { requiredFile: errorMessage };
    }
    return null;
  };
}

/**
 * Kiểm tra giá trị bắt buộc ngoại trừ giá trị là có kiểu là số (=0)
 * @param errorMessage
 * @returns ValidatorFn
 */
export function requiredNumber(errorMessage: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value === null ||
      control.value === undefined ||
      control.value === ''
    ) {
      return { specialChars: errorMessage };
    }
    return null;
  };
}


 /**
   * Validator kiểm tra định dạng email
   * @param errorMessage Thông báo lỗi khi email không hợp lệ hoặc để trống
   * @returns ValidatorFn
   */
 export function emailValidator(errorMessage: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Kiểm tra giá trị rỗng
    if (!control.value) {
      return { required: errorMessage };
    }

    // Chuyển giá trị thành chuỗi và loại bỏ khoảng trắng
    const value = String(control.value).trim();

    // Kiểm tra giá trị rỗng sau khi loại bỏ khoảng trắng
    if (value === '') {
      return { required: errorMessage };
    }

    // Biểu thức chính quy để kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Kiểm tra định dạng email
    if (!emailPattern.test(value)) {
      return { invalidEmail: errorMessage };
    }

    return null;
  };

}

