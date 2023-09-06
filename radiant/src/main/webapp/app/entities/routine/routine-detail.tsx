import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './routine.reducer';

export const RoutineDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const routineEntity = useAppSelector(state => state.routine.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="routineDetailsHeading">Routine</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{routineEntity.id}</dd>
          <dt>
            <span id="selectedDate">Selected Date</span>
          </dt>
          <dd>
            {routineEntity.selectedDate ? (
              <TextFormat value={routineEntity.selectedDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="routineType">Routine Type</span>
          </dt>
          <dd>{routineEntity.routineType}</dd>
          <dt>Added By</dt>
          <dd>{routineEntity.addedBy ? routineEntity.addedBy.login : ''}</dd>
          <dt>Product</dt>
          <dd>
            {routineEntity.products
              ? routineEntity.products.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {routineEntity.products && i === routineEntity.products.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/routine" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/routine/${routineEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default RoutineDetail;
