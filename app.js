
//BUDGET CONTROLLER
const budgetController = (function() {

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

    const allExpanses = [];
    const allIncomes = [];
    const totalExpanses = 0;

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            
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

        testing: function() {
            console.log(data);
        }
    };

})();

//UI CONTROLLER
const UIcontroller = (function() {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function() {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type) {
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

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


//GLOBAL APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
        
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
 
        });

    };



    const ctrlAddItem = function() {
        let input, newItem;
        //1. Get the field input data
        input = UICtrl.getInput();

        //2. Add the item to the budet controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //4. Calculate the budget
        //5. Display the budget on the UI
     }

     return {
         init: function() {
             console.log('application has started.');
             setupEventListeners();
         }
     }

})(budgetController, UIcontroller); 

controller.init();