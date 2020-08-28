import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  previousCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;

  //new properties for pagination
  pageNumber: number;
  pageSize: number;
  totalElements: number;

  previousKeyword: string;

  constructor(private productService: ProductService,
    private route: ActivatedRoute) {
    this.products = [];
    this.currentCategoryId = 1;
    this.previousCategoryId = 1;
    this.searchMode = false;

    this.pageNumber = 1;
    this.pageSize = 5;
    this.totalElements = 0;

    this.previousKeyword = null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    //if we  have a different keyword then previous
    //then set thePageNumber to 1
    if (this.previousKeyword != keyword){
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;

    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);
    

    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.pageNumber - 1, this.pageSize, keyword)
    .subscribe(this.processResult());
  }

  handleListProducts() {
    //check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the 'id' string. Convert string to a number using Number class
      this.currentCategoryId = Number(this.route.snapshot.paramMap.get('id'));

      //get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    } else {
      //not category 'id' available ... default to category 'id' 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //Check if we have a different category then previous
    //Note: Angular will reuse a component if it is currently being viewed

    //if we have a different category id then previous
    //then set pageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    //now get the products for given category id
    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: number){
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
  
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
}
