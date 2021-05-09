let customerDOM = document.querySelector("#customerDatas");
let modalTitle=document.querySelector('.modal-title');
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
 
}



document.addEventListener("DOMContentLoaded", () => {
  
  const ui = new UI();
  const customer = new Customer();

  customer.getCustomers().then((data) => {
    UI.displayCustomers(data);

    
   
});

})

