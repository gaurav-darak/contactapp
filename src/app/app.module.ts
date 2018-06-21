import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FaqComponent } from './faq/faq.component';
import { CommonService } from './common.service';
import { HttpModule } from '@angular/http';

@NgModule({
	declarations: [
		AppComponent,
		FaqComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [CommonService],
	bootstrap: [AppComponent]
})
export class AppModule { }
