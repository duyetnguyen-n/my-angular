import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LinkedService {

  readonly APIUrl = "http://localhost:5238/api";
  readonly PhotoUrl = "http://localhost:5238/Photos";

  constructor(private http: HttpClient) { }

  takeListCriteriaGroup(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/CriteriaGroup');
  }
  takeCriteriaGroup(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/CriteriaGroup');
  }

  addCriteriaGroup(data:any) {
    return this.http.post(this.APIUrl + '/CriteriaGroup', data);
  }

  updateCriteriaGroup(val:any){
    return this.http.get<any>(this.APIUrl + '/CriteriaGroup');
  }
  deleteCriteriaGroup(val:any){
    return this.http.get<any>(this.APIUrl + '/CriteriaGroup');
  }

  takeListRank(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/Rank');
  }
  takeRank(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/Rank');
  }

  addRank(val:any) {
    return this.http.post(this.APIUrl + '/Rank', val);
  }

  updateRank(val:any){
    return this.http.get<any>(this.APIUrl + '/Rank');
  }
  deleteRank(val:any){
    return this.http.get<any>(this.APIUrl + '/Rank');
  }

  takeListCriteria(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/Criteria');
  }
  takeCriteria(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/Criteria');
  }

  addCriteria(val:any) {
    return this.http.post(this.APIUrl + '/Criteria', val);
  }

  updateCriteria(val:any){
    return this.http.get<any>(this.APIUrl + '/Criteria');
  }
  deleteCriteria(val:any){
    return this.http.get<any>(this.APIUrl + '/Criteria');
  }

  takeListUser(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/User');
  }
  takeUser(): Observable<any[]>{
    return this.http.get<any>(this.APIUrl + '/User');
  }

  addUser(val:any) {
    return this.http.post(this.APIUrl + '/User', val);
  }

  updateUser(val:any){
    return this.http.get<any>(this.APIUrl + '/User');
  }
  deleteUser(val: any) {
    return this.http.get<any>(this.APIUrl + '/User');
  }
}
