import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Routine from './routine';
import RoutineDetail from './routine-detail';
import RoutineUpdate from './routine-update';
import RoutineDeleteDialog from './routine-delete-dialog';

const RoutineRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Routine />} />
    <Route path="new" element={<RoutineUpdate />} />
    <Route path=":id">
      <Route index element={<RoutineDetail />} />
      <Route path="edit" element={<RoutineUpdate />} />
      <Route path="delete" element={<RoutineDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default RoutineRoutes;
