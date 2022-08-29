import {Injectable} from '@angular/core';
import { CommonService } from '../_services/common.service';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { jsPDF } from "jspdf";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SubscriptionStatus,BillStatus } from '../_models/enums';
import * as moment from 'moment';

@Injectable()

export class PrintService {
  @BlockUI() blockUI: NgBlockUI;
  SubscriptionStatus = SubscriptionStatus;
  fontSizes: any = {
    HeadTitleFontSize: 18,
    Head2TitleFontSize: 16,
    TitleFontSize: 14,
    SubTitleFontSize: 10,
    NormalFontSize: 10,
    SmallFontSize: 8
  };

  lineSpacing: any = {
    NormalSpacing: 12
  };

  constructor(
    private _service: CommonService,
    public datepipe: DatePipe
  ) {}


  printInv(id) {
    this.blockUI.start('Generating invoice...');
    this._service.get("bill/get-customer-invoice-detail/" + id).subscribe(res => {
      console.log(res);
      const doc = new jsPDF('p', 'mm', 'a4');
      //Dimension of A4 in mm: 210 × 297
      //Dimension of A4 in pts: 595 × 842
      doc.setProperties({
        title: "Invoice"
      });
      let addressObj = {
        company: 'Gold Lavender Co. Ltd',
        postCode: '169-0073',
        address: 'Tokyo to shinjuku ku hyakunincho 2-9-2',
        address2: 'Okayama Business Build 201',
        tel: '03-6869-6171',
        email: 'goldlavender15@gmail.com'
      };


      let invoiceDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

      let rightStartCol1 = 140;
      let rightStartCol2 = 150;

      let InitialstartX = 40;
      let startX = 12;
      let InitialstartY = 10;
      let startY = 10;


      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("Invoice No: " + res.bill_no, 10, 10, null, "left");
      doc.line(10, 18, 200, 18);

      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("Printed On: " + invoiceDate, 200, 10, null, "right");
      doc.line(10, 18, 200, 18);


      doc.setFontSize(this.fontSizes.HeadTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("INVOICE", InitialstartX + 65, (InitialstartY += this.lineSpacing.NormalSpacing + 2), null, "center");
      doc.line(10, 26, 200, 26);

      doc.setFontSize(this.fontSizes.Head2TitleFontSize);
      doc.setFont("times", "normal");
      doc.text("WiFi Bill For The Month of "+ moment(res.billing_month).format('MMMM, YYYY'), InitialstartX + 65, (startY += this.lineSpacing.NormalSpacing + 12), null, "center");


      /** Left part */
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "normal");
      doc.text("Consignee-", startX, (startY += this.lineSpacing.NormalSpacing + 7), null, "left");

      doc.setFontSize(this.fontSizes.TitleFontSize);
      doc.setFont("times", "bold");
      doc.text(res.customer_full_name, startX, (startY += 6), null, "left");

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Phone: " + res.customer_mobile, startX, (startY += 5), null, "left");

      if(res.customer_telephone){
      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(res.customer_mobile, startX + 11, (startY += 5), null, "left");
      }

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Customer Type: " + (res.customer_is_wholesaler == "True" ? "Wholesaler" : "Retailer"), startX, (startY += 5), null, "left");

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Email: " + res.customer_email, startX, (startY += 5), null, "left");



      /** Right part */
      let tempY = InitialstartY + 26;
      doc.setFontSize(this.fontSizes.TitleFontSize);
      doc.setFont("times", "bold");
      doc.text(addressObj.company, rightStartCol1, (tempY), null, 'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(addressObj.postCode, rightStartCol1, (tempY += 5), null, 'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(addressObj.address, rightStartCol1, (tempY += 5), null, 'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text(addressObj.address2, rightStartCol1, (tempY += 5), null, 'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Tel: " + addressObj.tel, rightStartCol1, (tempY += 5), null, 'left');

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Email: " + addressObj.email, rightStartCol1, (tempY += 5), null, 'left');


      // Bill Type
      let columns = [];


      columns = [
        { title: 'No', dataKey: 'no' },
        { title: 'ICCID No', dataKey: 'ICCID_no' },
        { title: 'Phone Number', dataKey: 'phone_number' },
        { title: 'IMEI', dataKey: 'imei' },
        { title: 'Package Name', dataKey: 'package_name' },
        { title: 'Notes', dataKey: 'notes' },
        { title: 'Ends At', dataKey: 'ends_at' },
        { title: 'Amount', dataKey: 'amount' }
      ];


      let dataArray = [];

      res.bill_items.forEach((element,i) => {
        dataArray.push({
          no: i +1,
          ICCID_no: element.ICCID_no,
          phone_number: element.phone_number,
          imei: element.IMEI ? element.IMEI : 'N/A',
          package_name: element.pckg_name,
          notes: element.pckg_advance_pmnt_desc ? element.pckg_advance_pmnt_desc : '--',
          ends_at: element.pckg_expiry != null ? moment(element.pckg_expiry).format('MMMM Do YYYY') : 'recurring',
          amount: element.current_month_price

        });

      });

      /** Table */
      // @ts-ignore
      doc.autoTable(columns, dataArray, {
        theme: 'plain',
        startY: startY + 10,
        margin:12,
        columnStyles: {
          no: { cellWidth: 8 },
          ICCID_no: { cellWidth: 27 },
          phone_number: { cellWidth: 20 },
          imei: { cellWidth: 27 },
          package_name: { cellWidth: 40 },
          notes: { cellWidth: 30 },
          ends_at: { cellWidth: 17 },
          amount: { cellWidth: 17 }
        },
        styles: {
          font: 'times',
          lineWidth: 0.4,
          overflow: 'linebreak',
          fontSize: 8
        },
        cellPadding: 2
      });




         // @ts-ignore
         if (doc.previousAutoTable.finalY < 200) {
          // @ts-ignore
          startY = doc.previousAutoTable.finalY + 2;
          } else {
            doc.addPage();
            // @ts-ignore
            startY = 15;
          }

          // @ts-ignore
          doc.setLineDash([1], 1);
          doc.line(startX - 2, startY, 200, startY)

          // @ts-ignore
          doc.setLineDash([1], 1);
          doc.line(startX - 2, startY += 1, 200, startY)


          let calStartX = startX + 110;


          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Total', rightStartCol2 + 20, startY += 12, null, 'right');
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text(res.total_amount, rightStartCol2 + 46, startY, null, 'right');

          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Discount', rightStartCol2 + 20, startY += 5, null, 'right');
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text("-" + res.overall_discount, rightStartCol2 + 46, startY, null, 'right');

          // @ts-ignore
          doc.setLineDash([1], 1);
          doc.line(rightStartCol2 - 20, startY += 2, 200, startY)


          //Grand Total
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Grand Total', rightStartCol2 + 20, startY += 5, null, 'right');
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text(res.grand_total, rightStartCol2 + 46, startY, null, 'right');



          //Paid
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Paid', rightStartCol2 + 20, startY += 5, null, 'right');
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text(res.already_paid, rightStartCol2 + 46, startY, null, 'right');



          if(Number(res.due) > 0){
          // @ts-ignore
          doc.setLineDash([1], 1);
          doc.line(rightStartCol2 - 20, startY += 5, 200, startY)

          //Due
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text('Due', rightStartCol2 + 20, startY += 5, null, 'right');
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text(res.due, rightStartCol2 + 46, startY, null, 'right');

          }





          if (res.payment_status === 3 || res.payment_status === 4) {
            var img = new Image()
            img.src = 'assets/images/paid.png'
            doc.addImage(img, 'png', startX + 100, startY + 20, 80, 60)
          }

          /** Others */
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bold");
          doc.text("STATUS: " + BillStatus[res.payment_status], startX, (startY += this.lineSpacing.NormalSpacing + 5), null, 'left');

          // doc.setFontSize(this.fontSizes.NormalFontSize);
          // doc.setFont("times", "normal");
          // doc.text(BillStatus[res.payment_status], startX, (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bolditalic");
          doc.text("NOTE: Payment Date - Every month before 25th of the month", startX, (startY += 7), null, 'left');

          // doc.setFontSize(this.fontSizes.NormalFontSize);
          // doc.setFont("times", "normal");
          // doc.text("Payment Date - Every month before 25th of the month", startX, (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bolditalic");
          doc.text("POST OFFICE ACCOUNT:", startX, (startY += 15), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("A/C Name: Gold. Lavender", startX, (startY += 5), null, 'left');
          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("A/C : 10170-25860861", startX, (startY += 5), null, 'left');


          /** Terms and conditions */
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bolditalic");
          doc.text("Terms and Conditions", startX, (startY += this.lineSpacing.NormalSpacing ), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("* Minimum 2 year contract, if you cancel before 2 year extra pay 2500 yen.", startX, (startY += 6), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("* For Wifi machine damage, lost penalty up to 10000 yen.", startX, (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("* 2 year contract, after 2 year if you cancel must be return (Box, Charger and main device) is in good condition.", startX, (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("* Wifi Reconnect Line open tie minimum 48 Hours.", startX, (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("* Payment Date - Every month before 25th of the month.", startX, (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "normal");
          doc.text("* Pak code change 3500 yen.", startX, (startY += 5), null, 'left');






      window.open(URL.createObjectURL(doc.output("blob")));
      this.blockUI.stop();
    },
      error => {
        this.blockUI.stop();
      });
  }


}
