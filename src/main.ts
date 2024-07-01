import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { registerLicense } from "@syncfusion/ej2-base";
import { bootstrapApplication } from "@angular/platform-browser";
import { HomeComponent } from "./app/home/home.component";

// Registering Syncfusion license key
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXledXRXRmBeVkx3Wks="
);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));

bootstrapApplication(HomeComponent);
