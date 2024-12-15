import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProfileComponent } from './update-profile.component';
import { JsonService } from '../../services/json.service';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../common/navbar/navbar.component';
import { of } from 'rxjs';
import { NgForm } from '@angular/forms';

describe('UpdateProfileComponent', () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let jsonService: jasmine.SpyObj<JsonService>;
  let datePipe: DatePipe;

  beforeEach(() => {
    // Create spy object for JsonService
    const jsonServiceSpy = jasmine.createSpyObj('JsonService', ['getJsonData', 'updateObject']);
    
    // Set up TestBed
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, FormsModule,  UpdateProfileComponent, NavbarComponent ],
      providers: [ 
        DatePipe, 
        { provide: JsonService, useValue: jsonServiceSpy }
      ]
    });

    // Initialize fixture and component
    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    jsonService = TestBed.inject(JsonService) as jasmine.SpyObj<JsonService>;
    datePipe = TestBed.inject(DatePipe);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  });
