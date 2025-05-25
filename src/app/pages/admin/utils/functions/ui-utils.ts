import { TuiContext, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk/types';
import { Option } from '../../models/common.model';
import { translate, TranslocoService } from '@jsverse/transloco';

export const identityMatcher: TuiIdentityMatcher<{
  value: string;
  label: string;
}> = (item1, item2) => item1.value === item2.value;

export const identityMatcherLabel: TuiIdentityMatcher<{
  value: string;
  label: string;
}> = (item1, item2) => item1.label === item2.label;

export function filterValueSelect(item: Option, query: string) {
  return item?.value?.toLowerCase().includes(query.trim().toLowerCase());
}

export function filterLabelSelect(item: Option, query: string): boolean {
  return item?.label?.toLowerCase().includes(query.trim().toLowerCase());
}

export function filterValueAndLabelSelect(
  item: Option,
  query: string
): boolean {
  return (
    item?.value?.toLowerCase().includes(query.trim().toLowerCase()) ||
    item?.label?.toLowerCase().includes(query.trim().toLowerCase())
  );
}

// Những cái cần dùng chung không translate
export const stringifyLabelSelect: TuiStringHandler<Option> = (item) => item?.label ?? '';

export function stringifyLabelSelectHasTranslate(
  translateService: TranslocoService
): TuiStringHandler<Option> {
  return (item) => translateService.translate(item.label);
}

export const stringifyValueSelect: TuiStringHandler<Option> = (item) => item?.value ?? '';

export function stringifyValueLabelSelectHasTranslate(
  translateService: TranslocoService
): TuiStringHandler<Option> {
  return (item) => item.value + " - " + translateService.translate(item.label);
}

export function stringifySofS(
  items: ReadonlyArray<{ value: string; label: string }>
): TuiStringHandler<TuiContext<string>> {
  const map = new Map(
    items.map(({ value, label }) => [value, label] as [string, string])
  );
  return ({ $implicit }: TuiContext<string>) => map.get($implicit) || '';
}

export function stringifyStringArray(items: string): string {
  return items?.toString() || '';
}

export function searchSingleOptionByLabel(code: string | null, list: Option[]): Option[] {
  code = code ?? '';
  return list.filter((item) =>
    removeDiacritics(item.label).toLowerCase().includes(removeDiacritics(code!.toLowerCase()))
  );
}

export function searchSignleOptionByValue(
  code: string | null | undefined,
  list: Option[]
): Option | null {
  if (code === null || code === undefined || code === '') {
    return null;
  }
  const item =
    list.find((item) => item.value.toLowerCase() === code!.toLowerCase()) ??
    null;
  return item;
}

export function searchMultileOptionByValue(
  code: string | null | undefined,
  list: Option[]
): Option[] | null {
  if (code === null || code === undefined || code === '') {
    return null;
  }
  const codeArr = code.split(',');
  return list.filter((item) => codeArr.includes(item.value)) ?? null;
}

/**
 * Phương thức xóa các ký tự dấu tiếng việt trong chuỗi
 * @param search
 * @param list
 * @returns
 * @author khainv_llq
 */
export function removeDiacritics(str: string | null) {
  return (
    str
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D') ?? ''
  );
}
