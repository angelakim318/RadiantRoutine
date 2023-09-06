import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product.reducer';

export const ProductDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productEntity = useAppSelector(state => state.product.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productDetailsHeading">Product</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{productEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{productEntity.name}</dd>
          <dt>
            <span id="brand">Brand</span>
          </dt>
          <dd>{productEntity.brand}</dd>
          <dt>
            <span id="productType">Product Type</span>
          </dt>
          <dd>{productEntity.productType}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {productEntity.image ? (
              <div>
                {productEntity.imageContentType ? (
                  <a onClick={openFile(productEntity.imageContentType, productEntity.image)}>
                    <img src={`data:${productEntity.imageContentType};base64,${productEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {productEntity.imageContentType}, {byteSize(productEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="usageType">Usage Type</span>
          </dt>
          <dd>{productEntity.usageType}</dd>
        </dl>
        <Button tag={Link} to="/product" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product/${productEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductDetail;
