import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { LoginComponent } from "./components/login/login.component";


const appRoute : Routes = [ //aca creamos todas las rutas
    {path: '',component: InicioComponent},
    {path: 'login',component: LoginComponent},
]

export const appRoutingProviders : any[]=[];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);