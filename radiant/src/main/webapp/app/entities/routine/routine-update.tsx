import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { getEntities as getProducts } from 'app/entities/product/product.reducer';
import { IRoutine } from 'app/shared/model/routine.model';
import { RoutineType } from 'app/shared/model/enumerations/routine-type.model';
import { getEntity, updateEntity, createEntity, reset } from './routine.reducer';

export const RoutineUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const products = useAppSelector(state => state.product.entities);
  const routineEntity = useAppSelector(state => state.routine.entity);
  const loading = useAppSelector(state => state.routine.loading);
  const updating = useAppSelector(state => state.routine.updating);
  const updateSuccess = useAppSelector(state => state.routine.updateSuccess);
  const routineTypeValues = Object.keys(RoutineType);

  const handleClose = () => {
    navigate('/routine');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
    dispatch(getProducts({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...routineEntity,
      ...values,
      products: mapIdList(values.products),
      addedBy: users.find(it => it.id.toString() === values.addedBy.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          routineType: 'MORNING',
          ...routineEntity,
          addedBy: routineEntity?.addedBy?.id,
          products: routineEntity?.products?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="radiantRoutineApp.routine.home.createOrEditLabel" data-cy="RoutineCreateUpdateHeading">
            Create or edit a Routine
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="routine-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Selected Date" id="routine-selectedDate" name="selectedDate" data-cy="selectedDate" type="date" />
              <ValidatedField label="Routine Type" id="routine-routineType" name="routineType" data-cy="routineType" type="select">
                {routineTypeValues.map(routineType => (
                  <option value={routineType} key={routineType}>
                    {routineType}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField id="routine-addedBy" name="addedBy" data-cy="addedBy" label="Added By" type="select">
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField label="Product" id="routine-product" data-cy="product" type="select" multiple name="products">
                <option value="" key="0" />
                {products
                  ? products.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/routine" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RoutineUpdate;
