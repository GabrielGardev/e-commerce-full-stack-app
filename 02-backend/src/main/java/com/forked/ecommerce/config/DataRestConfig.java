package com.forked.ecommerce.config;

import com.forked.ecommerce.entity.Product;
import com.forked.ecommerce.entity.ProductCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        HttpMethod[] unsupportedActions = {HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};

        // disable HTTP methods for Product entity: POST, PUT and DELETE
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

        // disable HTTP methods for ProductCategory entity: POST, PUT and DELETE
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));

        //call an internal helper method to expose ids for categories
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose ids

        //get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //crate an array list of the entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types for the entities
        for (EntityType entity : entities) {
            entityClasses.add(entity.getJavaType());
        }

        //expose the entity ids for the array of entity/domain types
        Class[] domainTypes = new Class[entityClasses.size()];
        domainTypes = entityClasses.toArray(domainTypes);

        config.exposeIdsFor(domainTypes);
    }
}
