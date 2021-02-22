//my-products component.ts - Type Script file that contains code to render products to elearning application

//including the required files and services
import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

//component specific details 
@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})

//exporting MyProductsComponents 
export class MyProductsComponent implements OnInit {

  products: any;

  constructor(private data: DataService, private rest: RestApiService,  private router: Router) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/seller/products'
      );
      data['success']
        ? (this.products = data['products'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  editProduct(productId) {
    console.log('=========================id', productId);
    this.router.navigateByUrl('/edit-product/'+ productId)
  }

  async deleteProduct(productId) {
    if(confirm("Are you sure to delete ?")) {
      console.log("Implement delete functionality here");
      try {
        const data: any = await this.rest.get(
          `http://localhost:3030/api/delete-product/${productId}`
        );
        if(data.success) {
          alert('Product was deleted successfully');
          window.location.reload();
        } else {
          alert('Your product is safe');
        }
        // data['success']
        //   ? (this.products = data['products'])
        //   : this.data.error(data['message']);
      } catch (error) {
        this.data.error(error['message']);
      }
    }
  }

}
