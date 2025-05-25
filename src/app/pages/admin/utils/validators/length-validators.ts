import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator kiểm tra độ dài tối đa và yêu cầu giá trị.
 * @param errorMessage Thông báo lỗi.
 * @param maxLength Độ dài tối đa.
 * @returns ValidatorFn
 */
export function requiredMaxLengthValidator(
  errorMessage: string,
  maxLength: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { required: errorMessage };
    } else if (control.value.length > maxLength) {
      return { maxlength: `No more than ${maxLength} characters` };
    }
    return null;
  };
}

/**
 * Validator kiểm tra độ dài tối đa.
 * @param errorMessage Thông báo lỗi.
 * @param length Độ dài tối đa.
 * @returns ValidatorFn
 */
export function maxLength(errorMessage: string, length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } else if (control.value.length > length) {
      control.markAsTouched();
      return { maxlength: errorMessage };
    }
    return null;
  };
}

export function minLength(errorMessage: string, length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } else if (control.value.length < length) {
      control.markAsTouched();
      return { maxlength: errorMessage };
    }
    return null;
  };
}

export function exactlyLength(errorMessage: string, length1: number, length2: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    } else if (control.value.length !== length1 && control.value.length !== length2) {
      control.markAsTouched();
      return { maxlength: errorMessage };
    }
    return null;
  };
}

/**
 * Validate cho các input nhập số phải dùng maskito. value có thể chứa ký tự -, ',', '.'
 * @param errorMessage
 * @param length
 * @returns
 */
export function maxLengthWithInputNumber(
  length: number,
  errorMessage: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    } else {
      if (isNaN(parseFloat(value))) {
        throw new Error('Validator này chỉ được áp dụng cho input kiểu số');
      }
      // bỏ dấu âm
      const formattedValue = String(value).replace(/[^-]/, '');
      const integerPart = BigInt(formattedValue.split('.')[0]); // Phần nguyên
      const decimalPart = Number(
        formattedValue.includes('.') ? formattedValue.split('.')[1] : '0'
      ); // Phần thập phân

      return String(integerPart).length + String(decimalPart).length > length
        ? { maxlength: errorMessage }
        : null;
    }
  };
}
/**
 * Validate cho các input nhập có giá trị  -, ',', '.'
 * @param min
 * @param max
 * @returns
 */
export function rangeValidator(
  errorMessage: string,
  min: number,
  max: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      return { invalidNumber: 'Vui lòng nhập số hợp lệ' };
    }
    if (numericValue < min || numericValue > max) {
      return { outOfRange: errorMessage };
    }
    return null;
  };
}
//bắt nhập lớn hơn 0

export function minValue(min: number, errorMessage: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }
    const numericValue = +value;
    if (isNaN(numericValue) || numericValue <= min) {
      return { minValue: errorMessage };
    }
    return null;
  };
}

export function exaclyLengthValue(
  errorMessage: string,
  exactly: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control) {
      if (!control.value) {
        return null;
      }
      if (control?.value?.length !== exactly) {
        control.markAsTouched();
        return { exactlyLength: errorMessage };
      }
    }
    return null;
  };
}
