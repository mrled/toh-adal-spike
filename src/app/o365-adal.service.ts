import { Http, Headers } from '@angular/http';
import { Injectable, NgModule } from '@angular/core';

@Injectable()
export class o365Adal  {
    private config: any = {
        tenant: 'opscerticasolutions.onmicrosoft.com', // For now, hardcoded to Certica's tenant subscription
        clientId: '96940ea7-a69d-45dd-bcef-1745b3c7c30b', // For now, hardcoded to ID for "Delaware Ed-Access Test" AzureAD app in Certica's subscription
        postLogoutRedirectUri: window.location.origin,
        endpoints: {
            officeGraph: 'https://graph.microsoft.com'
        },
        cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };
    private currentUser: any;

    authContext: any;

    get isUserAuthenticated(): boolean {
        return !!this.currentUser;
    }
    get currentUserName(): string {
        return this.isUserAuthenticated ? this.currentUser.profile.name : '';
    }
    get userPropr(): Array<any> {
        var userProps = new Array<any>();
        for (var property in this.currentUser.profile) {
            if (this.currentUser.profile.hasOwnProperty(property)) {
                userProps.push({ propertyName: property, value: this.currentUser.profile[property] });
            }
        }
        return userProps;
    }

    constructor(private http: Http) {
        this.authContext = new AuthenticationContext(this.config);
        this.handleLogInCallBack();
    }

    private handleLogInCallBack = (): void => {
        var isCallback = this.authContext.isCallback(window.location.hash);
        this.authContext.handleWindowCallback();
        this.currentUser = this.authContext.getCachedUser();
        var logError = - this.authContext.getLoginError();

        if (!!logError) {
            alert(logError);
        } else if (isCallback && !logError) {
            window.location.assign(this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.LOGIN_REQUEST));
        }
    }

    private tokenPromise = (endpoint: string): Promise<string> => {
        var p = new Promise<string>((resolve, reject) => {
            this.authContext.acquireToken(endpoint, function (error: any, token: string) {
                if (error || !token) {
                    alert('ADAL error occurred: ' + error);
                    return;
                } else {
                    resolve(token);
                }
            }).fail(function () {
                console.log('fetching files from onedrive failed.');
                alert('something went wrong! try refreshing the page.');
            });
        });
        return p
    }

    public getRequestPromise = (reqUrl: string): Promise<any> => {
        var p = new Promise<any>((resolve, reject) => {
            var tokenPromise = this.tokenPromise(this.config.endpoints.officeGraph);
            tokenPromise.then((token) => {
                var headers = new Headers();
                headers.append('Authorization', 'Bearer ' + token);
                this.http.get(this.config.endpoints.officeGraph + reqUrl, { headers: headers }).subscribe((res: any) => {
                    resolve(JSON.parse(res._body));
                });
            });
        });
        return p;
    }
}
