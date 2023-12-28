import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { IntroGuard } from './guards/intro.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then((m) => m.IntroPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'cpc',
    loadChildren: () => import('./cpc/cpc.module').then(m => m.CpcPageModule)
  },
  {
    path: 'add-activity/:itid',
    loadChildren: () => import('./pages/add-activity/add-activity.module').then(m => m.AddActivityPageModule)
  },
  {
    path: 'show-activity/:itid',
    loadChildren: () => import('./pages/show-activity/show-activity.module').then(m => m.ShowActivityPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then(m => m.TestPageModule)
  },
  {
    path: 'for-test',
    loadChildren: () => import('./pages/for-test/for-test.module').then(m => m.ForTestPageModule)
  },
  {
    path: 'finance/:itid',
    loadChildren: () => import('./pages/finance/finance.module').then(m => m.FinancePageModule)
  },
  {
    path: 'factor/:itid',
    loadChildren: () => import('./pages/factor/factor.module').then(m => m.FactorPageModule)
  },
  {
    path: 't-upload',
    loadChildren: () => import('./pages/t-upload/t-upload.module').then(m => m.TUploadPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
