import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Định nghĩa interface cho phản hồi từ API
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T; // Dữ liệu trả về với kiểu generic
}

@Injectable({
  providedIn: 'root'
})
export class LinkedService {

  readonly APIUrl = "http://localhost:5238/api";

  constructor(private http: HttpClient) { }

  // Các phương thức liên quan đến CriteriaGroup
  takeListCriteriaGroup(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/CriteriaGroup`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching criteria group list:', error);
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );
  }

  addCriteriaGroup(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.APIUrl}/CriteriaGroup`, data);
  }

  updateCriteriaGroup(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.APIUrl}/CriteriaGroup`, data);
  }

  deleteCriteriaGroup(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/CriteriaGroup/${id}`);
  }

  // Các phương thức liên quan đến Rank
  takeListRank(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/Rank`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching rank list:', error);
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );
  }

  addRank(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.APIUrl}/Rank`, data);
  }

  updateRank(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.APIUrl}/Rank`, data);
  }

  deleteRank(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/Rank/${id}`);
  }

  // Các phương thức liên quan đến Criteria
  takeListCriteria(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/Criteria`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching criteria list:', error);
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );
  }

  addCriteria(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.APIUrl}/Criteria`, data);
  }

  updateCriteria(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.APIUrl}/Criteria`, data);
  }

  deleteCriteria(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/Criteria/${id}`);
  }

  // Các phương thức liên quan đến User
  takeListUser(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/User`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching user list:', error);
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );
  }
  takeUser(id: any): Observable<any> {
    return this.http.get<any>(`${this.APIUrl}/User/${id}`);
  }

  addUser(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.APIUrl}/User`, formData);
  }

  updateUser(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.APIUrl}/User`, data);
  }

  deleteUser(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/User/${id}`);
  }

  // Các phương thức liên quan đến TeachGroup
  takeListTeachGroups(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/TeachGroup`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching user list:', error);
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );
  }
  takeTeachGroup(id: any): Observable<any[]> {
    return this.http.get<any>(`${this.APIUrl}/TeachGroup/${id}`);
  }

  addTeachGroup(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.APIUrl}/TeachGroup`, data);
  }

  updateTeachGroup(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.APIUrl}/TeachGroup`, data);
  }

  deleteTeachGroup(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/TeachGroup/${id}`);
  }

  // Các phương thức liên quan đến Log
  takeListLog(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/Log`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching log list:', error);
        return of([]); // Trả về mảng rỗng nếu có lỗi
      })
    );
  }

  deleteLog(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/Log/${id}`);
  }
  deleteAllLog(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/Log/${id}`);
  }
  deleteMultipleLogs(ids: string[]): Observable<any> {
  return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/Log/delete-multiple`, { body: ids });
  }
  // Các phương thức liên quan đến Evaluate
  takeListEvaluate(): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/Evaluate/all`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching log list:', error);
        return of([]);
      })
    );
  }
  takeListCriteriaOfEvaluate(id: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.APIUrl}/CriteriaOfAEvaluation/${id}`).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching log list:', error);
        return of([]);
      })
    );
  }

  addEvaluate(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.APIUrl}/Evaluate`, data);
  }
  updateEvaluate(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.APIUrl}/Evaluate`, data);
  }
  deleteEvaluate(id: any): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.APIUrl}/Evaluate/${id}`);
  }
}
