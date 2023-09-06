import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IRoutine } from 'app/shared/model/routine.model';
import { getEntities } from './routine.reducer';

export const Routine = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const routineList = useAppSelector(state => state.routine.entities);
  const loading = useAppSelector(state => state.routine.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="routine-heading" data-cy="RoutineHeading">
        Routines
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/routine/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Routine
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {routineList && routineList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Selected Date</th>
                <th>Routine Type</th>
                <th>Added By</th>
                <th>Product</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {routineList.map((routine, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/routine/${routine.id}`} color="link" size="sm">
                      {routine.id}
                    </Button>
                  </td>
                  <td>
                    {routine.selectedDate ? <TextFormat type="date" value={routine.selectedDate} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{routine.routineType}</td>
                  <td>{routine.addedBy ? routine.addedBy.login : ''}</td>
                  <td>
                    {routine.products
                      ? routine.products.map((val, j) => (
                          <span key={j}>
                            <Link to={`/product/${val.id}`}>{val.name}</Link>
                            {j === routine.products.length - 1 ? '' : ', '}
                          </span>
                        ))
                      : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/routine/${routine.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/routine/${routine.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/routine/${routine.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Routines found</div>
        )}
      </div>
    </div>
  );
};

export default Routine;
