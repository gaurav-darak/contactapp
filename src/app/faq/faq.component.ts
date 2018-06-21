import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
	selector: 'faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
	faqPostMsg;
	faqPostStatus;
	constructor(private commonService: CommonService) { 
		this.faqPostMsg='';
		this.faqPostStatus=0;
	}

	ngOnInit() {
	}

	/***Handling contact us form submmision***/
	postQuery(form) {

		/******If form contains valid data then proceed******/
		if (form.valid) {
			var formValues = {
				"name": form.value.name,
				"email": form.value.email,
				"query": form.value.question
			};

			this.commonService.postContactus(formValues).subscribe(response => {
				var jsonResp = response.json();
				this.faqPostMsg = jsonResp.msg;
				this.faqPostStatus = jsonResp.status;
				form.resetForm();

				setTimeout(() => {
					this.faqPostMsg = "";
					this.faqPostStatus = 0;
				},3000);
			},error => {
				this.faqPostMsg = "Something went wrong, please try again later.";
				this.faqPostStatus = 0;
				form.resetForm();
				setTimeout(() => {
					this.faqPostMsg = "";
					this.faqPostStatus = 0;
				},3000);
			});
		}
		else{
			console.log("invalid form data");
		}
	}
}
