import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IRoutine } from 'app/shared/model/routine.model';
import { getEntities as getRoutines } from 'app/entities/routine/routine.reducer';
import { IProduct } from 'app/shared/model/product.model';
import { ProductType } from 'app/shared/model/enumerations/product-type.model';
import { UsageType } from 'app/shared/model/enumerations/usage-type.model';
import { getEntity, updateEntity, createEntity, reset } from './product.reducer';

export const ProductUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const routines = useAppSelector(state => state.routine.entities);
  const productEntity = useAppSelector(state => state.product.entity);
  const loading = useAppSelector(state => state.product.loading);
  const updating = useAppSelector(state => state.product.updating);
  const updateSuccess = useAppSelector(state => state.product.updateSuccess);
  const productTypeValues = Object.keys(ProductType);
  const usageTypeValues = Object.keys(UsageType);

  const handleClose = () => {
    navigate('/product');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getRoutines({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...productEntity,
      ...values,
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
          productType: 'TONER',
          usageType: 'CURRENTLY_USING',
          ...productEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="radiantRoutineApp.product.home.createOrEditLabel" data-cy="ProductCreateUpdateHeading">
            Create or edit a Product
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="product-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Name" id="product-name" name="name" data-cy="name" type="text" />
              <ValidatedField label="Brand" id="product-brand" name="brand" data-cy="brand" type="text" />
              <ValidatedField label="Product Type" id="product-productType" name="productType" data-cy="productType" type="select">
                {productTypeValues.map(productType => (
                  <option value={productType} key={productType}>
                    {productType}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedBlobField label="Image" id="product-image" name="image" data-cy="image" isImage accept="image/*" />
              <ValidatedField label="Usage Type" id="product-usageType" name="usageType" data-cy="usageType" type="select">
                {usageTypeValues.map(usageType => (
                  <option value={usageType} key={usageType}>
                    {usageType}
                  </option>
                ))}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/product" replace color="info">
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

export default ProductUpdate;
