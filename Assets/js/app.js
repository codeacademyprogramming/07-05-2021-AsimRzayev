let customerDOM = document.querySelector("#customerDatas");
let modalTitle=document.querySelector('.modal-title');
let loanersDOM=document.querySelector('#loanersDOM');
let btnLoanHistory=document.querySelector('.btnLoanHistory');
let filterActiveLoan=document.querySelectorAll(".filterActiveLoan");
let filterName=document.querySelector("#filterName");
let minValue=document.querySelector("#minValue");
let maxValue=document.querySelector("#maxValue");
//getting Products
class Customer {

  async getCustomers() {
    try {
      let result = await fetch("assets/js/db.json");
      let data = await result.json();
      let customers = data.map((item) => {
        const { id, name, surname, img, salary, loans,hasLoanHistory } = item;
        return { id, name, surname, img, salary, loans,hasLoanHistory };
      });
      return customers;
    } catch (error) {
      alert(error);
    }
  }
  async getCustomerById(id)
  {
    try {
        let customItem = await fetch("assets/js/db.json");
        let customData = await customItem.json();
        
        return customData[id-1];
      } catch (error) {
        alert(error);
      }

  }
}
class FilterDatas
{
    filterActiveLoan(customers,filterText)
    {
      
  
      
                switch(filterText)
                {
                    case "All":
                      UI.displayCustomers(customers);
                      if(filterName.value!="")
                      this.filterCustomerName(customers,filterName.value)
                        
                    break;
                    case "Active":
                         let aktive=customers.filter(x=>x.loans.filter(x=>x.closed!=true).length>1)
                         UI.displayCustomers(aktive);
                         if(filterName.value!="")
                         this.filterCustomerName(aktive,filterName.value)
                    break;
                    case "Deactive":
                    let deaktive=customers.filter(x=>x.loans.filter(x=>x.closed!=false).length>1)
                        UI.displayCustomers(deaktive);
                        if(filterName.value!="")
                        this.filterCustomerName(deaktive,filterName.value)
                    break;
                }
         
            
          
    
    }
    filterCustomerName(customers,filterNameparam)
    {
      
  console.log(filterNameparam)
      if(filterNameparam!=null)
        customers=customers.filter(x=>x.name.toLowerCase().includes(filterNameparam.toLowerCase()) || x.surname.toLowerCase().includes(filterNameparam.toLowerCase() )); 
         
      this.filterActiveLoan(customers,filterActiveLoan);
      UI.displayCustomers(customers);
     
 
    }

    filterMinMaxValue(customers,minValue=0,maxValue=100000000)
    {
      
      if(maxValue==0)
      {
        maxValue=100000;
      }
      minValue=Number(minValue);
      maxValue=Number(maxValue)
      
        customers=customers.filter(x=>x.salary.value>=Number(minValue) && x.salary.value<=Number(maxValue)); 
         UI.displayCustomers(customers);
    }
}
//Display Products

class UI {
  static displayCustomers(customers) {
    let result = "";
    customers.forEach((customer) => {
      let activeLoans = false;
      let loans = customer.loans;
      let loansLength = Object.keys(loans).length;
      let totalPayment = 0;
      let isApply = true;
      let hasLoanHistory=true;

      //ActiveLoansStatus
      for (let i = 0; i < loansLength; i++) {
        if (loans[i].closed != true) {
          activeLoans = true;
          break;
        } else {
          activeLoans = false;
        }
      }
      //TotalPayment

      for (let i = 0; i < loansLength; i++) {
        if (loans[i].dueAmount.value != 0) {
          totalPayment += loans[i].perMonth.value;
        }
      }
      //ApplayLoan
      if (customer.salary.value * 0.45 > totalPayment) {
        isApply = true;
      } else {
        isApply = false;
      }
      //hasLoanHistory
 
      result += `  <tr>
     
      <td>${customer.name} ${customer.surname}</td>
       <td style="width:15%" >
			      <img src="${customer.img}" style="height:auto" class="w-100 img-fluid img-thumbnail" alt="${customer.name} image">
	    </td>
      <td>${customer.salary.value} ${customer.salary.currency}</td>
      <td>  <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        disabled
        ${activeLoans ? `checked` : ``}
        value="" 
        id="flexCheckDefault"
      />
    </div> 
      </td>
      <td>
       ${totalPayment.toFixed(2)} ${customer.loans[0].perMonth.currency}
      </td>
     
      <td>
      ${
        isApply
          ? `<button type="button" class="btn btn-success disabled">Uyğundur</button>`
          : ` <button type="button" class="btn btn-danger disabled">Uyğun deyil</button>`
      }
      </td>
      <td>
      ${(customer.hasLoanHistory?` <button data-id=${customer.id} type="button" data-toggle="modal" data-target="#exampleModal" class="btn btn-primary btnLoanHistory">Kredit Tarixçəsi</button>` : ` <button type="button" data-id=${customer.id} class="btn btn-warning " disabled>Kredit Tarixçəsi Yoxdur</button> ` )}
  
      </td>
    </tr>`;
    });
    customerDOM.innerHTML = result;
  }
  displayLoanTable(loaners){
    let loanersResult="";
    loaners.forEach(loan=>{
        loanersResult+=`
        <tr>
        <td >${loan.loaner}</td>
        <td >${loan.amount.value} ${loan.amount.currency}</td>
        <td>  <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          disabled
          ${!loan.closed ? `checked` : ``}
          value="" 
          id="flexCheckDefault"
        />
      </div> 
        </td>
     <td >${loan.dueAmount.value!=0 ? loan.perMonth.value +` ` +  loan.perMonth.currency:`<span class="text-success font-weight-bold">Ödənilib</span>`}</td>
        <td >${loan.dueAmount.value} ${loan.dueAmount.currency}</td>
        <td >${loan.loanPeriod.start} - ${loan.loanPeriod.end}</td>
      </tr>

        `
    })
    loanersDOM.innerHTML=loanersResult;
  }
}



document.addEventListener("DOMContentLoaded", () => {
  
  const ui = new UI();
  const customer = new Customer();
  const filteritems=new FilterDatas();
  customer.getCustomers().then((data) => {
    UI.displayCustomers(data);

    filterName.addEventListener("keyup",()=>{
    
      
      filteritems.filterCustomerName(data,filterName.value)
      
    })
    filterName.addEventListener("keydown",()=>{
    
      
      filteritems.filterCustomerName(data,filterName.value)
      
    })
    minValue.addEventListener("keyup",MaxMinValue)
    minValue.addEventListener("change",MaxMinValue)
    minValue.addEventListener("click",MaxMinValue)

    maxValue.addEventListener("keyup",MaxMinValue)
    maxValue.addEventListener("change",MaxMinValue)
    maxValue.addEventListener("click",MaxMinValue)
    for (let i = 0; i < Array.from(filterActiveLoan).length; i++) {
    
      filterActiveLoan=Array.from(filterActiveLoan);
      filterActiveLoan[i].addEventListener("change",function(e){
          let filterText=e.target.value;
          filteritems.filterActiveLoan(data,filterText);
      })
    }

    function MaxMinValue(){
      filteritems.filterMinMaxValue(data,minValue.value,maxValue.value);
    }
    
   
   
  });
  
  window.addEventListener("click",function(e){
    
    if(e.target.tagName=="BUTTON")
    {
        let dataid=e.target.getAttribute('data-id');
        customer.getCustomerById(dataid).then(data=>{
            ui.displayLoanTable(data.loans)
        })
    }
    
  })
  
 
});

