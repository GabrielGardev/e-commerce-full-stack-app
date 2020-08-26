package com.forked.ecommerce.repository;

import com.forked.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

//name of JSON entry and /product-category path
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
@CrossOrigin
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
