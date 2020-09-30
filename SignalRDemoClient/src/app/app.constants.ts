import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Configuration {
    public apiUrl = 'https://localhost:5001/'; // 'https://localhost:44324/';
}
