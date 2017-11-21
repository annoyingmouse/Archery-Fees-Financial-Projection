class Raw {
    constructor(hashedInputs) {
        this.inputs = {};
        this.data = [];
        this.types = {
            "checkbox": (item) => this.inputs[item] = document.getElementById(item).checked,
            "number": (item) => this.inputs[item] = parseInt(document.getElementById(item).value, 10),
            "select-one": (item) => this.inputs[item] = parseInt(document.getElementById(item).value, 10),
            "textarea": (item) => this.inputs[item] = document.getElementById(item).value,
            "text": (item) => this.inputs[item] = document.getElementById(item).value
        };
        this.defaultFields = ["purse", "subscribers", "subscription", "indoor", "outdoor", "misc", "includes", "memberships", "extras", "projection", "explanation", "includes"]

        if(hashedInputs){
            this.getHashes(hashedInputs)
        }else{
            this.getInputs();
        }
        this.getData();
    }
    getHashes(hash){
        Object.keys(hash).forEach((item) =>
            (this.types[document.getElementById(item).type] || this.types["text"])(item), this);
    }
    getInputs(){
        this.defaultFields.forEach((item) =>
            (this.types[document.getElementById(item).type] || this.types["text"])(item), this);
    }
    toString() {
        return Object.keys(this.inputs).map(i => `${i}=${this.inputs[i]}`).join("&");
    }
    getData() {
        this.data = [];
        let year = 2001;
        let month = 3;
        let localTotal = this.inputs.purse;
        let periods = this.inputs.projection * 12;
        for (let i = 0; i < periods; i++) {
            this.data.push({
                "date": new Date(year, month, 1),
                "close": localTotal
            });
            if (month === 11) {
                month = 0;
                year++;
            }
            if (month === 9 && this.inputs.includes) {
                localTotal -= this.inputs.subscribers * this.inputs.memberships
            }
            localTotal += this.inputs.subscribers * this.inputs.subscription;
            localTotal += this.inputs.extras;
            localTotal -= (month >= 3 && month < 9) ? this.inputs.indoor : this.inputs.outdoor;
            localTotal -= this.inputs.misc;
            month++;
        }
    }
}