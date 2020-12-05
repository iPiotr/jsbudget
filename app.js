
//BUDGET CONTROLLER
const budgetController = (() => {

     const Expense = function(id, description, value) {
         this.id = id;
         this.description = description;
         this.value = value;
     };

     const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });
        
        data.totals[type] = sum;

    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        procentage: -1
    };

    return {
        addItem: (type, des, val) => {
            
            let newItem, ID;

            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem =  new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data structure
            data.allItems[type].push(newItem);
            return newItem;

        },

        calculateBudget: () => {
            //calculate total income and expanses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expamses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if(data.totals.inc > 0) {
                data.procentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.procentage = -1;
            }

        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                procentage: data.procentage
            }
        },

        testing: () => {
            console.log(data);
        }
    };

})();

//UI CONTROLLER
const UIcontroller = (() => {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: () => {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: (obj, type) => {
            let html, newHtml, element;

            //Create HTML string with placeholder text
            if(type === 'inc') {
                
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-%0%"> <div class="item__description">%description%</div> <div class="right clearfix">
                <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline">
                </i></i></button> </div> </div> </div>`

            } else if(type === 'exp') {

                element = DOMstrings.expensesContainer;
                html = `<div class="item clearfix" id="expense-%0%"><div class="item__description">%description%</div><div class="right clearfix">
                <div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>`
            }
                //Replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);

                //Insert the HTML into the DOM

                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: () => {
            let fields, fieldsArr;
            fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach((current, index, array) => {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        getDOMstrings: () => {
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
const controller = ((budgetCtrl, UICtrl) => {

    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (event) => {
        
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
 
        });

    };

    const updateBudget = () => {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        const budget = budgetCtrl.getBudget();
        
        //3. Display the budget on the UI
        console.log(budget);

    };

    const ctrlAddItem = () => {
        let input, newItem;
        //1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

        //2. Add the item to the budet controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        //4. Clear the fileds
        UICtrl.clearFields();

        //5. Calculate and update budget
        updateBudget();

        }

     }

     return {
         init: () => {
             console.log('application has started.');
             setupEventListeners();
         }
     }

})(budgetController, UIcontroller); 

controller.init();