import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface TeamMember {
  id: string;           
  name: string;
  title: string;
  image: string;
  quote: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamMembersService {
  private dataUrl = 'assets/data/Chic_Lighting_and_Design.json';
  private teamMemberData: Observable<any> | null = null;

  constructor(private http: HttpClient) {}

  private getData(): Observable<any> {
    if (!this.teamMemberData) {
      this.teamMemberData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching TeamMember data', error);
          return throwError('Failed to load TeamMember data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.teamMemberData;
  }

  getAllTeamMembers(): Observable<TeamMember[]> {
    return this.getData().pipe(map(data => data.teamMembers));
  }

  getTeamMemberById(teamMemberId: string): Observable<TeamMember> {
    return this.getData().pipe(
      map(data => {
        const member = data.teamMembers.find((t: TeamMember) => t.id === teamMemberId);
        if (!member) {
          throw new Error(`TeamMember with ID ${teamMemberId} not found`);
        }
        return member;
      }),
      catchError(error => {
        console.error('Error getting TeamMember by ID', error);
        return throwError(error);
      })
    );
  }

  getRandomTeamMembers(count: number = 2): Observable<TeamMember[]> {
    return this.getData().pipe(
      map(data => {
        const members = [...data.teamMembers];
        const result: TeamMember[] = [];
        const requestCount = Math.min(count, members.length);

        for (let i = 0; i < requestCount; i++) {
          const randomIndex = Math.floor(Math.random() * members.length);
          result.push(members[randomIndex]);
          members.splice(randomIndex, 1);
        }

        return result;
      })
    );
  }

  getFeaturedTeamMember(): Observable<TeamMember> {
    return this.getData().pipe(
      map(data => data.teamMembers[0])
    );
  }
}
