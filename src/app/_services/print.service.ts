import {Injectable} from '@angular/core';
import { CommonService } from '../_services/common.service';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SubscriptionStatus } from '../_models/enums';
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
    this._service.get("reports/generate-customer-invoice/" + id).subscribe(res => {

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


      doc.setFontSize(this.fontSizes.SmallFontSize);
      doc.setFont("times", "bold");
      doc.text("Date: " + invoiceDate, 200, 10, null, "right");
      doc.line(10, 18, 200, 18);
      doc.setFontSize(this.fontSizes.HeadTitleFontSize);
      doc.setFont("times", "bold");
      doc.text("INVOICE", InitialstartX + 65, (InitialstartY += this.lineSpacing.NormalSpacing + 2), null, "center");
      doc.line(10, 26, 200, 26);

      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "normal");
      doc.text("WiFi Rental Service Agreement Form", InitialstartX + 65, (startY += this.lineSpacing.NormalSpacing + 9), null, "center");


      /** Left part */
      doc.setFontSize(this.fontSizes.SubTitleFontSize);
      doc.setFont("times", "normal");
      doc.text("Consignee-", startX, (startY += this.lineSpacing.NormalSpacing + 7), null, "left");

      doc.setFontSize(this.fontSizes.TitleFontSize);
      doc.setFont("times", "bold");
      doc.text(res.customer.first_name + " " + res.customer.last_name, startX, (startY += 6), null, "left");

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Phone: " + res.customer.mobile, startX, (startY += 5), null, "left");

      doc.setFontSize(this.fontSizes.NormalFontSize);
      doc.setFont("times", "normal");
      doc.text("Email: " + res.customer.email, startX, (startY += 5), null, "left");



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

      let item_price = 0;
      let discount = 0;
      let amount = 0;
      let refund = 0;

        if(res.bill_type == "Subscription"){
          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "bold");
          doc.text("Subscription No: " + res.subscription, startX , (startY += this.lineSpacing.NormalSpacing + 12), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "bold");
          doc.text("Bill No: " + res.subscribed_relocation_items[0].bill, startX , (startY += 5), null, 'left');

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "bold");
          doc.text("Bill Session: " + res.session, startX , (startY += 5), null, 'left');

          columns = [
            { title: 'SIM CID No', dataKey: 'CID_no' },
            { title: 'SIM ICCID No', dataKey: 'ICCID_no' },
            { title: 'Phone Number', dataKey: 'phone_number' },
            { title: 'Plan', dataKey: 'plan' },
            { title: 'Status', dataKey: 'status' },
            { title: 'Item Price', dataKey: 'actual_price' },
            { title: 'Discount', dataKey: 'discount' },
            { title: 'Amount', dataKey: 'payable_amount' },
            { title: ' Refund', dataKey: 'refund_amount' }
          ];


          let dataArray = [];

          res.subscribed_relocation_items.forEach(element => {
            dataArray.push({
              CID_no: element.sim.CID_no,
              ICCID_no: element.sim.ICCID_no,
              phone_number: element.sim.phone_number ? element.sim.phone_number : '--',
              plan: element.plan,
              status: SubscriptionStatus[element.status],
              actual_price: element.actual_price,
              discount: element.discount > 0 ? '-'+element.discount : element.discount,
              payable_amount: element.payable_amount,
              refund_amount: element.refund_amount > 0 ? '-'+element.refund_amount : element.refund_amount
            });

            item_price += Number(element.actual_price);
            discount += Number(element.discount);
            amount += Number(element.payable_amount);
            refund += Number(element.refund_amount);

          });

          /** Table */
          // @ts-ignore
          doc.autoTable(columns, dataArray, {
            theme: 'plain',
            startY: startY + 5,
            margin:12,
            columnStyles: {
              CID_no: { cellWidth: 20 },
              ICCID_no: { cellWidth: 27 },
              phone_number: { cellWidth: 25 },
              plan: { cellWidth: 16 },
              status: { cellWidth: 20 },
              actual_price: { cellWidth: 20 },
              discount: { cellWidth: 20 },
              payable_amount: { cellWidth: 20 },
              refund_amount: { cellWidth: 18 }
            },
            styles: {
              font: 'times',
              lineWidth: 0.4,
              overflow: 'linebreak',
              fontSize: 8
            },
            cellPadding: 2
          });

        }else if(res.bill_type == "Device Sales"){

          doc.setFontSize(this.fontSizes.NormalFontSize);
          doc.setFont("times", "bold");
          doc.text("Bill No: " + res.sold_device_items[0].bill, startX , (startY += 25), null, 'left');


          columns = [
            { title: 'DID No', dataKey: 'DID_no' },
            { title: 'IMEI No', dataKey: 'IMEI' },
            { title: 'Status', dataKey: 'status' },
            { title: 'Item Price', dataKey: 'item_price' }
          ];


          let dataArray = [];
          res.sold_device_items.forEach(element => {
            dataArray.push({
              DID_no: element.device.DID_no,
              IMEI: element.device.IMEI,
              status: SubscriptionStatus[element.status],
              item_price: element.device_cost
            });

            item_price += Number(element.device_cost);
          });

          /** Table */
          // @ts-ignore
          doc.autoTable(columns, dataArray, {
            theme: 'plain',
            startY: startY + 5,
            margin:12,
            columnStyles: {
              DID_no: { cellWidth: 40 },
              IMEI: { cellWidth: 60 },
              status: { cellWidth: 40 },
              item_price:  { cellWidth: 45 },
            },
            styles: {
              font: 'times',
              lineWidth: 0.4,
              overflow: 'linebreak',
              fontSize: 8
            },
            cellPadding: 2

          });



        }

         // @ts-ignore
         if (doc.previousAutoTable.finalY < 200) {
          // @ts-ignore
          startY = doc.previousAutoTable.finalY + 2;
          } else {
            doc.addPage();
            // @ts-ignore
            startY = 20;
          }

          // @ts-ignore
          doc.setLineDash([1], 1);
          doc.line(startX - 2, startY, 200, startY)

          // @ts-ignore
          doc.setLineDash([1], 1);
          doc.line(startX - 2, startY += 1, 200, startY)


          if (res.bill_type == "Subscription") {
            let calStartX = startX + 110;

            doc.setFontSize(9);
            doc.setFont("times", "normal");
            doc.text(item_price.toString(), calStartX, startY += 5, null, "left");

            doc.setFontSize(9);
            doc.setFont("times", "normal");
            doc.text('-'+discount.toString(), calStartX += 20, startY, null, "left");

            doc.setFontSize(9);
            doc.setFont("times", "normal");
            doc.text(amount.toString(), calStartX += 20, startY, null, "left");

            doc.setFontSize(9);
            doc.setFont("times", "normal");
            doc.text('-'+refund.toString(), calStartX += 20, startY, null, "left");


            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Total', rightStartCol2 + 20, startY += 12, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(item_price.toString(), rightStartCol2 + 42, startY, null, 'right');

            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Discount', rightStartCol2 + 20, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text("-" + discount.toString(), rightStartCol2 + 42, startY, null, 'right');

            // @ts-ignore
            doc.setLineDash([1], 1);
            doc.line(rightStartCol2 - 20, startY += 2, 200, startY)


            const grand_total = item_price - discount;
            let payable_amount = Number(res.payable_amount);
            let paid_amount = Number(res.so_far_paid);

            //Grand Total
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Grand Total', rightStartCol2 + 20, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(grand_total.toString(), rightStartCol2 + 42, startY, null, 'right');



            //Paid
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Paid', rightStartCol2 + 20, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(paid_amount.toString(), rightStartCol2 + 42, startY, null, 'right');



            if (Number(refund) > 0) {

              //Refund
              doc.setFontSize(this.fontSizes.SubTitleFontSize);
              doc.setFont("times", "bold");
              doc.text('Refunded', rightStartCol2 + 20, startY += 5, null, 'right');

              doc.setFontSize(this.fontSizes.SubTitleFontSize);
              doc.setFont("times", "bold");
              doc.text("- " + refund.toString(), rightStartCol2 + 42, startY, null, 'right');

              //payable_amount = payable_amount - refund;
             //paid_amount = paid_amount + refund;

              //Payable
              // doc.setFontSize(this.fontSizes.SubTitleFontSize);
              // doc.setFont("times", "bold");
              // doc.text('Payable', rightStartCol2 + 20, startY += 5, null, 'right');
              // doc.setFontSize(this.fontSizes.SubTitleFontSize);
              // doc.setFont("times", "bold");
              // doc.text(payable_amount.toString(), rightStartCol2 + 42, startY, null, 'right');

            }



            const due_amount = payable_amount - paid_amount - refund;
            if(due_amount > 0){
            // @ts-ignore
            doc.setLineDash([1], 1);
            doc.line(rightStartCol2 - 20, startY += 5, 200, startY)

            //Due
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Due', rightStartCol2 + 20, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(due_amount.toString(), rightStartCol2 + 42, startY, null, 'right');

            }



          }else if(res.bill_type == "Device Sales"){
            let calStartX = startX + 143;

            doc.setFontSize(9);
            doc.setFont("times", "normal");
            doc.text(item_price.toString(), calStartX, startY += 5, null, "left");




            //One Time Charge
            const one_time_charge = Number(res.one_time_charge);
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('One Time Charge', rightStartCol2, startY += 12, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(one_time_charge.toString(), rightStartCol2 + 12, startY, null, 'right');

            //Total
            const total = one_time_charge + item_price;
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Total', rightStartCol2, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(total.toString(), rightStartCol2 + 12, startY, null, 'right');

            //Discount
            const discount = Number(res.discount);
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Discount', rightStartCol2, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text("-" + discount.toString(), rightStartCol2 + 12, startY, null, 'right');


             // @ts-ignore
             doc.setLineDash([1], 1);
             doc.line(rightStartCol2 - 40, startY += 2, 200, startY)


             const grand_total = total - discount;
             let paid_amount = Number(res.so_far_paid);

             //Grand Total
             doc.setFontSize(this.fontSizes.SubTitleFontSize);
             doc.setFont("times", "bold");
             doc.text('Grand Total', rightStartCol2 , startY += 5, null, 'right');
             doc.setFontSize(this.fontSizes.SubTitleFontSize);
             doc.setFont("times", "bold");
             doc.text(grand_total.toString(), rightStartCol2 + 12, startY, null, 'right');


            //Paid
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Paid', rightStartCol2, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(paid_amount.toString(), rightStartCol2 + 12, startY, null, 'right');


            const due_amount = grand_total - paid_amount ;
            if(due_amount > 0){
            // @ts-ignore
            doc.setLineDash([1], 1);
            doc.line(rightStartCol2 - 40, startY += 5, 200, startY)

            //Due
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text('Due', rightStartCol2, startY += 5, null, 'right');
            doc.setFontSize(this.fontSizes.SubTitleFontSize);
            doc.setFont("times", "bold");
            doc.text(due_amount.toString(), rightStartCol2 + 12, startY, null, 'right');

            }




          }



          if (res.status === 3 || res.status === 4) {
            var img = new Image()
            img.src = 'assets/images/paid.png'
            doc.addImage(img, 'png', startX + 100, startY + 20, 80, 60)
          }

          /** Terms and conditions */
          doc.setFontSize(this.fontSizes.SubTitleFontSize);
          doc.setFont("times", "bolditalic");
          doc.text("Terms and Conditions", startX, (startY += this.lineSpacing.NormalSpacing + 5), null, 'left');

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
