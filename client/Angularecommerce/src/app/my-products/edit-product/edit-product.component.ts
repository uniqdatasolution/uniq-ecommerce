import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../rest-api.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  product = {
    _id: '',
    title: '',
    price: '',
    category: {},
    owner: {},
    categoryId: '',
    description: '',
    product_picture: {}
  };
  id: any;
  fileChanged = false;
  imageUpload;

  categories: any;
  productDetails: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('=================params', params);
      this.id = params.id;
    })
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    try {
      const data = await this.rest.get(
        `http://localhost:3030/api/product/${this.id}`
        // 'http://localhost:3030/api/product/${}'+this.id
      );
      data['success']
        ? (this.product = data['product'], 
            this.product.category = data['product'].category,
            this.product.owner = data['product'].owner,
            this.product.categoryId = data['product'].category._id
            // this.product.product_picture = data['product'].image
            )
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
          if (product.description) {
            return true;
            // if (product.product_picture) {
            //   return true;
            // } else {
            //   this.data.error('Please select product image.');
            // }
          } else {
            this.data.error('Please enter description.');
          }
        } else {
          this.data.error('Please select category.');
        }
      } else {
        this.data.error('Please enter a price.');
      }
    } else {
      this.data.error('Please enter a title.');
    }
  }

  fileChange(event: any) {
    this.product.product_picture = event.target.files[0];
    console.log('======================img', this.product.product_picture);
    this.fileChanged = true
    this.imageUpload = event.target.files[0];
  }

  async post() {
    console.log('===========================post data', this.product);
    this.btnDisabled = true;
    try {
      if (this.validate(this.product) && this.fileChanged === false) {
        console.log('===========================file changed false');
        const form = new FormData();
        // for (const key in this.product) {
        //   if (this.product.hasOwnProperty(key)) {
        //     if (key === 'product_picture') {
        //       form.append(
        //         'product_picture',
        //         this.product.product_picture,
        //         this.product.product_picture.name
        //       );
        //     } else {
        //       form.append(key, this.product[key]);
        //     }
        //   }
        // }
        
        console.log('====================form',  form)
        const data = await this.rest.post(
          `http://localhost:3030/api/edit-product/${this.id}`,
          this.product
        );
        data['success']
          ? this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }

      if(this.validate(this.product) && this.fileChanged == true) {
        console.log('===========================file changed true');
        debugger;
        const form = new FormData();
        for (const key in this.product) {
          console.log('====================kry', key)
          if (this.product.hasOwnProperty(key)) {
            if (key === 'product_picture') {
              form.append(
                'product_picture',
                this.imageUpload
                // this.product.product_picture,
                // this.product.product_picture.name
              );
            } else {
              form.append(key, this.product[key]);
            }
          }
        }
        console.log('====================to post',  form)
        this.product.product_picture = this.imageUpload;
        const data = await this.rest.post(
          `http://localhost:3030/api/edit-product/${this.id}`,
          this.product
        );
        data['success']
          ? this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }

    } catch (error) {
      console.log('======================errr', error)
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
