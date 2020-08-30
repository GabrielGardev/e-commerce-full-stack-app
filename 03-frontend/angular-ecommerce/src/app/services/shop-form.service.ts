import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from 'src/app/common/country'
import { State } from 'src/app/common/state'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  readonly countriesUrl = 'http://localhost:8080/api/countries';
  readonly statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let  data: number[] = [];

    //array for "Month" dropdown list
    //- start at desired startMonth and loop until 12

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let  data: number[] = [];

    //array for "Year" dropdown list
    //- start at current year and loop for next 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(data => data._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseState>(searchStateUrl).pipe(
      map(data => data._embedded.states)
    );
  }

}

interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseState {
  _embedded: {
    states: State[];
  }
}