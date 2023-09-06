import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IProduct } from 'app/shared/model/product.model';
import { RoutineType } from 'app/shared/model/enumerations/routine-type.model';

export interface IRoutine {
  id?: number;
  selectedDate?: string | null;
  routineType?: RoutineType | null;
  addedBy?: IUser | null;
  products?: IProduct[] | null;
}

export const defaultValue: Readonly<IRoutine> = {};
