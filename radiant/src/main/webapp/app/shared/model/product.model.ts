import { IRoutine } from 'app/shared/model/routine.model';
import { ProductType } from 'app/shared/model/enumerations/product-type.model';
import { UsageType } from 'app/shared/model/enumerations/usage-type.model';

export interface IProduct {
  id?: number;
  name?: string | null;
  brand?: string | null;
  productType?: ProductType | null;
  imageContentType?: string | null;
  image?: string | null;
  usageType?: UsageType | null;
  routines?: IRoutine[] | null;
}

export const defaultValue: Readonly<IProduct> = {};
