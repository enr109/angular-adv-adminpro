import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent {

  

  constructor( private router: Router ) {
    /* this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd),
      filter( (event:ActivationEnd) => event.snapshot.firstChild === null),
    )
    .subscribe( event => {
      console.log( event);
    }); */
     
    
  }
  


  

  

}
