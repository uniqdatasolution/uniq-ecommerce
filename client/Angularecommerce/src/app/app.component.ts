//app.component.ts- TypeScript file which facilitates authorization and provides logout and search functionality to e learning client application ///


//including required services and modules 
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { RestApiService } from './rest-api.service';

//Component specific details 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

//exporting the AppComponnet for reuse 
export class AppComponent implements OnInit {
  searchTerm = '';
  isCollapsed = true;
  categories: any = [];

  constructor(private router: Router, private data: DataService, private rest: RestApiService) {
    this.data.cartItems = this.data.getCart().length;
    this.data.getProfile();
  }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://localhost:3030/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);

      console.log('=======================cat' , this.categories)
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {
    this.data.user = {};
    this.data.cartItems = 0;
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {
    if (this.searchTerm) {
      this.collapse();
      this.router.navigate(['search', { query: this.searchTerm }]);
    }
  }
}
