import * as date from './date';
import * as math from './math';
import * as logic from './logic';
import * as text from './text';

import { DataType } from './DataType';

export const formulaType: Record<string, (...args: any) => DataType> = {
  ...date,
  ...math,
  ...logic,
  ...text,
};
