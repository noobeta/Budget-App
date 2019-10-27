var budgetController = (function(){

    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculateTotal= function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type]=sum;
    }
    var data = {
        allItems:{
            exp:[], //array of objects of type Expense
            inc:[]  //array of objects of type Income
        },
        totals:{
            exp: 0,
            inc: 0
        },
        budget : 0,
        percentage : -1
    }
    return {
        addItem: function(type,des,val){
            var newItem,ID;
            //create new ID
            if(data.allItems[type].length>0)
                {
                    ID = data.allItems[type][data.allItems[type].length-1].id+1;
                }
            else
                {
                    ID = 0;
                }
            //create new item based on 'exp' or 'inc'
            if(type==='exp'){
                newItem = new Expense(ID,des,val);
            }else if(type === 'inc' ){
                newItem = new Income(ID,des,val);
            }
            //push into datastructure
            data.allItems[type].push(newItem);
            //return the new element
            return newItem;
        },
        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc>0 && data.budget>0){
                data.percentage = Math.round(((data.totals.exp / data.totals.inc))*100);
            }else{
                data.percentage = -1;
            }
        },
        getBudget:function(){
            return {
                budget : data.budget,
                percentage : data.percentage,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp
            };
        }
    }


})();






var UiController = (function(){

    var DOMstrings = {
        inputType :'.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage'
    };
    return{
        getInput:function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
                
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            //create HTML string with placeholder text
            
            if(type === 'exp'){
                //expense html place holder
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }else if(type === 'inc'){
                //income html place holder
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            console.log(obj.id,obj.description,obj.value);
            //Replace the placeholder text with some actual data
            html = html.replace('%value%', obj.value);
            html = html.replace('%id%', obj.id);
            html = html.replace('%description%', obj.description);
            newHtml = html;
          //  newHtml = html.replace('%value%', obj.value);
            

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        getDOMstrings:function(){
            return DOMstrings;
        },
        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current,index,array){
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget : function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            if(obj.percentage>0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        }



    };
    

})();





var controller = (function(budgetCtrl,UICtrl){

    var setUpEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13)
                ctrlAddItem();
        });
    };

    var updateBudget = function(){
        //calculate the total budget
        budgetCtrl.calculateBudget();
        //get the calculated budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);

        //update the ui with the new values of budget
        UICtrl.displayBudget(budget);

    };

    var ctrlAddItem = function(){
        var input,newItem;
        
        //Get the field input data
        input = UICtrl.getInput();
        if(input.description!=="" && !isNaN(input.value) && input.value > 0){
            //add item to the budget controller
            newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            //add item to UI
            UICtrl.addListItem(newItem,input.type);
            //empty the input
            UICtrl.clearFields();
            //calculate the budget
            updateBudget();
        }
    };

    return{
        init: function(){
            setUpEventListeners();
            
        UICtrl.displayBudget({
            
                budget : 0,
                percentage : -1,
                totalInc : 0,
                totalExp : 0
        });
        }
    };
})(budgetController,UiController);

controller.init();