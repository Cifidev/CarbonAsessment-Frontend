import {
  HttpBackend,
  HttpClient
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map } from 'rxjs/operators';
import { GreencrossService } from "./greencross.service";

@Injectable()
export class AuthenticationService {
  private http: HttpClient;
  private GreencrossService: GreencrossService;

  constructor(
    private router: Router,
    handler: HttpBackend,
    GreencrossService: GreencrossService,
  ) {
    this.http = new HttpClient(handler);
    this.GreencrossService = GreencrossService;
  }

  // url = this.globals.getBaseUrl() + "/SIGA/developmentLogin.do";
  // urlNewSiga = this.globals.getBaseUrl() + "/siga-web/login";

  logout() {
    sessionStorage.removeItem("authenticated");
    this.router.navigate(["/login"]);
  }

  isAutenticated(){
    let auth = sessionStorage.getItem("authenticated");
    return auth === "true";
  }
  setAutenticate(token:string){
    sessionStorage.setItem("authenticated", "true");
    sessionStorage.setItem("token", token);
  }
  

  // autenticate(): Observable<any> {
  //   sessionStorage.removeItem("authenticated");
  //   let newSigaRquest = this.newSigaLogin();

  //   return forkJoin([newSigaRquest]).map(response => {
  //     let newSigaResponse = response[0].headers.get("Authorization");
  //     let newSigaResponseStatus = response[0].status;
  //     if (newSigaResponseStatus == 200) {
  //       sessionStorage.setItem("osAutenticated", "true");

  //       sessionStorage.setItem("authenticated", "true");
  //       sessionStorage.setItem("Authorization", newSigaResponse);

  //       return true;

  //     }
  //   });
  }

  



